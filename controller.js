// ******* Selections ******** //
//prettier-ignore
import { playOnStartTone, trueAnswerTone, falseAnswerTone, playOnLevelEndTone } from './modules/audio.js';
//prettier-ignore
import { startTimer, quitGame,  resetFlag, } from './modules/model.js';
//prettier-ignore
import { greenThumbFlash, redThumbFlash, cheerMessage, paintGreenBackground, paintRedBackground, clearFields, makeVisibleOnStart, disableBtnWhenHidden, enableBtnWhenVisible, hideStartBtn, checkLength} from './modules/view.js';

////////////////////////////////////////
//*** Buttons ***//
export const startBtn = document.querySelector('.start');
export const restartLevelBtn = document.querySelector('.restart');
export const quitBtn = document.querySelector('.quit');
///////////////////////////////////////////////////////
const languageChoice = document.getElementById('language');
const continentChoice = document.getElementById('continents');
export const flag = document.querySelector('.flag');
////////////////////////////////////////////////////////
export const answersGrid = document.querySelector('.answers-grid');
const answers = document.querySelectorAll('.answers');
export const choices = document.querySelectorAll('.choices');
const hits = document.getElementById('hits');
const misses = document.getElementById('misses');
export const thumbUpIcon = document.getElementById('up');
export const thumbDownIcon = document.getElementById('down');
//////////////////////////////////////////////////////////
export const gameInfo = document.getElementById('game-info-text');
export const time = document.querySelector('.time');
const additionalInfoContainer = document.querySelector(
  '.additional-info-container'
);
export const additionalInfo = document.querySelector('.additional-info');
export const totalFlagsInLevel = document.querySelector(
  '.total-flags-in-level'
);
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function init() {
  clearFields();
  resetFlag();
  disableBtnWhenHidden(restartLevelBtn);
  disableBtnWhenHidden(quitBtn);
}

init();

class Continent {
  constructor(statesArray) {
    this.statesArray = statesArray;
    this.initialLength = statesArray.length;
    this.currentState = '';
    this.currentData = '';
    this.statesArrayEmpty = [];
    this.counterPos = 0;
    this.counterNeg = 0;
    this.levelIsEnded = false;
  }
  // Knuth-Yates shuffle function - ///// Borowed Code /////
  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  randomState() {
    // After shuffling, last state from the array is picked
    const pickedState = this.statesArray.pop();
    const path = `url(images/flags/${continentChoice.value}/${pickedState}.jpg)`;
    flag.style.backgroundImage = path;
    // Set value of current state to be pickedState
    this.currentState = pickedState;
    // Push pickedState to 'this.statesArrayEmpty'
    this.statesArrayEmpty.push(pickedState);
    // Check if level is ended
    if (this.statesArrayEmpty.length > this.initialLength) {
      this.levelIsEnded = true;
      playOnLevelEndTone();
      resetFlag();
      clearFields();
      choices.forEach(choice => {
        choice.classList.add('hidden');
      });
      answersGrid.style.pointerEvents = 'none';
      gameInfo.textContent = `Congratulations ! You had ${this.counterPos} correct, and ${this.counterNeg} wrong answers !`;
    }

    return pickedState;
  }

  displayAnswer() {
    const randNum = Math.floor(Math.random() * choices.length);
    const randField = choices[randNum];
    ////////////////////////////////////////////////////
    const parent = randField.closest('.answers');
    this.currentData = parent.dataset.field;

    randField.textContent = this.currentState;
    checkLength(randField, 14);

    return randField;
  }

  otherAnswers() {
    choices.forEach((field, i) => {
      if (field.textContent === '') {
        field.textContent = this.statesArray[i];
        checkLength(field, 14);

        // Fillig empty fields from statesArrayEmpty when statesArray.length is less than 5
        if (this.statesArray.length < 5) {
          field.textContent = this.statesArrayEmpty[i];
          checkLength(field, 14);
        }
      }
    });
  }

  trueAnswer() {
    answersGrid.addEventListener(
      'click',
      function (e) {
        if (e.target.dataset.field === this.currentData) {
          e.stopImmediatePropagation();
          greenThumbFlash();
          trueAnswerTone();
          cheerMessage();
          this.addPlus();
          paintGreenBackground(e.target.closest('.answers'));
          setTimeout(() => {
            init();
          }, 2800);
          setTimeout(() => {
            gameFlow(mainHub());
          }, 3500);
        }
      }.bind(this)
    );
  }

  wrongAnswer() {
    answersGrid.addEventListener(
      'click',
      function (e) {
        const trueField = Array.from(answers).find(
          div => div.dataset.field === this.currentData
        );

        if (e.target.dataset.field !== this.currentData) {
          e.stopImmediatePropagation();
          redThumbFlash();
          falseAnswerTone();
          this.addMinus();
          this.wrongAnswerMessage();
          paintRedBackground(e.target.closest('.answers'));
          setTimeout(() => {
            paintGreenBackground(trueField);
          }, 200);
          setTimeout(() => {
            init();
          }, 3500);
          setTimeout(() => {
            gameFlow(mainHub());
          }, 4000);
        }
      }.bind(this)
    );
  }

  wrongAnswerMessage() {
    const trueAnswer = `${this.currentState.toUpperCase()}`;
    return (gameInfo.textContent = `Wrong Answer ! The Correct Answer was ${trueAnswer}`);
  }

  displayTotalNumOfFlags() {
    totalFlagsInLevel.textContent = this.initialLength;
  }

  addPlus() {
    this.counterPos++;
    return (hits.textContent = String(this.counterPos).padStart(2, 0));
  }

  addMinus() {
    this.counterNeg++;
    return (misses.textContent = String(this.counterNeg).padStart(2, 0));
  }
}

//prettier-ignore
const europe = new Continent(["albania", "andorra", "armenia", "austria", "azerbaijan", "belarus", "belgium", "bosnia_and_herzegovina", "bulgaria", "croatia", "cyprus", "czech_republic", "denmark", "estonia", "finland", "france", "georgia", "germany", "greece", "hungary", "iceland", "ireland", "italy", "latvia", "liechtenstein", "lithuania", "luxembourg", "malta", "moldova", "monaco", "montenegro", "netherlands", "north_macedonia", "norway", "poland", "portugal", "romania", "russia", "san_marino", "serbia", "slovakia", "slovenia", "spain", "sweden", "switzerland", "turkey", "ukraine", "united_kingdom", "vatican"]);
//prettier-ignore
const asia = new Continent(["afghanistan", "armenia", "azerbaijan", "bahrain", "bangladesh", "bhutan", "brunei", "cambodia", "china"]);
//prettier-ignore
const africa = new Continent(["algeria", "angola", "benin", "botswana", "burkina_faso", "burundi", "cape_verde"]);
//prettier-ignore
const america = new Continent(["antigua_and_barbuda", "argentina", "bahamas", "barbados", "belize", "bolivia"]);
//prettier-ignore
const australia = new Continent(["australia", "fiji", "kiribati", "marshall_islands", "micronesia", "nauru", "new_zealand", "palau"]);
//prettier-ignore
const world = new Continent(["argentina", "bahamas", "barbados", "belize", "bolivia", "brazil", "canada", "chile", "colombia", "costa_rica"]);
//prettier-ignore
const bonus = new Continent(["abkhazia", "adygea", "ajaria", "aland", "alderney", "altai_republic", "american_samoa", "anguilla", "antarctica"]);

/////////////////////////////////////////////////////////////////
// console.log(europe);
////////////////////////////////////////////////////////////////

const fromStringToVar = {
  europe: europe,
  asia: asia,
  africa: africa,
  america: america,
  australia: australia,
  world: world,
  bonus: bonus,
};

// const listenForContinentChange = function () {
//   console.log(continentChoice.value);
//   return continentChoice.value;
// };
// console.log(listenForContinentChange());
// const object = listenForContinentChange();

export function mainHub() {
  return fromStringToVar[continentChoice.value];
}

export function levelIsEnded(object) {
  return object.levelIsEnded;
}

function gameFlow(object) {
  object.shuffle(object.statesArray);
  object.randomState();
  object.displayAnswer();
  object.otherAnswers();
  object.trueAnswer();
  object.wrongAnswer();
  object.displayTotalNumOfFlags();
}

function startGame() {
  playOnStartTone();
  makeVisibleOnStart();
  hideStartBtn();
  startTimer();
  enableBtnWhenVisible(restartLevelBtn);
  enableBtnWhenVisible(quitBtn);
  mainHub();
  gameFlow(mainHub());
}

// console.log(mainHub());
/////////////////////////////////////////////////////////////////////

startBtn.addEventListener('click', startGame);
// continentChoice.addEventListener('change', listenForContinentChange);
// restartLevelBtn.addEventListener('click', stopTimer);
continentChoice.addEventListener('change', mainHub);
quitBtn.addEventListener('click', quitGame);

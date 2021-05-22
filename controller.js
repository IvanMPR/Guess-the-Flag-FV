// ******* Selections ******** //
//prettier-ignore
import { playOnStartTone, trueAnswerTone, falseAnswerTone, playOnLevelEndTone } from './modules/audio.js';
import { startTimer } from './modules/model.js';
//prettier-ignore
import { greenThumbFlash, redThumbFlash, cheerMessage, paintGreenBackground, paintRedBackground, clearFields} from './modules/view.js';

////////////////////////////////////////
//*** Buttons ***//
const startBtn = document.querySelector('.start');
const restartLevelBtn = document.querySelector('.restart');
export const quitBtn = document.querySelector('.quit');
///////////////////////////////////////////////////////
const languageChoice = document.getElementById('language');
const continentChoice = document.getElementById('continents');
const flag = document.querySelector('.flag');
////////////////////////////////////////////////////////
const answersGrid = document.querySelector('.answers-grid');
export const choices = document.querySelectorAll('.choices');
const hits = document.getElementById('hits');
const misses = document.getElementById('misses');
//////////////////////////////////////////////////////////
export const gameInfo = document.getElementById('game-info-text');
export const time = document.querySelector('.time');
const additionalInfoContainer = document.querySelector(
  '.additional-info-container'
);
const additionalInfo = document.querySelector('.additional-info');
export const totalFlagsInLevel = document.querySelector(
  '.total-flags-in-level'
);
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

init();

function makeVisibleOnStart() {
  restartLevelBtn.classList.remove('hidden');
  quitBtn.classList.remove('hidden');
  totalFlagsInLevel.classList.remove('hidden');
  time.classList.remove('hidden');
  additionalInfo.classList.remove('hidden');
  restartLevelBtn.classList.add('visible');
  quitBtn.classList.add('visible');
  totalFlagsInLevel.classList.add('visible');
  time.classList.add('visible');
  additionalInfo.classList.add('visible');
}

// function stopTimer() {
//   clearInterval(startTimer);
// }

function resetFlag() {
  const path = 'url(images/empty.jpg)';
  flag.style.backgroundImage = path;
}

function disableBtnWhenHidden(el) {
  if (el.classList.contains('hidden')) {
    el.disabled = true;
    el.style.cursor = 'default';
  }
}

function enableBtnWhenVisible(el) {
  if (el.classList.contains('visible')) {
    el.disabled = false;
    el.style.cursor = 'pointer';
  }
}

function hideStartBtn() {
  startBtn.classList.add('hidden');
  disableBtnWhenHidden(startBtn);
}

function quitGame() {
  location.reload();
}

function init() {
  clearFields();
  resetFlag();
  disableBtnWhenHidden(restartLevelBtn);
  disableBtnWhenHidden(quitBtn);
}

class Continent {
  constructor(statesArray) {
    this.statesArray = statesArray;
    this.statesArrayClone = statesArray.slice();
    this.initialLength = statesArray.length;
    this.counterPos = 5;
    this.counterNeg = 3;
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
    const pickedState = this.statesArray[this.statesArray.length - 1];
    const path = `url(images/flags/${continentChoice.value}/${pickedState}.jpg)`;
    flag.style.backgroundImage = path;

    return pickedState;
  }

  displayAnswer(pickedState) {
    const randNum = Math.floor(Math.random() * choices.length);
    const randField = choices[randNum];
    randField.classList.add('true');
    randField.closest('.answers').classList.add('true');
    randField.textContent = pickedState;

    return randField;
  }

  otherAnswers() {
    choices.forEach((field, i) => {
      if (field.textContent === '') {
        field.classList.add('false');
        field.textContent = this.statesArray[i];
      }
    });
  }

  trueAnswer() {
    answersGrid.addEventListener(
      'click',
      function (e) {
        if (e.target.classList.contains('true')) {
          greenThumbFlash();
          trueAnswerTone();
          cheerMessage();
          this.increaseCounter();
          paintGreenBackground(e.target.closest('.answers'));
        }
      }.bind(this)
    );
  }

  wrongAnswer() {
    answersGrid.addEventListener('click', function (e) {
      if (!e.target.classList.contains('true')) {
        redThumbFlash();
        falseAnswerTone();
        paintRedBackground(e.target.closest('.answers'));
      }
    });
  }

  displayTotalNumOfFlags() {
    totalFlagsInLevel.textContent = this.initialLength;
  }

  increaseCounter() {
    this.counterPos++;
    return console.log(this.counterPos);
  }
}

//prettier-ignore
const europe = new Continent(["albania", "andorra", "armenia", "austria", "azerbaijan", "belarus"]);
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

function mainHub() {
  return fromStringToVar[continentChoice.value];
}
function gameFlow(object) {
  object.shuffle(object.statesArray);
  object.displayAnswer(object.randomState());
  object.otherAnswers();
  object.trueAnswer();
  object.wrongAnswer();
  object.displayTotalNumOfFlags();
}

console.log(world);
/////////////////////////////////////////////////////////////////////

startBtn.addEventListener('click', startGame);
// continentChoice.addEventListener('change', listenForContinentChange);
// restartLevelBtn.addEventListener('click', greenThumbFlash);
continentChoice.addEventListener('change', mainHub);
quitBtn.addEventListener('click', quitGame);

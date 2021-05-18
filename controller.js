// ******* Selections ******** //
//prettier-ignore
import { playOnStartTone, trueAnswerTone, falseAnswerTone, playOnLevelEndTone } from './modules/audio.js';
import { startTimer } from './modules/model.js';
import { greenThumbFlash, redThumbFlash } from './modules/view.js';

////////////////////////////////////////
//*** Buttons ***//
const startBtn = document.querySelector('.start');
const restartLevelBtn = document.querySelector('.restart');
export const quitBtn = document.querySelector('.quit');
///////////////////////////////////////////////////////
const languageChoice = document.getElementById('language').value;
const continentChoice = document.getElementById('continents').value;
const flag = document.querySelector('.flag');
////////////////////////////////////////////////////////
const answersGrid = document.querySelector('.answers-grid');
const choices = document.querySelectorAll('.choices');
const hits = document.getElementById('hits');
const misses = document.getElementById('misses');
//////////////////////////////////////////////////////////
const gameInfo = document.getElementById('game-info-text');
export const time = document.querySelector('.time');
const additionalInfoContainer = document.querySelector(
  '.additional-info-container'
);
const additionalInfo = document.querySelector('.additional-info');
const totalFlagsInLevel = document.querySelector('.total-flags-in-level');
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
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

function clearFields() {
  gameInfo.textContent = '';
  choices.forEach(choice => {
    choice.textContent = '';
    choice.classList.remove('true', 'false');
  });
}
function resetFlag() {
  const path = 'url(images/empty.jpg)';
  flag.style.backgroundImage = path;
}
function hideStartBtn() {
  startBtn.classList.add('hidden');
}
function quitGame() {
  location.reload();
}

function init() {
  clearFields();
  resetFlag();
  hideStartBtn();
  playOnStartTone();
  startTimer();
}

class Continent {
  constructor(array) {
    this.array = array;
  }
  //Knuth - Yates shuffle-shuffles states array every run(note! once would be enough)
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
}

//prettier-ignore
const europe = new Continent(["albania", "andorra", "armenia", "austria", "azerbaijan", "belarus"]);
//prettier-ignore
const asia = new Continent(["afghanistan", "armenia", "azerbaijan", "bahrain", "bangladesh", "bhutan", "brunei", "cambodia", "china"]);
//prettier-ignore
const africa = new Continent(["algeria", "angola ", "benin", "botswana", "burkina_faso", "burundi", "cape_verde"]);
//prettier-ignore
const america = new Continent(["antigua_and_barbuda", "argentina", "bahamas", "barbados", "belize", "bolivia"]);
//prettier-ignore
const australia = new Continent(["australia", "fiji", "kiribati", "marshall_islands", "micronesia", "nauru", "new_zealand", "palau"]);
//prettier-ignore
const world = new Continent(["argentina", "bahamas", "barbados", "belize", "bolivia", "brazil", "canada", "chile", "colombia", "costa_rica"]);
//prettier-ignore
const bonus = new Continent(["abkhazia", "adygea", "ajaria", "aland", "alderney", "altai_republic", "american_samoa", "anguilla", "antarctica"]);

console.log(asia.shuffle(asia.array));
console.log(europe.shuffle(europe.array));
console.log(world.array);
console.log(continentChoice);
console.log(languageChoice);
/////////////////////////////////////////////////////////////////////

startBtn.addEventListener('click', init);
startBtn.addEventListener('click', makeVisibleOnStart);
restartLevelBtn.addEventListener('click', greenThumbFlash);

quitBtn.addEventListener('click', quitGame);

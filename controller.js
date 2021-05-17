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
const languageChoice = document.getElementById('language');
const continentChoice = document.getElementById('continents');
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

startBtn.addEventListener('click', init);
startBtn.addEventListener('click', makeVisibleOnStart);
restartLevelBtn.addEventListener('click', greenThumbFlash);
quitBtn.addEventListener('click', quitGame);

class Continent {
  constructor(countriesArray) {
    this.countriesArray = countriesArray;
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
/////////////////////////////////////////////////////////////////////

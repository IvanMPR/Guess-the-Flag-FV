// ******* Selections ******** //
//prettier-ignore
import { playOnStartTone, trueAnswerTone, falseAnswerTone, playOnLevelEndTone } from './modules/audio.js';
import { startTimer } from './modules/model.js';
////////////////////////////////////////
//*** Buttons ***//
const startBtn = document.querySelector('.start');
const restartLevelBtn = document.querySelector('.restart');
const quitBtn = document.querySelector('.quit');
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

function init() {
  clearFields();
  resetFlag();
  hideStartBtn();
  playOnStartTone();
  startTimer();
}

/////////////////////////////////////////////////////////////////////
// Test selection and audio helper functions
// function checkSelection(element) {
//   // console.log(element);
//   // element.forEach(div => div.classList.add('hidden'));
//   element.classList.add('hidden');
// }
// checkSelection(additionalInfoContainer);

startBtn.addEventListener('click', init);
startBtn.addEventListener('click', makeVisibleOnStart);

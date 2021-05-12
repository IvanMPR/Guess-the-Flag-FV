'use strict';
// ******* Selections ******** //
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
const answers = document.querySelectorAll('.answers');
const hits = document.getElementById('hits');
const misses = document.getElementById('misses');
//////////////////////////////////////////////////////////
const gameInfo = document.getElementById('game-info-text');
const timer = document.querySelector('.timer');
const additionalInfoContainer = document.querySelector(
  '.additional-info-container'
);
const totalFlagsInLevel = document.querySelector('.total-flags-in-level');
////////////////////////////////////////////////////////////////////
/*** Audio elements***/
const startSound = new Audio(
  'sounds/positive/330052__paulmorek__beep-05-positive.wav'
);
const trueAswerSound = new Audio('sounds/positive/528862__eponn__beep-4.wav');
const falseAswerSound = new Audio(
  'sounds/negative/253886__themusicalnomad__negative-beeps.wav'
);
const levelEndSound = new Audio(
  'sounds/positive/320775__rhodesmas__win-02.wav'
);
/////////////////////////////////////////////////////////////////////
function checkSelection(element) {
  // console.log(element);
  // element.forEach(div => div.classList.add('hidden'));
  element.classList.add('hidden');
}
// checkSelection(additionalInfoContainer);

// startBtn.addEventListener('click', () => {
//   levelEndSound.play();
// });

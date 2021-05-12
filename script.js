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
const startSound = document.getElementById('start-sound');
const trueAswerSound = document.getElementById('positive');
const falseAswerSound = document.getElementById('negative');
const levelEndSound = document.getElementById('level-end');
/////////////////////////////////////////////////////////////////////
function checkSelection(element) {
  // console.log(element);
  // element.forEach(div => div.classList.add('hidden'));
  element.classList.add('hidden');
}
// checkSelection(additionalInfoContainer);

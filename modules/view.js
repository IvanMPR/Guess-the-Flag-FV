//prettier-ignore
import { gameInfo, choices, restartLevelBtn, quitBtn, totalFlagsInLevel, time, additionalInfo, startBtn, thumbUpIcon, thumbDownIcon } from '../controller.js';

export function greenThumbFlash() {
  hits.classList.add('green-b-b');
  thumbUpIcon.classList.add('green-b-b');
  setTimeout(() => {
    hits.classList.remove('green-b-b');
    thumbUpIcon.classList.remove('green-b-b');
  }, 400);
}
export function redThumbFlash() {
  misses.classList.add('red-b-b');
  thumbDownIcon.classList.add('red-b-b');
  setTimeout(() => {
    misses.classList.remove('red-b-b');
    thumbDownIcon.classList.remove('red-b-b');
  }, 400);
}

export function cheerMessage() {
  //prettier-ignore
  const messages = ['Good Job', 'Nice Work', 'Way to Go', 'Keep Going', 'Awesome', 'Fantastic Work']
  const randomNumber = Math.floor(Math.random() * messages.length);
  return (gameInfo.textContent = `Correct Answer ! ${messages[randomNumber]} !`);
}

export function paintGreenBackground(element) {
  element.style.backgroundColor = 'var(--green-color)';
  setTimeout(() => {
    element.style.backgroundColor = 'var(--fields-background-color)';
  }, 400);
}

export function paintRedBackground(element) {
  element.style.backgroundColor = 'var(--red-color)';
  setTimeout(() => {
    element.style.backgroundColor = 'var(--fields-background-color)';
  }, 400);
}

export function clearFields() {
  gameInfo.textContent = '';
  choices.forEach(choice => {
    choice.textContent = '';
    choice.classList.remove('true', 'false');
    choice.closest('.answers').classList.remove('true', 'false');
  });
}

export function makeVisibleOnStart() {
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

export function disableBtnWhenHidden(el) {
  if (el.classList.contains('hidden')) {
    el.disabled = true;
    el.style.cursor = 'default';
  }
}

export function enableBtnWhenVisible(el) {
  if (el.classList.contains('visible')) {
    el.disabled = false;
    el.style.cursor = 'pointer';
  }
}

export function hideStartBtn() {
  startBtn.classList.add('hidden');
  disableBtnWhenHidden(startBtn);
}

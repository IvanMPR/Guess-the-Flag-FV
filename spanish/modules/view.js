//prettier-ignore
import { gameInfo, choices, restartLevelBtn, quitBtn, totalFlagsInLevel, time, additionalInfo, startBtn, thumbUpIcon, thumbDownIcon, answersGrid } from '../controller.js';

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
  const messages = ['Buen trabajo', 'Bien hecho', 'Muy bien', 'Sigue así']
  const randomNumber = Math.floor(Math.random() * messages.length);
  return (gameInfo.textContent = `La Respuesta Correcta ! ${messages[randomNumber]} !`);
}

export function paintGreenBackground(element) {
  element.style.backgroundColor = 'var(--green-color)';
}

export function paintRedBackground(element) {
  element.style.backgroundColor = 'var(--red-color)';
}

export function clearFields() {
  gameInfo.textContent = '';
  answersGrid.style.pointerEvents = 'initial';
  choices.forEach(choice => {
    choice.textContent = '';
    choice.style.fontSize = 'var(--default-font-size)';
    choice.closest('.answers').style.backgroundColor =
      'var(--fields-background-color)';
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
  choices.forEach(choice => {
    choice.classList.remove('hidden');
  });
  answersGrid.style.pointerEvents = 'initial';
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

export function checkLength(el, treshold) {
  if (el.textContent.length > treshold) {
    return (el.style.fontSize = 'var(--smaller-font-size)');
  }
}

export function removeUnderscore(el) {
  const regex = /_/g;
  return regex.test(el) ? el.split('_').join(' ') : el;
}

export function displayPastTime(el) {
  const [hours, minutes, seconds] = el.split(':');

  if (+hours === 0 && +seconds === 0) {
    return `${+minutes} minutos`;
  }
  if (+hours === 0) {
    return `${+minutes} ${
      +minutes === 1 ? 'minuto' : 'minutos'
    } y ${+seconds} ${+seconds === 1 ? 'segundo' : 'segundos'}`;
  }

  if (+hours !== 0) {
    return `${+hours} ${+hours === 1 ? 'hora' : 'horas'}, ${+minutes} ${
      +minutes === 1 ? 'minuto' : 'minutos'
    } y ${+seconds} ${+seconds === 1 ? 'segundo' : 'segundos'}`;
  }
}

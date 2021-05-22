import { gameInfo, choices } from '../controller.js';

export function greenThumbFlash() {
  hits.classList.add('green-b-b');
  setTimeout(() => {
    hits.classList.remove('green-b-b');
  }, 400);
}
export function redThumbFlash() {
  misses.classList.add('red-b-b');
  setTimeout(() => {
    misses.classList.remove('red-b-b');
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

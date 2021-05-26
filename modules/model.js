import { time, flag, mainHub, levelIsEnded } from '../controller.js';

export const startTimer = function () {
  let startPoint = 1;
  let hoursCount = 0;
  const timer = setInterval(() => {
    const seconds = String(Math.trunc(startPoint % 60)).padStart(2, 0);
    const minutes = String(Math.trunc(startPoint / 60)).padStart(2, 0);
    const hours = String(hoursCount).padStart(2, 0);
    if (startPoint === 3600) {
      hoursCount <= 22 ? hoursCount++ : (hoursCount = 0);
      startPoint = 1;
    }
    time.textContent = `${hours} : ${minutes} : ${seconds}`;
    startPoint++;
    if (levelIsEnded(mainHub())) clearInterval(timer);
  }, 1000);
};

export function quitGame() {
  location.reload();
}

export function resetFlag() {
  const path = 'url(images/empty.jpg)';
  flag.style.backgroundImage = path;
}

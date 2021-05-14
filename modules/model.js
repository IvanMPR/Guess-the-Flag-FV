import { time } from '../controller.js';

export const startTimer = function () {
  let startPoint = 1;
  const timer = setInterval(() => {
    const seconds = String(Math.trunc(startPoint % 60)).padStart(2, 0);
    // console.log(seconds);
    const minutes = String(Math.trunc(startPoint / 60)).padStart(2, 0);
    // console.log(minutes);
    const hours = String(Math.trunc(startPoint / 3600)).padStart(2, 0);

    time.textContent = `${hours} : ${minutes} : ${seconds}`;

    startPoint++;
  }, 1000);
};

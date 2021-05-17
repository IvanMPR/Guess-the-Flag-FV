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

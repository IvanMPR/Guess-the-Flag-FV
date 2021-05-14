/*** Audio elements***/
export const playOnStartTone = function () {
  const tone = new Audio(
    './sounds/positive/330052__paulmorek__beep-05-positive.wav'
  );
  return tone.play();
};
export const trueAswerTone = function () {
  const tone = new Audio('../sounds/positive/528862__eponn__beep-4.wav');
  return tone.play();
};
export const falseAswerTone = function () {
  const tone = new Audio(
    '../sounds/negative/253886__themusicalnomad__negative-beeps.wav'
  );
  return tone.play();
};
export const playOnLevelEndTone = function () {
  const tone = new Audio('../sounds/positive/320775__rhodesmas__win-02.wav');
  return tone.play();
};

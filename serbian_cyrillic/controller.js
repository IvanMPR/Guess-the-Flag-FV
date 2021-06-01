//prettier-ignore
import { playOnStartTone, trueAnswerTone, falseAnswerTone, playOnLevelEndTone } from './modules/audio.js';
//prettier-ignore
import { startTimer, quitGame,  resetFlag } from './modules/model.js';
//prettier-ignore
import { greenThumbFlash, redThumbFlash, cheerMessage, paintGreenBackground, paintRedBackground, clearFields, makeVisibleOnStart, disableBtnWhenHidden, enableBtnWhenVisible, hideStartBtn, checkLength, removeUnderscore, displayPastTime} from './modules/view.js';
// ******* Selections ******** //
/////////////////////////////////////////////////////////////
//*** Buttons ***//
export const startBtn = document.querySelector('.start');
export const restartLevelBtn = document.querySelector('.restart');
export const quitBtn = document.querySelector('.quit');
///////////////////////////////////////////////////////
export const languageChoice = document.getElementById('language');
export const continentChoice = document.getElementById('continents');
export const flag = document.querySelector('.flag');
////////////////////////////////////////////////////////
export const answersGrid = document.querySelector('.answers-grid');
const answers = document.querySelectorAll('.answers');
export const choices = document.querySelectorAll('.choices');
const hits = document.getElementById('hits');
const misses = document.getElementById('misses');
export const thumbUpIcon = document.getElementById('up');
export const thumbDownIcon = document.getElementById('down');
//////////////////////////////////////////////////////////
export const gameInfo = document.getElementById('game-info-text');
export const time = document.querySelector('.time');
const additionalInfoContainer = document.querySelector(
  '.additional-info-container'
);
export const additionalInfo = document.querySelector('.additional-info');
export const totalFlagsInLevel = document.querySelector(
  '.total-flags-in-level'
);
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function init() {
  clearFields();
  resetFlag();
  disableBtnWhenHidden(restartLevelBtn);
  disableBtnWhenHidden(quitBtn);
}

init();

class Continent {
  constructor(statesArray) {
    this.statesArray = statesArray;
    this.initialLength = statesArray.length;
    this.currentState = '';
    this.currentData = '';
    this.statesArrayEmpty = [];
    this.counterPos = 0;
    this.counterNeg = 0;
    this.levelIsEnded = false;
  }
  // Knuth-Yates shuffle function - ///// Borowed Code /////
  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  randomState() {
    // After shuffling, last state from the array is picked ...
    const pickedState = this.statesArray.pop();
    const path = `url(images/${continentChoice.value}/${pickedState}.jpg)`;
    flag.style.backgroundImage = path;
    // Set value of current state to be pickedState
    this.currentState = pickedState;
    // Push pickedState to 'this.statesArrayEmpty'
    this.statesArrayEmpty.push(pickedState);
    // Check if level is ended
    if (this.statesArrayEmpty.length > this.initialLength) {
      this.levelIsEnded = true;
      playOnLevelEndTone();
      resetFlag();
      clearFields();
      choices.forEach(choice => {
        choice.classList.add('hidden');
      });
      answersGrid.style.pointerEvents = 'none';
      gameInfo.textContent = `Честитке ! Имали сте  ${
        this.counterPos
      } тачних, и ${this.counterNeg} нетачних одговора за ${displayPastTime(
        time.textContent
      )} !`;
    }

    return pickedState;
  }

  displayAnswer() {
    //... and displayed in random field as true answer ...
    const randNum = Math.floor(Math.random() * choices.length);
    const randField = choices[randNum];
    ////////////////////////////////////////////////////
    const parent = randField.closest('.answers');
    this.currentData = parent.dataset.field;
    ////////////////////////////////////////////////////
    randField.textContent = removeUnderscore(this.currentState);
    checkLength(randField, 17);

    return randField;
  }

  otherAnswers() {
    //... while other fields are filled with random states ...
    choices.forEach((field, i) => {
      if (field.textContent === '') {
        field.textContent = removeUnderscore(this.statesArray[i]);
        checkLength(field, 17);

        // Fillig empty fields from statesArrayEmpty when statesArray.length is less than 5
        if (this.statesArray.length < 5) {
          field.textContent = removeUnderscore(this.statesArrayEmpty[i]);
          checkLength(field, 17);
        }
      }
    });
  }

  trueAnswer() {
    //... if the click happened on the true answer field, logic from below will be applied ...
    answersGrid.addEventListener(
      'click',
      function (e) {
        if (e.target.dataset.field === this.currentData) {
          e.stopImmediatePropagation();
          greenThumbFlash();
          trueAnswerTone();
          cheerMessage();
          this.addPlus();
          paintGreenBackground(e.target.closest('.answers'));
          answersGrid.style.pointerEvents = 'none';
          setTimeout(() => {
            init();
          }, 3100);
          setTimeout(() => {
            App(mainHub());
          }, 3500);
        }
      }.bind(this)
    );
  }

  wrongAnswer() {
    // ... and if the click happen on the field with false answer, code from below will run ...
    answersGrid.addEventListener(
      'click',
      function (e) {
        const trueField = Array.from(answers).find(
          div => div.dataset.field === this.currentData
        );

        if (e.target.dataset.field !== this.currentData) {
          e.stopImmediatePropagation();
          redThumbFlash();
          falseAnswerTone();
          this.addMinus();
          this.wrongAnswerMessage();
          paintRedBackground(e.target.closest('.answers'));
          answersGrid.style.pointerEvents = 'none';
          setTimeout(() => {
            paintGreenBackground(trueField);
          }, 200);
          setTimeout(() => {
            init();
          }, 3600);
          setTimeout(() => {
            App(mainHub());
          }, 4000);
        }
      }.bind(this)
    );
  }

  wrongAnswerMessage() {
    const trueAnswer = `${this.currentState.toUpperCase()}`;
    return (gameInfo.textContent = `Нетачан Одговор ! Тачан Одговор је  ${removeUnderscore(
      trueAnswer
    )}`);
  }

  displayTotalNumOfFlags() {
    totalFlagsInLevel.textContent = this.initialLength;
  }

  addPlus() {
    this.counterPos++;
    return (hits.textContent = String(this.counterPos).padStart(2, 0));
  }

  addMinus() {
    this.counterNeg++;
    return (misses.textContent = String(this.counterNeg).padStart(2, 0));
  }
}
////////////////////////////////////////////////////////////////
//prettier-ignore
const europe = new Continent(['албанија', 'андора', 'јерменија', 'аустрија', 'азербејџан', 'белорусија', 'белгија', 'босна_и_херцеговина', 'бугарска', 'хрватска', 'кипар', 'чешка', 'данска', 'естонија', 'финска', 'француска', 'грузија', 'немачка', 'грчка', 'мађарска', 'исланд', 'ирска', 'италија', 'летонија', 'лихтенштајн', 'литванија', 'луксембург', 'малта', 'молдавија', 'монако', 'црна_гора', 'холандија', 'северна_македонија', 'норвешка', 'пољска', 'португал', 'румунија', 'русија', 'сан_марино', 'србија', 'словачка', 'словенија', 'шпанија', 'шведска', 'швајцарска', 'турска', 'украјина', 'уједињено_краљевство', 'ватикан']);
//prettier-ignore
const asia = new Continent(['авганистан', 'јерменија', 'азербејџан', 'бахреин', 'бангладеш', 'бутан', 'брунеји', 'камбоџа', 'кина', 'индија', 'индонезија', 'иран', 'ирак', 'израел', 'јапан', 'јордан', 'казахстан', 'кувајт', 'киргистан', 'лаос', 'либан', 'малезија', 'малдиви', 'монголија', 'мијанмар', 'непал', 'северна_кореја', 'оман', 'пакистан', 'филипини', 'катар', 'русија', 'саудијска_арабија', 'сингапур', 'јужна_кореја', 'шри_ланка', 'сирија', 'тајван', 'таџикистан', 'тајланд', 'источни_тимор', 'турска', 'туркменистан', 'ујед._ар._емирати', 'узбекистан', 'вијетнам', 'јемен']);
//prettier-ignore
const africa = new Continent(['алжир', 'ангола', 'бенин', 'боцвана', 'буркина_фасо', 'бурунди', 'зеленортска_острва', 'камерун', 'централноафричка_реп.', 'чад', 'коморос', 'д._р._конго', 'џибути', 'египат', 'екваториј._гвинеја', 'еритреја', 'етиопија', 'габон', 'гамбија', 'гана', 'гвинеја', 'гвинеја_бисао', 'обала_слоноваче', 'кенија', 'лесото', 'либерија', 'либија', 'мадагаскар', 'малави', 'мали', 'мауританија', 'маурицијус', 'мароко', 'мозамбик', 'намибија', 'нигер', 'нигерија', 'република_конго', 'руанда', 'сао_томе_и_принсипе', 'сенегал', 'сејшели', 'сијера_леоне', 'сомалија', 'јужна_африка', 'јужни_судан', 'судан', 'свазиленд', 'танзанија', 'того', 'тунис', 'уганда', 'замбија', 'зимбабве']);
//prettier-ignore
const america = new Continent(['антигва_и_барбуда', 'аргентина', 'бахами', 'барбадос', 'белизе', 'боливија', 'бразил', 'канада', 'чиле', 'колумбија', 'костарика', 'куба', 'доминика', 'доминиканска_реп.', 'еквадор', 'ел_салвадор', 'гренада', 'гватемала', 'гвајана', 'хаити', 'хондурас', 'јамајка', 'мексико', 'никарагва', 'панама', 'парагвај', 'перу', 'сент_китс_и_невис', 'света_луција' , 'сент_винсент_и_грен.', 'суринам', 'тринидад_и_тобаго', 'уругвај', 'с.а.д.', 'венецуела']);
//prettier-ignore
const australia = new Continent(['аустралија', 'фиџи', 'кирибати','маршалска_острва', 'микронезија', 'науру', 'нови_зеланд', 'палау', 'папуа_нова_гвинеја', 'самоа', 'соломонска_острва', 'тонга', 'тувалу', 'вануату']);
//prettier-ignore
const world = new Continent(['авганистан', 'јерменија', 'азербејџан', 'бахреин', 'бангладеш', 'бутан', 'брунеји', 'камбоџа', 'кина',]);
//prettier-ignore
const bonus = new Continent(['абхазија', 'адигеја', 'аџарија', 'аланд', 'алдерни', 'република_алтај', 'америчка_самоа', 'ангвила', 'антарктик', 'аруба', 'башкортостан', 'бермуда', 'бих_федерација', 'бикини_атол', 'британска_антаркт._тер.', 'брит._индоокеан._тер.', 'бретања', 'бурјатија', 'кајманска_острва', 'чеченска_република', 'чечен._реп._ичкерија', 'ускршња_острва', 'чувашија', 'кукова_острва', 'крим', 'дагестан', 'енглеска', 'европска_унија', 'фокландска_острва', 'фарска_острва', 'француска_полинезија', 'фр._јуж._и_антарк._зем.', 'гибралтар', 'гренланд', 'гуам', 'гернзи', 'херм', 'хонг_конг', 'ингушетија', 'острво_мен', 'џерзи', 'кабардино_балкарија', 'калмикија', 'карачај_черкасија', 'каракалпакстан', 'карелија', 'кхакасија', 'коми', 'косово_и_метохија', 'кубан_народна_реп.', 'ладонија', 'лос_алтос', 'макао', 'мари_ел', 'монсерат', 'мордовија', 'нагорно_карабах', 'холандски_антили', 'нијуе', 'норфолк_острво', 'северна_осетија', 'сев._маријанска_ост.', 'палестина', 'острво_питкерн', 'порторико', 'република_српска', 'саба', 'свети_вартоломеј', 'света_хелена', 'свети_мартин', 'сент_пјер_и_микелон', 'сакха_република', 'сарк', 'суверени_силенд', 'сикким', 'сомалиланд', 'ј._џорџ._и_сенд._острва', 'јужна_осетија', 'сув._малтешки_војни_ред', 'тајван', 'татарстан', 'огњена_земља', 'токелау', 'транснистрија', 'тристан_де_куња', 'тур._реп._сев._кипар', 'туркс_и_каикос_острва', 'тува', 'удмуртија', 'брит._девичанска_ост.', 'ам._девичанска_острва', 'велс', 'западна_сахара']);
/////////////////////////////////////////////////////////////////

const fromStringToObj = {
  europe: europe,
  asia: asia,
  africa: africa,
  america: america,
  australia: australia,
  world: world,
  bonus: bonus,
};

export function mainHub() {
  return fromStringToObj[continentChoice.value];
}

export function levelIsEnded(object) {
  return object.levelIsEnded;
}

function App(object) {
  object.shuffle(object.statesArray);
  object.randomState();
  object.displayAnswer();
  object.otherAnswers();
  object.trueAnswer();
  object.wrongAnswer();
  object.displayTotalNumOfFlags();
}

function startGame() {
  playOnStartTone();
  makeVisibleOnStart();
  hideStartBtn();
  startTimer();
  enableBtnWhenVisible(restartLevelBtn);
  enableBtnWhenVisible(quitBtn);
  mainHub();
  App(mainHub());
}

function languageHub() {
  if (languageChoice.value === 'english') {
    window.location.assign('../index.html');
  }
  if (languageChoice.value === 'srpski') {
    window.location.assign('../serbian_latin/index.html');
  }
  if (languageChoice.value === 'espanol') {
    window.location.assign('../spanish/index.html');
  }
}

/////////////////////////////////////////////////////////////////////

window.addEventListener('load', function () {
  if (localStorage.getItem('index')) {
    continentChoice.options[localStorage.getItem('index')].selected = true;
  }
});
startBtn.addEventListener('click', startGame);
restartLevelBtn.addEventListener('click', function () {
  location.reload();
});
quitBtn.addEventListener('click', quitGame);
continentChoice.addEventListener('change', mainHub);
continentChoice.addEventListener('change', function () {
  localStorage.setItem('index', this.options[this.selectedIndex].index);
  location.reload();
});
languageChoice.addEventListener('change', languageHub);

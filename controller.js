//prettier-ignore
import { playOnStartTone, trueAnswerTone, falseAnswerTone, playOnLevelEndTone } from './modules/audio.js';
//prettier-ignore
import { startTimer, quitGame,  resetFlag } from './modules/model.js';
//prettier-ignore
import { greenThumbFlash, redThumbFlash, cheerMessage, paintGreenBackground, paintRedBackground, clearFields, makeVisibleOnStart, disableBtnWhenHidden, enableBtnWhenVisible, hideStartBtn, checkLength, removeUnderscore, displayPastTime} from './modules/view.js';
// ******* Selections ******** //
////////////////////////////////////////
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
    const path = `url(images/flags/${continentChoice.value}/${pickedState}.jpg)`;
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
      gameInfo.textContent = `Congratulations ! You had ${
        this.counterPos
      } correct, and ${this.counterNeg} wrong answers for ${displayPastTime(
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
    return (gameInfo.textContent = `Wrong Answer ! The Correct Answer was ${removeUnderscore(
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
const europe = new Continent(["albania", "andorra", "armenia", "austria", "azerbaijan", "belarus", "belgium", "bosnia_and_herzegovina", "bulgaria", "croatia", "cyprus", "czech_republic", "denmark", "estonia", "finland", "france", "georgia", "germany", "greece", "hungary", "iceland", "ireland", "italy", "latvia", "liechtenstein", "lithuania", "luxembourg", "malta", "moldova", "monaco", "montenegro", "netherlands", "north_macedonia", "norway", "poland", "portugal", "romania", "russia", "san_marino", "serbia", "slovakia", "slovenia", "spain", "sweden", "switzerland", "turkey", "ukraine", "united_kingdom", "vatican"]);
//prettier-ignore
const asia = new Continent(["afghanistan", "armenia", "azerbaijan", "bahrain", "bangladesh", "bhutan", "brunei", "cambodia", "china", "india", "indonesia", "iran", "iraq", "israel", "japan", "jordan", "kazakhstan", "kuwait", "kyrgyzstan", "laos", "lebanon", "malaysia", "maldives", "mongolia", "myanmar", "nepal", "north_korea", "oman", "pakistan", "philippines", "qatar", "russia", "saudi_arabia", "singapore", "south_korea", "sri_lanka", "syria", "taiwan", "tajikistan", "thailand", "east_timor", "turkey", "turkmenistan", "united_arab_emirates", "uzbekistan", "vietnam", "yemen"]);
//prettier-ignore
const africa = new Continent(["algeria", "angola ", "benin", "botswana", "burkina_faso", "burundi", "cape_verde", "cameroon", "central_african_rep", "chad", "comoros", "dem._republic_of_congo", "djibouti", "egypt", "equatorial_guinea", "eritrea", "ethiopia", "gabon", "gambia", "ghana", "guinea", "guinea_bissau", "ivory_coast", "kenya", "lesotho", "liberia", "libya", "madagascar", "malawi", "mali", "mauritania", "mauritius", "morocco", "mozambique", "namibia", "niger", "nigeria", "republic_of_kongo", "rwanda", "sao_tome_and_principe", "senegal", "seychelles", "sierra_leone", "somalia", "south_africa", "south_sudan", "sudan", "swaziland", "tanzania", "togo", "tunisia", "uganda", "zambia", "zimbabwe"]);
//prettier-ignore
const america = new Continent(["antigua_and_barbuda", "argentina", "bahamas", "barbados", "belize", "bolivia", "brazil", "canada", "chile", "colombia", "costa_rica", "cuba", "dominica", "dominican_republic", "ecuador", "el_salvador", "grenada", "guatemala", "guyana", "haiti", "honduras", "jamaica", "mexico", "nicaragua", "panama", "paraguay", "peru", "saint_kitts_and_nevis", "saint_lucia", "st_vincent_&_grenadines", "suriname", "trinidad_and_tobago", "uruguay", "u.s.a", "venezuela"]);
//prettier-ignore
const australia = new Continent(["australia", "fiji", "kiribati", "marshall_islands", "micronesia", "nauru", "new_zealand", "palau", "papua_new_guinea", "samoa", "solomon_islands", "tonga", "tuvalu", "vanuatu"]);
//prettier-ignore
const world = new Continent(["argentina", "bahamas", "barbados", "belize", "bolivia", "brazil", "canada", "chile", "colombia", "costa_rica"]);
//prettier-ignore
const bonus = new Continent(["abkhazia", "adygea", "ajaria", "aland", "alderney", "altai_republic", "american_samoa", "anguilla", "antarctica", "aruba", "bashkortostan", "bermuda", "bih_federation", "bikini_atoll", "uk_antarctic_territory", "uk_ind._ocean_territ.", "brittany", "buryatia", "cayman_islands", "chechen_republic", "chechen_rep._of_ichkeria", "christmas_island", "chuvashia", "cook_islands", "crimea", "dagestan", "easter_island", "england", "european_union", "falkland_islands", "faroe_islands", "french_polynesia", "french_s._&_ant._lands", "gibraltar", "greenland", "guam", "guernsey", "herm", "hong_kong", "ingushetia", "isle_of_man", "jersey", "kabardino_balkaria", "kalmikia", "karachay_cherkassia", "karakalpakstan", "karelia", "khakassia", "komi", "kosovo_&_metohija", "kuban_peoples_rep", "ladonia", "los_altos", "macau", "mari_el", "montserrat", "mordovia", "nagorno_karabah", "netherlands_antilles", "niue", "norfolk_islands", "north_ossetia", "north._mariana_islands", "palestine", "pitcairn_islands", "puerto_rico", "republika_srpska", "saba", "saint_barthelemy", "saint_helena", "saint_martin", "st_pierre_and_miquelon", "sakha_republic", "sark", "sealand_principality", "sikkim", "somaliland", "s._georgia_&_s._s._islands", "south_ossetia", "sov._mil._ord._of_malta", "taiwan", "tatarstan", "tierra_del_fuego", "tokelau", "transnistria", "tristan_da_cunha", "tur._rep._of_nor._cyprus", "turks_and_caicos_isl.", "tuva", "udmurtia", "virgin_islands_uk", "virgin_islands_us", "wales", "western_sahara"]);
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

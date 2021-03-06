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
      gameInfo.textContent = `??estitke ! Imali ste ${
        this.counterPos
      } ta??nih, i ${this.counterNeg} neta??nih odgovora za ${displayPastTime(
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
    return (gameInfo.textContent = `Neta??an Odgovor ! Ta??an Odgovor je ${removeUnderscore(
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
const europe = new Continent(['albanija', 'andora', 'jermenija', 'austrija', 'azerbejd??an', 'belorusija', 'belgija', 'bosna_i_hercegovina', 'bugarska', 'hrvatska', 'kipar', '??e??ka', 'danska', 'estonija', 'finska', 'francuska', 'gruzija', 'nema??ka', 'gr??ka', 'ma??arska', 'island', 'irska', 'italija', 'letonija', 'lihten??tajn', 'litvanija', 'luksemburg', 'malta', 'moldavija', 'monako', 'crna_gora', 'holandija', 'severna_makedonija', 'norve??ka', 'poljska', 'portugal', 'rumunija', 'rusija', 'san_marino', 'srbija', 'slova??ka', 'slovenija', '??panija', '??vedska', '??vajcarska', 'turska', 'ukrajina', 'ujedinjeno_kraljevstvo', 'vatikan']);
//prettier-ignore
const asia = new Continent(['avganistan', 'jermenija', 'azerbejd??an', 'bahrein', 'banglade??', 'butan', 'bruneji', 'kambod??a', 'kina', 'indija', 'indonezija', 'iran', 'irak', 'izrael', 'japan', 'jordan', 'kazahstan', 'kuvajt', 'kirgistan', 'laos', 'liban', 'malezija', 'maldivi', 'mongolija', 'mijanmar', 'nepal', 'severna_koreja', 'oman', 'pakistan', 'filipini', 'katar', 'rusija', 'saudijska_arabija', 'singapur', 'ju??na_koreja', '??ri_lanka', 'sirija', 'tajvan', 'tad??ikistan', 'tajland', 'isto??ni_timor', 'turska', 'turkmenistan', 'ujedinjeni_ar._emirati', 'uzbekistan', 'vijetnam', 'jemen']);
//prettier-ignore
const africa = new Continent(['al??ir', 'angola', 'benin', 'bocvana', 'burkina_faso', 'burundi', 'zelenortska_ostrva', 'kamerun', 'centralnoafri??ka_rep.', '??ad', 'komoros', 'd._r._kongo', 'd??ibuti', 'egipat', 'ekvatorij._gvineja', 'eritreja', 'etiopija', 'gabon', 'gambija', 'gana', 'gvineja', 'gvineja_bisao', 'obala_slonova??e', 'kenija', 'lesoto', 'liberija', 'libija', 'madagaskar', 'malavi', 'mali', 'mauritanija', 'mauricijus', 'maroko', 'mozambik', 'namibija', 'niger', 'nigerija', 'republika_kongo', 'ruanda', 'sao_tome_i_prinsipe', 'senegal', 'sej??eli', 'sijera_leone', 'somalija', 'ju??na_afrika', 'ju??ni_sudan', 'sudan', 'svazilend', 'tanzanija', 'togo', 'tunis', 'uganda', 'zambija', 'zimbabve']);
//prettier-ignore
const america = new Continent(['antigva_i_barbuda', 'argentina', 'bahami', 'barbados', 'belize', 'bolivija', 'brazil', 'kanada', '??ile', 'kolumbija', 'kostarika', 'kuba', 'dominika', 'dominikanska_republika', 'ekvador', 'el_salvador', 'grenada', 'gvatemala', 'gvajana', 'haiti', 'honduras', 'jamajka', 'meksiko', 'nikaragva', 'panama', 'paragvaj', 'peru', 'sent_kits_i_nevis', 'sent_lucija' , 'sent_vinsent_i_gren.' , 'surinam', 'trinidad_i_tobago', 'urugvaj', 'sjedinjene_ameri??ke_dr??ave', 'venecuela']);
//prettier-ignore
const australia = new Continent(['australija', 'fid??i', 'kiribati','mar??alska_ostrva', 'mikronezija', 'nauru', 'novi_zeland', 'palau', 'papua_nova_gvineja', 'samoa', 'solomonska_ostrva', 'tonga', 'tuvalu', 'vanuatu']);
//prettier-ignore
const world = new Continent(['albanija', 'andora', 'jermenija', 'austrija', 'azerbejd??an', 'belorusija', 'belgija', 'bosna_i_hercegovina', 'bugarska', 'hrvatska', 'kipar', '??e??ka', 'danska', 'estonija', 'finska', 'francuska', 'gruzija', 'nema??ka', 'gr??ka', 'ma??arska', 'island', 'irska', 'italija', 'letonija', 'lihten??tajn', 'litvanija', 'luksemburg', 'malta', 'moldavija', 'monako', 'crna_gora', 'holandija', 'severna_makedonija', 'norve??ka', 'poljska', 'portugal', 'rumunija', 'rusija', 'san_marino', 'srbija', 'slova??ka', 'slovenija', '??panija', '??vedska', '??vajcarska', 'turska', 'ukrajina', 'ujedinjeno_kraljevstvo', 'vatikan', 'avganistan', 'jermenija', 'azerbejd??an', 'bahrein', 'banglade??', 'butan', 'bruneji', 'kambod??a', 'kina', 'indija', 'indonezija', 'iran', 'irak', 'izrael', 'japan', 'jordan', 'kazahstan', 'kuvajt', 'kirgistan', 'laos', 'liban', 'malezija', 'maldivi', 'mongolija', 'mijanmar', 'nepal', 'severna_koreja', 'oman', 'pakistan', 'filipini', 'katar', 'rusija', 'saudijska_arabija', 'singapur', 'ju??na_koreja', '??ri_lanka', 'sirija', 'tajvan', 'tad??ikistan', 'tajland', 'isto??ni_timor', 'turska', 'turkmenistan', 'ujedinjeni_ar._emirati', 'uzbekistan', 'vijetnam', 'jemen', 'al??ir', 'angola', 'benin', 'bocvana', 'burkina_faso', 'burundi', 'zelenortska_ostrva', 'kamerun', 'centralnoafri??ka_rep.', '??ad', 'komoros', 'd._r._kongo', 'd??ibuti', 'egipat', 'ekvatorij._gvineja', 'eritreja', 'etiopija', 'gabon', 'gambija', 'gana', 'gvineja', 'gvineja_bisao', 'obala_slonova??e', 'kenija', 'lesoto', 'liberija', 'libija', 'madagaskar', 'malavi', 'mali', 'mauritanija', 'mauricijus', 'maroko', 'mozambik', 'namibija', 'niger', 'nigerija', 'republika_kongo', 'ruanda', 'sao_tome_i_prinsipe', 'senegal', 'sej??eli', 'sijera_leone', 'somalija', 'ju??na_afrika', 'ju??ni_sudan', 'sudan', 'svazilend', 'tanzanija', 'togo', 'tunis', 'uganda', 'zambija', 'zimbabve', 'antigva_i_barbuda', 'argentina', 'bahami', 'barbados', 'belize', 'bolivija', 'brazil', 'kanada', '??ile', 'kolumbija', 'kostarika', 'kuba', 'dominika', 'dominikanska_republika', 'ekvador', 'el_salvador', 'grenada', 'gvatemala', 'gvajana', 'haiti', 'honduras', 'jamajka', 'meksiko', 'nikaragva', 'panama', 'paragvaj', 'peru', 'sent_kits_i_nevis', 'sent_lucija' , 'sent_vinsent_i_gren.' , 'surinam', 'trinidad_i_tobago', 'urugvaj', 'sjedinjene_ameri??ke_dr??ave', 'venecuela', 'australija', 'fid??i', 'kiribati','mar??alska_ostrva', 'mikronezija', 'nauru', 'novi_zeland', 'palau', 'papua_nova_gvineja', 'samoa', 'solomonska_ostrva', 'tonga', 'tuvalu', 'vanuatu']);
//prettier-ignore
const bonus = new Continent(['abhazija', 'adigeja', 'ad??arija', 'aland', 'alderni', 'republika_altaj', 'ameri??ka_samoa', 'angvila', 'antarktik', 'aruba', 'ba??kortostan', 'bermuda', 'bih_federacija', 'bikini_atol', 'brit._antark._ter._', 'brit._indook._ter._', 'bretanja', 'burjatija', 'kajmanska_ostrva', '??e??enska_republika', '??e??en._rep._i??kerija', 'bo??i??na_ostrva', '??uva??ija', 'kukova_ostrva', 'krim', 'dagestan', 'uskr??nja_ostrva', 'engleska', 'evropska_unija', 'foklandska_ostrva', 'farska_ostrva', 'francuska_polinezija', 'fr._ju??ne_i_antark._zemlje', 'gibraltar', 'grenland', 'guam', 'gernzi', 'herm', 'hong_kong', 'ingu??etija', 'ostrvo_man', 'd??erzi', 'kabardino_balkarija', 'kalmikija', 'kara??aj_??erkasija', 'karakalpakstan', 'karelija', 'khakasija', 'komi', 'kosovo_&_metohija', 'kuban_narodna_rep.', 'ladonija', 'los_altos', 'makao', 'mari_el', 'monserat', 'mordovija', 'nagorno_karabah', 'holandski_antili', 'nijue', 'norfolk_ostrvo', 'severna_osetija', 'sev._marijanska_ostrva', 'palestina', 'ostrvo_pitkern', 'portoriko', 'republika_srpska', 'saba', 'sveti_vartolomej', 'sveta_helena', 'sveti_martin', 'sent_pjer_i_mikelon', 'sakha_republika', 'sark', 'suvereni_silend', 'sikim', 'somaliland', 'j._d??ord??._i_sendv._ost.', 'ju??na_osetija', 'suv._malte??ki_voj._red', 'tajvan', 'tatarstan', 'ognjena_zemlja', 'tokelau', 'transnistrija', 'tristan_de_kunja', 'tur._rep._sev._kipar', 'turks_i_kaikos_ostrva', 'tuva', 'udmurtija', 'britanska_devi??._ost.', 'ameri??ka_devi??._ost.', 'vels', 'zapadna_sahara']);
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
  if (languageChoice.value === '????????????') {
    window.location.assign('../serbian_cyrillic/index.html');
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

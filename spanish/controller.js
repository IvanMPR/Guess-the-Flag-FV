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
      gameInfo.textContent = `?? Enhorabuena ! Tuviste ${
        this.counterPos
      } respuestas correctas, y ${
        this.counterNeg
      } respuestas incorrectas, en ${displayPastTime(time.textContent)} !`;
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
    return (gameInfo.textContent = `Respuesta Incorrecta! La Respuesta Correcta es ${removeUnderscore(
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
const europe = new Continent(["albania", "andorra", "armenia", "austria", "azerbaiy??n", "bielorrusia", "b??lgica", "bosnia_y_herzegovina", "bulgaria", "croacia", "chipre", "rep??blica_checa", "dinamarca", "estonia", "finlandia", "francia", "georgia", "alemania", "grecia", "hungr??a", "islandia", "irlanda", "italia", "letonia", "liechtenstein", "lituania", "luxemburgo", "malta", "moldavia", "m??naco", "montenegro", "pa??ses_bajos", "macedonia_del_norte", "noruega", "polonia", "portugal", "roman??a", "rusia", "san_marino", "serbia", "eslovaquia", "eslovenia", "espa??a", "suecia", "suiza", "turk??a", "ukrania", "reino_unido", "ciudad_del_vaticano"]);
//prettier-ignore
const asia = new Continent(["afganist??n", "armenia", "azerbaiy??n", "bar??in", "banglad??s", "but??n", "brun??i", "camboya", "china", "india", "indonesia", "ir??n", "iraq", "israel", "jap??n", "jordania", "kazajist??n", "kuwait", "kirguist??n", "laos", "l??bano", "malasia", "maldivas", "mongolia", "birmania", "nepal", "corea_del_norte", "om??n", "pakist??n", "filipinas", "catar", "rusia", "arabia_saud??", "singapur", "corea_del_sur", "sri_lanka", "siria", "taiw??n", "tayikist??n", "tailandia", "timor_oriental", "turk??a", "turkmenist??n", "emiratos_??rabes_unidos", "uzbekist??n", "vietnam", "yemen"]);
//prettier-ignore
const africa = new Continent(["argelia", "angola", "ben??n", "botsuana", "burkina_faso", "burundi", "cabo_verde", "camer??n", "rep??blica_centroafricana", "chad", "comoras", "rep??blica_democr??tica_del_congo", "yibuti", "egipto", "guinea_equatorial", "eritrea", "etiop??a", "gab??n", "gambia", "ghana", "guinea", "guinea_bis??u", "costa_de_marfil", "kenia", "lesoto", "liberia", "libia", "madagascar", "malaui", "mal??", "mauritania", "mauricio", "marruecos", "mozambique", "namibia", "n??ger", "nigeria", "la_rep??blica_del_congo", "ruanda", "santo_tom??_y_pr??ncipe", "senegal", "seychelles", "sierra_leona", "somalia", "sud??frica", "sud??n_del_sur", "sud??n", "suazilandia", "tanzania", "togo", "t??nez", "uganda", "zambia", "zimbabue"]);
//prettier-ignore
const america = new Continent(["antigua_y_barbuda", "argentina", "bahamas", "barbados", "belice", "bolivia", "brazil", "canad??", "chile", "colombia", "costa_rica", "cuba", "dominica", "rep??blica_dominicana", "ecuador", "el_salvador", "granada", "guatemala", "guyana", "hait??", "honduras", "jamaica", "m??xico", "nicaragua", "panam??", "paraguay", "per??", "san_crist??bal_y_nieves", "santa_luc??a", "san_vicente_y_las_granadinas", "surinam", "trinidad_y_tobago", "uruguay", "estados_unidos", "venezuela"]);
//prettier-ignore
const australia = new Continent(["australia", "fiyi", "kiribati", "islas_marshall", "micronesia", "nauru", "nueva_zelanda", "palaos", "papua_nueva_guinea", "samoa", "islas_salom??n", "tonga", "tuvalu", "vanuatu"]);
//prettier-ignore
const world = new Continent(["albania", "andorra", "armenia", "austria", "azerbaiy??n", "bielorrusia", "b??lgica", "bosnia_y_herzegovina", "bulgaria", "croacia", "chipre", "rep??blica_checa", "dinamarca", "estonia", "finlandia", "francia", "georgia", "alemania", "grecia", "hungr??a", "islandia", "irlanda", "italia", "letonia", "liechtenstein", "lituania", "luxemburgo", "malta", "moldavia", "m??naco", "montenegro", "pa??ses_bajos", "macedonia_del_norte", "noruega", "polonia", "portugal", "roman??a", "rusia", "san_marino", "serbia", "eslovaquia", "eslovenia", "espa??a", "suecia", "suiza", "turk??a", "ukrania", "reino_unido", "ciudad_del_vaticano", "afganist??n", "armenia", "azerbaiy??n", "bar??in", "banglad??s", "but??n", "brun??i", "camboya", "china", "india", "indonesia", "ir??n", "iraq", "israel", "jap??n", "jordania", "kazajist??n", "kuwait", "kirguist??n", "laos", "l??bano", "malasia", "maldivas", "mongolia", "birmania", "nepal", "corea_del_norte", "om??n", "pakist??n", "filipinas", "catar", "rusia", "arabia_saud??", "singapur", "corea_del_sur", "sri_lanka", "siria", "taiw??n", "tayikist??n", "tailandia", "timor_oriental", "turk??a", "turkmenist??n", "emiratos_??rabes_unidos", "uzbekist??n", "vietnam", "yemen", "argelia", "angola", "ben??n", "botsuana", "burkina_faso", "burundi", "cabo_verde", "camer??n", "rep??blica_centroafricana", "chad", "comoras", "rep??blica_democr??tica_del_congo", "yibuti", "egipto", "guinea_equatorial", "eritrea", "etiop??a", "gab??n", "gambia", "ghana", "guinea", "guinea_bis??u", "costa_de_marfil", "kenia", "lesoto", "liberia", "libia", "madagascar", "malaui", "mal??", "mauritania", "mauricio", "marruecos", "mozambique", "namibia", "n??ger", "nigeria", "la_rep??blica_del_congo", "ruanda", "santo_tom??_y_pr??ncipe", "senegal", "seychelles", "sierra_leona", "somalia", "sud??frica", "sud??n_del_sur", "sud??n", "suazilandia", "tanzania", "togo", "t??nez", "uganda", "zambia", "zimbabue", "antigua_y_barbuda", "argentina", "bahamas", "barbados", "belice", "bolivia", "brazil", "canad??", "chile", "colombia", "costa_rica", "cuba", "dominica", "rep??blica_dominicana", "ecuador", "el_salvador", "granada", "guatemala", "guyana", "hait??", "honduras", "jamaica", "m??xico", "nicaragua", "panam??", "paraguay", "per??", "san_crist??bal_y_nieves", "santa_luc??a", "san_vicente_y_las_granadinas", "surinam", "trinidad_y_tobago", "uruguay", "estados_unidos", "venezuela", "australia", "fiyi", "kiribati", "islas_marshall", "micronesia", "nauru", "nueva_zelanda", "palaos", "papua_nueva_guinea", "samoa", "islas_salom??n", "tonga", "tuvalu", "vanuatu"]);
//prettier-ignore
const bonus = new Continent(["abjasia", "adigueya", "ayaria", "aland", "alderney", "rep??blica_de_alt??i", "samoa_americana", "anguilla", "ant??rtida", "aruba", "baskortost??n", "bermudas", "la_federaci??n_de_bosnia_y_herzegovina", "atol??n_bikini", "territorio_ant??rtico_brit??nico", "territorio_brit??nico_del_oc??ano_??ndico", "breta??a", "buriatia", "islas_caim??n", "chechenia", "rep??blica_chechena_de_ichkeria", "isla_de_navidad", "chuvasia", "islas_cook", "crimea", "daguest??n", "isla_de_pasqua", "inglaterra", "uni??n_europea", "islas_malvinas", "islas_feroe", "polinesia_francesa", "tierras_australes_y_ant??rticas_francesas", "gibraltar", "groenlandia", "guam", "guernsey", "herm", "hong_kong", "ingusetia", "isla_de_man", "jersey", "kabardia_balkaria", "kalmukia", "karach??yevo_cherkesia", "karakalpakia", "carelia", "jakasia", "komi", "rep??blica_popular_de_kub??n", "ladonia", "los_altos", "macao", "mari_el", "montserrat", "mordovia", "nagorno_karabaj", "antillas_neerlandesas", "niue", "isla_norfolk", "osetia_del_norte", "islas_marianas_del_norte", "palestina", "islas_pitcairn", "rep??blica_srpska", "saba", "san_bartolom??", "santa_elena", "san_mart??n", "san_pedro_y_miquel??n", "rep??blica_de_saj??", "sark", "principado_de_sealand", "sikkim", "somalilandia", "islas_georgias_&_sandwich_del_sur", "osetia_del_sur", "orden_de_malta", "taiw??n", "tatarst??n", "tierra_del_fuego", "tokelau", "transnistria", "trist??n_da_acu??a", "rep._turca_del_norte_de_chipre", "islas_turcas_y_caicos", "tuva", "udmurtia", "islas_v??rgenes_br??tanicas", "islas_v??rgenes_de_ee.uu", "gales", "sahara_occidental"]);
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
  if (languageChoice.value === '????????????') {
    window.location.assign('../serbian_cyrillic/index.html');
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

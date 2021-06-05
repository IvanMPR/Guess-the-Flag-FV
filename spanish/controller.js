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
      gameInfo.textContent = `¡ Enhorabuena ! Tuviste ${
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
const europe = new Continent(["albania", "andorra", "armenia", "austria", "azerbaiyán", "bielorrusia", "bélgica", "bosnia_y_herzegovina", "bulgaria", "croacia", "chipre", "república_checa", "dinamarca", "estonia", "finlandia", "francia", "georgia", "alemania", "grecia", "hungría", "islandia", "irlanda", "italia", "letonia", "liechtenstein", "lituania", "luxemburgo", "malta", "moldavia", "mónaco", "montenegro", "países_bajos", "macedonia_del_norte", "noruega", "polonia", "portugal", "romanía", "rusia", "san_marino", "serbia", "eslovaquia", "eslovenia", "españa", "suecia", "suiza", "turkía", "ukrania", "reino_unido", "ciudad_del_vaticano"]);
//prettier-ignore
const asia = new Continent(["afganistán", "armenia", "azerbaiyán", "baréin", "bangladés", "bután", "brunéi", "camboya", "china", "india", "indonesia", "irán", "iraq", "israel", "japón", "jordania", "kazajistán", "kuwait", "kirguistán", "laos", "líbano", "malasia", "maldivas", "mongolia", "birmania", "nepal", "corea_del_norte", "omán", "pakistán", "filipinas", "catar", "rusia", "arabia_saudí", "singapur", "corea_del_sur", "sri_lanka", "siria", "taiwán", "tayikistán", "tailandia", "timor_oriental", "turkía", "turkmenistán", "emiratos_árabes_unidos", "uzbekistán", "vietnam", "yemen"]);
//prettier-ignore
const africa = new Continent(["argelia", "angola", "benín", "botsuana", "burkina_faso", "burundi", "cabo_verde", "camerún", "república_centroafricana", "chad", "comoras", "república_democrática_del_congo", "yibuti", "egipto", "guinea_equatorial", "eritrea", "etiopía", "gabón", "gambia", "ghana", "guinea", "guinea_bisáu", "costa_de_marfil", "kenia", "lesoto", "liberia", "libia", "madagascar", "malaui", "malí", "mauritania", "mauricio", "marruecos", "mozambique", "namibia", "níger", "nigeria", "la_república_del_congo", "ruanda", "santo_tomé_y_príncipe", "senegal", "seychelles", "sierra_leona", "somalia", "sudáfrica", "sudán_del_sur", "sudán", "suazilandia", "tanzania", "togo", "túnez", "uganda", "zambia", "zimbabue"]);
//prettier-ignore
const america = new Continent(["antigua_y_barbuda", "argentina", "bahamas", "barbados", "belice", "bolivia", "brazil", "canadá", "chile", "colombia", "costa_rica", "cuba", "dominica", "república_dominicana", "ecuador", "el_salvador", "granada", "guatemala", "guyana", "haití", "honduras", "jamaica", "méxico", "nicaragua", "panamá", "paraguay", "perú", "san_cristóbal_y_nieves", "santa_lucía", "san_vicente_y_las_granadinas", "surinam", "trinidad_y_tobago", "uruguay", "ee.uu", "venezuela"]);
//prettier-ignore
const australia = new Continent(["australia", "fiyi", "kiribati", "islas_marshall", "micronesia", "nauru", "nueva_zelanda", "palaos", "papua_nueva_guinea", "samoa", "islas_salomón", "tonga", "tuvalu", "vanuatu"]);
//prettier-ignore
const world = new Continent(["albania", "andorra", "armenia", "austria", "azerbaiyán", "bielorrusia", "bélgica", "bosnia_y_herzegovina", "bulgaria", "croacia", "chipre", "república_checa", "dinamarca", "estonia", "finlandia", "francia", "georgia", "alemania", "grecia", "hungría", "islandia", "irlanda", "italia", "letonia", "liechtenstein", "lituania", "luxemburgo", "malta", "moldavia", "mónaco", "montenegro", "países_bajos", "macedonia_del_norte", "noruega", "polonia", "portugal", "romanía", "rusia", "san_marino", "serbia", "eslovaquia", "eslovenia", "españa", "suecia", "suiza", "turkía", "ukrania", "reino_unido", "ciudad_del_vaticano", "afganistán", "armenia", "azerbaiyán", "baréin", "bangladés", "bután", "brunéi", "camboya", "china", "india", "indonesia", "irán", "iraq", "israel", "japón", "jordania", "kazajistán", "kuwait", "kirguistán", "laos", "líbano", "malasia", "maldivas", "mongolia", "birmania", "nepal", "corea_del_norte", "omán", "pakistán", "filipinas", "catar", "rusia", "arabia_saudí", "singapur", "corea_del_sur", "sri_lanka", "siria", "taiwán", "tayikistán", "tailandia", "timor_oriental", "turkía", "turkmenistán", "emiratos_árabes_unidos", "uzbekistán", "vietnam", "yemen", "argelia", "angola", "benín", "botsuana", "burkina_faso", "burundi", "cabo_verde", "camerún", "república_centroafricana", "chad", "comoras", "república_democrática_del_congo", "yibuti", "egipto", "guinea_equatorial", "eritrea", "etiopía", "gabón", "gambia", "ghana", "guinea", "guinea_bisáu", "costa_de_marfil", "kenia", "lesoto", "liberia", "libia", "madagascar", "malaui", "malí", "mauritania", "mauricio", "marruecos", "mozambique", "namibia", "níger", "nigeria", "la_república_del_congo", "ruanda", "santo_tomé_y_príncipe", "senegal", "seychelles", "sierra_leona", "somalia", "sudáfrica", "sudán_del_sur", "sudán", "suazilandia", "tanzania", "togo", "túnez", "uganda", "zambia", "zimbabue", "antigua_y_barbuda", "argentina", "bahamas", "barbados", "belice", "bolivia", "brazil", "canadá", "chile", "colombia", "costa_rica", "cuba", "dominica", "república_dominicana", "ecuador", "el_salvador", "granada", "guatemala", "guyana", "haití", "honduras", "jamaica", "méxico", "nicaragua", "panamá", "paraguay", "perú", "san_cristóbal_y_nieves", "santa_lucía", "san_vicente_y_las_granadinas", "surinam", "trinidad_y_tobago", "uruguay", "ee.uu", "venezuela", "australia", "fiyi", "kiribati", "islas_marshall", "micronesia", "nauru", "nueva_zelanda", "palaos", "papua_nueva_guinea", "samoa", "islas_salomón", "tonga", "tuvalu", "vanuatu"]);
//prettier-ignore
const bonus = new Continent(["abjasia", "adigueya", "ayaria", "aland", "alderney", "república_de_altái", "samoa_americana", "anguilla", "antártida", "aruba", "baskortostán", "bermudas", "la_federación_de_bosnia_y_herzegovina", "atolón_bikini", "territorio_antártico_británico", "territorio_británico_del_océano_índico", "bretaña", "buriatia", "islas_caimán", "chechenia", "república_chechena_de_ichkeria", "isla_de_navidad", "chuvasia", "islas_cook", "crimea", "daguestán", "isla_de_pasqua", "inglaterra", "unión_europea", "islas_malvinas", "islas_feroe", "polinesia_francesa", "tierras_australes_y_antárticas_francesas", "gibraltar", "groenlandia", "guam", "guernsey", "herm", "hong_kong", "ingusetia", "isla_de_man", "jersey", "kabardia_balkaria", "kalmukia", "karacháyevo_cherkesia", "karakalpakia", "carelia", "jakasia", "komi", "república_popular_de_kubán", "ladonia", "los_altos", "macao", "mari_el", "montserrat", "mordovia", "nagorno_karabaj", "antillas_neerlandesas", "niue", "isla_norfolk", "osetia_del_norte", "islas_marianas_del_norte", "palestina", "islas_pitcairn", "república_srpska", "saba", "san_bartolomé", "santa_elena", "san_martín", "san_pedro_y_miquelón", "república_de_sajá", "sark", "principado_de_sealand", "sikkim", "somalilandia", "islas_georgias_&_sandwich_del_sur", "osetia_del_sur", "orden_de_malta", "taiwán", "tatarstán", "tierra_del_fuego", "tokelau", "transnistria", "tristán_da_acuña", "rep._turca_del_norte_de_chipre", "islas_turcas_y_caicos", "tuvalu", "udmurtia", "islas_vírgenes_brítanicas", "islas_vírgenes_de_ee.uu", "gales", "sahara_occidental"]);
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
  if (languageChoice.value === 'српски') {
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

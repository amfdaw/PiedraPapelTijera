// Este array no se puede modificar,
var posibilidades = ["piedra", "papel", "tijera"];
//    //

// Winner
const TIE = "tie";
const PLAYER = "player";
const NPC = "npc";

// IDs
const JUGADOR_DIV_ID = "jugador";
const BOTON_JUGAR_ID = "boton-jugar";
const BOTON_YA_ID = "boton-ya";
const BOTON_RESET_ID = "boton-reset";
const INPUT_NOMBRE_ID = "input-nombre";
const INPUT_NUMERO_ID = "input-numero";
const SPAN_ACTUAL_ID = "actual";
const SPAN_TOTAL_ID = "total";
const UL_HISTORIAL_ID = "historial";

// Elements
const nameInput = document.getElementById(INPUT_NOMBRE_ID);
const numberInput = document.getElementById(INPUT_NUMERO_ID);

const actualSpan = document.getElementById(SPAN_ACTUAL_ID);
const totalSpan = document.getElementById(SPAN_TOTAL_ID);

const jugadorDIV = document.getElementById(JUGADOR_DIV_ID);

const npcImage = document.querySelector("#maquina > img");

const botonPlay = document.getElementById(BOTON_JUGAR_ID);
const botonYa = document.getElementById(BOTON_YA_ID);
const botonReset = document.getElementById(BOTON_RESET_ID);

// Global variables
let _playerChoice = "";
let _canPlay = false;
let _playerName = "";

// Functions
function setupPlayerImages() {
  const playerChoiceImages = jugadorDIV.children;

  let i = 0;

  for (const playerChoiceImage of playerChoiceImages) {
    // generate player images
    if (i < posibilidades.length) {
      playerChoiceImage.setAttribute(
        "src",
        `img/${posibilidades[i++]}Jugador.png`
      );
    }

    // assign onclick events
    playerChoiceImage.addEventListener("click", () =>
      selectImage(playerChoiceImage)
    );

    // assign id
    playerChoiceImage.setAttribute("id", `choice-${i - 1}`);
  }
}

function checkPlayerInputData() {
  function isNameInputCorrect() {
    const { value: name } = nameInput;

    return name.length > 3 && !(name[0] >= "0" && name[0] <= "9");
  }

  function isNumberInputCorrect() {
    const { value } = numberInput;
    const number = parseInt(value);

    return number > 0;
  }

  const nameInputCorrect = isNameInputCorrect();
  const numberInputCorrect = isNumberInputCorrect();

  // if correct...
  if (nameInputCorrect && numberInputCorrect) {
    nameInput.setAttribute("disabled", true);
    numberInput.setAttribute("disabled", true);

    nameInput.classList.remove("fondoRojo");
    numberInput.classList.remove("fondoRojo");

    _canPlay = true;
    _playerName = nameInput.value;

    return;
  }

  // if incorrect...
  _canPlay = false;

  if (!nameInputCorrect) {
    nameInput.classList.add("fondoRojo");
  }

  if (!numberInputCorrect) {
    numberInput.classList.add("fondoRojo");
  }
}

function selectImage(imageElement) {
  const SELECCIONADO = "seleccionado";
  const NO_SELECCIONADO = "noSeleccionado";

  const playerChoiceImages = jugadorDIV.children;

  // clear selection
  for (const playerChoiceImage of playerChoiceImages) {
    playerChoiceImage.classList.remove(SELECCIONADO);
    playerChoiceImage.classList.add(NO_SELECCIONADO);
  }

  // select desired one
  imageElement.classList.remove(NO_SELECCIONADO);
  imageElement.classList.add(SELECCIONADO);

  _playerChoice = parseInt(imageElement.getAttribute("id").split("-")[1]);
}

function rollNPC() {
  const npcRoll = Math.floor(Math.random() * 3);

  // set image
  npcImage.setAttribute("src", `img/${posibilidades[npcRoll]}Ordenador.png`);

  return npcRoll;
}

function checkWinner(playerRoll, npcRoll) {
  if (playerRoll === npcRoll) {
    return TIE;
  }

  if (playerRoll === (npcRoll + 1) % 3) {
    return PLAYER;
  }

  return NPC;
}

function writeHistory(winner) {
  const history = document.getElementById(UL_HISTORIAL_ID);

  function write(message) {
    const li = document.createElement("li");
    li.textContent = message;

    history.prepend(li);
  }

  if (winner === TIE) {
    write("¡Empate!");
    return;
  }

  write(winner === PLAYER ? `¡Gana ${_playerName}!` : "¡Gana el ordenador!");
}

function handleRounds() {
  let { textContent: actual } = actualSpan;
  let { textContent: total } = totalSpan;

  actual = parseInt(actual);
  total = parseInt(total);

  if (++actual === total) {
    _canPlay = false;
  }

  actualSpan.textContent = actual;
}

function setRounds() {
  actualSpan.textContent = "0";
  totalSpan.textContent = document.getElementById(INPUT_NUMERO_ID).value;
}

// Handlers
botonPlay.addEventListener("click", () => {
  if (_canPlay) return;

  checkPlayerInputData();

  if (!_canPlay) return;

  setupPlayerImages();
  setRounds();
});

botonYa.addEventListener("click", () => {
  if (!_canPlay) return;

  const playerRoll = _playerChoice;
  const npcRoll = rollNPC();
  const winner = checkWinner(playerRoll, npcRoll);

  writeHistory(winner);
  handleRounds();
});

botonReset.addEventListener("click", () => {
  alert("Nueva Partida!");

  // Enable text fields
  nameInput.removeAttribute("disabled");
  numberInput.removeAttribute("disabled");

  // Reset current && total span to 0
  actualSpan.textContent = "0";
  totalSpan.textContent = "0";

  // Put default image in machine
  npcImage.setAttribute("src", "img/defecto.png");

  _canPlay = false;
});

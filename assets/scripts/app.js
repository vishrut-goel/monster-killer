const PLAYER_ATTACK_VALUE = 10;
const PLAYER_STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 10;
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

const enteredValue = prompt("Chose your max life", "100");
let chosenMaxLife = parseInt(enteredValue);

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  let newValue = prompt("Please enter a valid number", "100");
  chosenMaxLife = parseInt(newValue);
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let monsterDamage;
let hasBonusLife = true;
let pushToLog = [];

adjustHealthBars(chosenMaxLife);

function logEvent(ev, val, monsterHealth, playerHealth) {
  let logEntries = {
    event: ev,
    value: val,
    monsterHealth: monsterHealth,
    playerHealth: playerHealth,
  };

  if (ev === LOG_EVENT_PLAYER_ATTACK) {
    logEntries.target = "MONSTER";
  } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntries.target = "MONSTER";
  } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
    logEntries.target = "PLAYER";
  } else if (ev === LOG_EVENT_PLAYER_HEAL) {
    logEntries.target = "PLAYER";
  }
  pushToLog.push(logEntries);
}

function reset() {
  currentPlayerHealth = chosenMaxLife;
  currentMonsterHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}
function endRound() {
  let initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  logEvent(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("You've consumed your bonus life!");
  }
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!");
    logEvent(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You lost!");
    logEvent(
      LOG_EVENT_GAME_OVER,
      "PLAYER LOST",
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("It's a draw");
    logEvent(
      LOG_EVENT_GAME_OVER,
      "DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  }
}
function attackHandler() {
  monsterDamage = dealMonsterDamage(PLAYER_ATTACK_VALUE);
  handleAttack(LOG_EVENT_PLAYER_ATTACK);
}

function strongAttackHandler() {
  monsterDamage = dealMonsterDamage(PLAYER_STRONG_ATTACK_VALUE);
  handleAttack(LOG_EVENT_PLAYER_STRONG_ATTACK);
}

function handleAttack(mode) {
  currentMonsterHealth -= monsterDamage;
  if (mode === LOG_EVENT_PLAYER_ATTACK) {
    logEvent(
      LOG_EVENT_PLAYER_ATTACK,
      monsterDamage,
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (mode === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEvent(
      LOG_EVENT_PLAYER_STRONG_ATTACK,
      monsterDamage,
      currentMonsterHealth,
      currentPlayerHealth
    );
  }
  endRound();
}

function healHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal over your max health");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  logEvent(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printBattleLog() {
  // for(const el of pushToLog){
  //   console.log(el);
  // }

  let i = 0;
  while(i < pushToLog.length){
    console.log(pushToLog[i]);
    i++;
  }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healHandler);
logBtn.addEventListener("click", printBattleLog);

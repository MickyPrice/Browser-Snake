const gameArea = document.getElementById('game');

var config = {
  gridSize: 2000
}

var gameVariables = {
  currentDirection: "NORTH",
  snakeLength: 0,
  previousMovements: [],
  gameTicker: 0,
  speed: 200,
  paused: true
}

// Function to generate the board
function buildGrid() {
  gameArea.innerHTML = "";

  console.log('---------------[ GENERATING GRID ]---------------');

  for (var i = 0; i < Math.sqrt(config.gridSize); i++) {
    var row = document.createElement('div');
    row.classList.add('row');
    // console.log('ROW ' + i + ":");
    for (var j = 0; j < Math.sqrt(config.gridSize); j++) {
      var cell = document.createElement('div');
      cell.id = `cell-${j}-${i}`;
      cell.setAttribute('row', i);
      cell.setAttribute('cell', j);
      cell.classList.add('cell');
      row.appendChild(cell);

      // console.log(' - Cell ' + j);
    }
    gameArea.appendChild(row);
  }
  console.log('---------------[ GENERATED GRID ]---------------');

}



function getCells() {
  return document.querySelectorAll('.cell');
}
function getFruit() {
  return document.querySelector('.cell[isFruit="true"]');
}
function isFruit(cell) {
  return cell.getAttribute("isFruit") === "true";
}
function isBody(cell) {
  return cell.getAttribute("isBody") === "true";
}
function isHead(cell) {
  return cell.getAttribute("isHead") === "true";
}



function spawnFruit() {
  var cell = getCells()[Math.floor(Math.random()*getCells().length)];
  if (!(isFruit(cell) && isBody(cell) && isHead(cell))) {
    cell.setAttribute("isFruit","true");
  } else {
    console.warn("Failed to spawn fruit. Was either a fruit, head or body already");
  }
}

function spawnFruits(amount) {
  for (var i = 0; i < amount; i++) {
    spawnFruit();
  }
}


function getNextCell(cell, direction) {
  switch (direction.toUpperCase()) {
    case "SOUTH":
      return document.querySelector(`.cell[cell="${cell.getAttribute('cell')}"][row="${parseInt(cell.getAttribute('row')) + 1}"]`);
      break;
    case "EAST":
      return document.querySelector(`.cell[cell="${parseInt(cell.getAttribute('cell')) + 1}"][row="${parseInt(cell.getAttribute('row'))}"]`);
      break;
    case "WEST":
      return document.querySelector(`.cell[cell="${parseInt(cell.getAttribute('cell')) - 1}"][row="${parseInt(cell.getAttribute('row'))}"]`);
      break;
    default: // North or Broken
      return document.querySelector(`.cell[cell="${cell.getAttribute('cell')}"][row="${parseInt(cell.getAttribute('row')) - 1}"]`);
  }
}

function endGame() {
  clearInterval(gameVariables.gameTicker);
  console.warn("GAME OVER");
}

function startMovingSnake() {
  clearInterval(gameVariables.gameTicker);

  if (!gameVariables.paused) {
    gameVariables.gameTicker = setInterval(function () {
      var oldhead = document.querySelector('.cell[isHead="true"]');
      var newhead = getNextCell(oldhead, gameVariables.currentDirection);

      if (newhead != null) {
        newhead.setAttribute('isHead', "true");
        oldhead.removeAttribute('isHead');

        if (isFruit(newhead)) {
          growSnake(1);
          newhead.removeAttribute('isFruit');
          spawnFruit();

          if (gameVariables.speed > 25) {
            gameVariables.speed -= 5;
          }
          startMovingSnake();
        }

        if (gameVariables.snakeLength > 0) {
          oldhead.setAttribute('isBody',"true");
          gameVariables.previousMovements.push(oldhead);
        }

        if (gameVariables.previousMovements.length > gameVariables.snakeLength) {
          gameVariables.previousMovements[0].removeAttribute('isBody');
          gameVariables.previousMovements.shift();
        }

        if (isBody(newhead)) {
          endGame();
        }

      } else {
        endGame();
      }

    }, gameVariables.speed);
  }
}

function pauseGame() {
  gameVariables.paused = !gameVariables.paused;
  startMovingSnake();
  if (gameVariables.paused) {
    document.getElementById('gameTitle').innerText = "Browser Snake (PAUSED)";
  } else {
    document.getElementById('gameTitle').innerText = "Browser Snake";
  }
}

function growSnake(amount) {
  gameVariables.snakeLength += amount;
}


// Spawn the snake head
function spawnSnake() {
  var cell = document.querySelector(`.cell[cell="${Math.round(Math.sqrt(config.gridSize) / 2)}"][row="${Math.round(Math.sqrt(config.gridSize) / 2)}"]`);
  cell.setAttribute("isHead","true");
}

// Key press listeners
document.body.addEventListener("keydown", event => {
  if (event.which === 32) { // Space
    pauseGame();
  }
  if (event.which === 38) { // UP
    if (gameVariables.snakeLength > 0) {
      if (gameVariables.currentDirection !== "SOUTH") {
        gameVariables.currentDirection = "NORTH";
      }
    } else {
      gameVariables.currentDirection = "NORTH";
    }
  }
  if (event.which === 39) { // RIGHT
    if (gameVariables.snakeLength > 0) {
      if (gameVariables.currentDirection !== "WEST") {
        gameVariables.currentDirection = "EAST";
      }
    } else {
      gameVariables.currentDirection = "EAST";
    }
  }
  if (event.which === 40) { // DOWN
    if (gameVariables.snakeLength > 0) {
      if (gameVariables.currentDirection !== "NORTH") {
        gameVariables.currentDirection = "SOUTH";
      }
    } else {
      gameVariables.currentDirection = "SOUTH";
    }
  }
  if (event.which === 37) { // LEFT
    if (gameVariables.snakeLength > 0) {
      if (gameVariables.currentDirection !== "EAST") {
        gameVariables.currentDirection = "WEST";
      }
    } else {
      gameVariables.currentDirection = "WEST";
    }
  }
});




function setupGame() {
  buildGrid();
  spawnFruits(2);
  spawnSnake();
  startMovingSnake();
  pauseGame();
  pauseGame();
}
setupGame();

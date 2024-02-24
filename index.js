window.onload = function () {
  console.log("dom loaded");

  const dom_gameboard = document.querySelector(".gameboard");
  dom_gameboard.style.width = "20rem";
  dom_gameboard.style.height = "20rem";

  const Grid = {
    row: 3,
    col: 3,
  };

  const User = {
    player: "X",
    bot: "O",
  };

  const loadRandomItem = (max) => Math.floor(Math.random() * max);

  function checkWinner() {
    const zone = document.querySelectorAll(".grid-item");
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // col
      [0, 4, 8],
      [2, 4, 6], // diag
    ];

    for (const condition of winningConditions) {
      const [a, b, c] = condition;
      if (
        zone[a].textContent &&
        zone[a].textContent === zone[b].textContent &&
        zone[a].textContent === zone[c].textContent
      ) {
        return zone[a].textContent;
      }
    }
    return null;
  }

  function makeGrid(rows, cols) {
    for (let c = 0; c < rows * cols; c++) {
      dom_gameboard.style.setProperty("--grid-rows", rows);
      dom_gameboard.style.setProperty("--grid-cols", cols);
      const cell = document.createElement("div");
      cell.id = c + 1;
      dom_gameboard.appendChild(cell).className = "grid-item";
    }
  }
  makeGrid(Grid.row, Grid.col);

  function onPlayerPlaceItem(e) {
    const { textContent } = e.target;
    if (textContent != User.bot && textContent != User.player) {
      e.target.textContent = User.player;
      const winner = checkWinner();
      if (winner) {
        setTimeout(() => {
          alert(`The winner is : ${winner}`);
          clearBoard();
        }, 100);
        return;
      }
      setTimeout(onBotPlaceItem, 100);
    }
  }

  function onBotPlaceItem() {
    const zone = document.querySelectorAll(".grid-item");
    const bestMove = getBestMove(zone, User.bot, User.player);
    zone[bestMove].textContent = User.bot;
    const winner = checkWinner();
    if (winner) {
      setTimeout(() => {
        alert(`The winner is : ${winner}`);
        clearBoard();
      }, 100);
      return;
    }
  }

  function getBestMove(zone, botSymbol, playerSymbol) {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < zone.length; i++) {
      if (zone[i].textContent === "") {
        zone[i].textContent = botSymbol;
        let score = minimax(zone, 0, false, botSymbol, playerSymbol);
        zone[i].textContent = "";
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }

  const scores = {
    X: -1,
    O: 1,
    tie: 0,
  };

  function minimax(zone, depth, isMaximizing, botSymbol, playerSymbol) {
    const result = checkWinner();
    if (result !== null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < zone.length; i++) {
        if (zone[i].textContent === "") {
          zone[i].textContent = botSymbol;
          let score = minimax(zone, depth + 1, false, botSymbol, playerSymbol);
          zone[i].textContent = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < zone.length; i++) {
        if (zone[i].textContent === "") {
          zone[i].textContent = playerSymbol;
          let score = minimax(zone, depth + 1, true, botSymbol, playerSymbol);
          zone[i].textContent = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  function clearBoard() {
    const zone = document.querySelectorAll(".grid-item");
    for (const cell of zone) {
      cell.textContent = "";
      cell.style.backgroundColor = ""; // Clear background color
    }
  }

  const zone = document.querySelectorAll(".grid-item");
  for (const elem of [...zone]) {
    elem.addEventListener("click", onPlayerPlaceItem);
  }
};

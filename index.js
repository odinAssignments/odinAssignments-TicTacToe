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

  function makeGrid(rows, cols) {
    for (let c = 0; c < rows * cols; c++) {
      dom_gameboard.style.setProperty("--grid-rows", rows);
      dom_gameboard.style.setProperty("--grid-cols", cols);
      const cell = document.createElement("div");
      // cell.textContent = c + 1;
      cell.id = c + 1;
      dom_gameboard.appendChild(cell).className = "grid-item";
    }
  }
  makeGrid(Grid.row, Grid.col);

  function onPlayerPlaceItem(e) {
    console.log(e.target.id);
    const { textContent } = e.target;
    if (textContent != User.bot || textContent != User.player) {
      e.target.textContent = User.player;

      // TODO : need to check if the player is the winner then return and clear the gameboard.
    }

    setTimeout(onBotPlaceItem, 100);
  }

  function onBotPlaceItem() {
    const zone = document.querySelectorAll(".grid-item");
    const randomZone = loadRandomItem(zone.length);

    const isItemEmpty =
      zone[randomZone].textContent != User.bot &&
      zone[randomZone].textContent != User.player;

    const allOccupied = Array.from(zone).every(
      (item) => item.textContent == User.bot || item.textContent == User.player
    );

    if (allOccupied) {
      // TODO : need to check if their is a winner and clear the gameboard.
      return;
    }

    if (isItemEmpty) {
      zone[randomZone].textContent = User.bot;

      // TODO : need to check if the bot is the winner then return and clear the gameboard.
    } else {
      onBotPlaceItem();
    }
  }

  const zone = document.querySelectorAll(".grid-item");
  for (const elem of [...zone]) {
    elem.addEventListener("click", onPlayerPlaceItem);
  }
};

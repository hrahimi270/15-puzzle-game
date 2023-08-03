/**
 * The Puzzle class is responsible for handling the puzzle logic.
 * Using this class, you can create a new puzzle, add it to the DOM, and add
 * event listeners to the tiles.
 * 
 * @param {number} columns - The number of columns in the puzzle.
 * @param {number} rows - The number of rows in the puzzle.
 * @param {HTMLElement} board - The board element to append the puzzle to.
 */

class Puzzle {
  constructor(columns = 4, rows = 4, board) {
    this.columns = columns;
    this.rows = rows;
    this.board = board;

    this.tileSize = 96;
    this.boardWidth = this.columns * this.tileSize;
    this.boardHeight = this.rows * this.tileSize;

    this.init();
  }

  init() {
    this.generaetTiles();
    this.appendTilesToBoard();
    this.tileClickHandler();
  }

  generaetTiles() {
    this.tiles = Array.from({ length: this.columns * this.rows }, (_, i) =>
      String(i + 1)
    );
    this.tiles[this.columns * this.rows - 1] = ""; // empty tile
  }

  shuffle(tiles) {
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    return tiles;
  }

  appendTilesToBoard() {
    this.board.style.width = `${this.boardWidth}px`;
    this.board.style.height = `${this.boardHeight}px`;
    this.board.style.gridTemplateColumns = `repeat(${
      (this, this.columns)
    }, 1fr)`;

    this.tileElements = this.shuffle(this.tiles).map((tile) => {
      const tileElement = document.createElement("div");

      tileElement.classList.add("tile");
      tileElement.setAttribute("data-num", Number(tile));
      tileElement.textContent = tile;
      tileElement.style.width = `${this.tileSize}px`;
      tileElement.style.height = `${this.tileSize}px`;

      if (tile === "") {
        tileElement.classList.add("empty");
      }

      this.board.appendChild(tileElement);
      return tileElement;
    });
  }

  tileClickHandler() {
    this.tileElements.forEach((tileEl) => {
      tileEl.addEventListener("click", (event) => {
        const tile = event.target;
        const emptyTile = this.board.querySelector(".tile.empty");

        if (tile.classList.contains("empty")) return;

        const tileNumber = tile.textContent;
        const emptyNumber = emptyTile.textContent;
        const tileIndex = this.tileElements.indexOf(tile);
        const emptyIndex = this.tileElements.indexOf(emptyTile);

        // check if the tile is adjacent to the empty tile
        const isAdjacent =
          (emptyIndex === tileIndex + 1 && emptyIndex % this.columns !== 0) ||
          (emptyIndex === tileIndex - 1 &&
            emptyIndex % this.columns !== this.columns - 1) ||
          emptyIndex === tileIndex + this.columns ||
          emptyIndex === tileIndex - this.columns;

        if (isAdjacent) {
          // swap tiles
          tile.textContent = emptyNumber;
          emptyTile.textContent = tileNumber;
          emptyTile.classList.remove("empty");
          tile.classList.add("empty");

          // check if the tile is in the correct position
          if (
            this.tileElements.indexOf(emptyTile) + 1 ===
            Number(emptyTile.textContent)
          ) {
            emptyTile.classList.add("valid");
          } else {
            emptyTile.classList.remove("valid");
            tile.classList.remove("valid");
          }

          // check if all tiles are in the correct position
          if (this.win()) {
            this.openWinModal();
          }
        }
      });
    });
  }

  win() {
    const tiles = this.tileElements.map((tile) => {
      if (tile.classList.contains("empty")) {
        return -1;
      }

      return Number(tile.textContent);
    });

    const sortedTiles = [...tiles.filter((tile) => tile > 0)].sort(
      (a, b) => a - b
    );

    return tiles
      .slice(0, -1)
      .every((tile, index) => tile === sortedTiles[index]);
  }

  openWinModal() {
    const winModal = document.querySelector(".won");
    winModal.classList.add("open");

    winModal.querySelector(".close").addEventListener("click", () => {
      winModal.classList.remove("open");
    });
  }
}

/**
 * The Board class is responsible for handle creating and managing the boards.
 * Using this class, you can create a new board, add it to the DOM, and add a
 * button to the header to switch between boards.
 */

class Board {
  constructor() {
    this.boards = [];

    this.addBoardForm = document.querySelector(".add-board-modal form");
    this.addBoardButton = document.querySelector(".add-board");
    this.closeAddBoardButton = document.querySelector(
      ".add-board-modal .close"
    );

    this.onBoardModalSubmit = this.onBoardModalSubmit.bind(this);
    this.onBoardButtonClick = this.onBoardButtonClick.bind(this);

    this.init();
  }

  init() {
    const board1 = new Puzzle(4, 4, document.querySelector("#board1"));
    this.boards.push(board1);

    this.addListeners();
  }

  addListeners() {
    // clear all listeners, if any exist
    this.addBoardButton.removeEventListener("click", this.onOpenBoardModal);
    this.closeAddBoardButton.removeEventListener(
      "click",
      this.onCloseBoardModal
    );
    this.addBoardForm.removeEventListener("submit", this.onBoardModalSubmit);
    document
      .querySelectorAll("header .boards button:not(.add-board)")
      .forEach((button) => {
        button.removeEventListener("click", this.onBoardButtonClick);
      });

    // add new listeners
    this.addBoardButton.addEventListener("click", this.onOpenBoardModal);
    this.closeAddBoardButton.addEventListener("click", this.onCloseBoardModal);
    this.addBoardForm.addEventListener("submit", this.onBoardModalSubmit);
    document
      .querySelectorAll("header .boards button:not(.add-board)")
      .forEach((button) => {
        button.addEventListener("click", this.onBoardButtonClick);
      });
  }

  onOpenBoardModal() {
    document.querySelector(".add-board-modal").classList.add("open");
  }

  onCloseBoardModal() {
    document.querySelector(".add-board-modal").classList.remove("open");
  }

  onBoardButtonClick(event) {
    const button = event.target;
    const boardId = button.getAttribute("data-target");

    this.hideBoards();
    document.querySelector(`#${boardId}`).classList.remove("hidden");

    document
      .querySelectorAll("header .boards button:not(.add-board)")
      .forEach((button) => {
        button.classList.remove("active");
      });

    button.classList.add("active");

    this.addListeners();
  }

  onBoardModalSubmit(event) {
    event.preventDefault();

    const columns = Number(event.target.columns.value);
    const rows = Number(event.target.rows.value);
    const newBoardName = `Board ${this.boards.length + 1}`;
    const newBoardId = `board${this.boards.length + 1}`;

    // hide other boards
    this.hideBoards();

    // create new board element & append to DOM
    const newBoardElement = this.createBoardElement(newBoardId);

    // create new board instance
    this.boards.push(new Puzzle(columns, rows, newBoardElement));

    // add new board button to header
    this.createBoardButton(newBoardName, newBoardId);

    // close add board modal
    this.onCloseBoardModal();
  }

  hideBoards() {
    document.querySelectorAll(".board").forEach((board) => {
      board.classList.add("hidden");
    });
  }

  createBoardElement(newBoardId) {
    // create new board element & append to DOM
    const newBoardElement = document.createElement("div");
    newBoardElement.classList.add("board");
    newBoardElement.setAttribute("id", newBoardId);
    document.querySelector("main").appendChild(newBoardElement);

    return newBoardElement;
  }

  createBoardButton(newBoardName, newBoardId) {
    const newBoardButton = document.createElement("button");
    newBoardButton.textContent = newBoardName;
    newBoardButton.classList.add("active");
    newBoardButton.setAttribute("data-target", newBoardId);

    // add new board button to the DOM
    const boardButtons = document.querySelector("header .boards");
    boardButtons.querySelector(".active").classList.remove("active");
    boardButtons.appendChild(newBoardButton);
  }
}

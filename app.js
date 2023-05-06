"use strict";
// import modules
import {
  showCreateDialog,
  closeCreateDialog,
  closeUpdateDialog,
  closeDeleteDialog,
} from "/js/toggle-dialog.js";

import {
  updateFlashCardsGrid,
  sortFlashcards,
  filterFlashcards,
  searchFlashcards,
  handleTopicChange,
} from "/js/view.js";

import {
  createFlashcardClicked,
  updateFlashcardClicked,
  deleteFlashcardClicked,
} from "/js/crud-operations.js";

window.addEventListener("load", initApp);

async function initApp() {
  console.log("initApp: app.js is running 🎉");
  updateFlashCardsGrid();
  document
    .getElementById("btn-create")
    .addEventListener("click", showCreateDialog);
  document
    .getElementById("create-flashcard-btn-cancel")
    .addEventListener("click", closeCreateDialog);
  document
    .getElementById("create-form")
    .addEventListener("submit", createFlashcardClicked);
  document
    .getElementById("update-flashcard-btn-cancel")
    .addEventListener("click", closeUpdateDialog);
  document
    .querySelector("#update-form")
    .addEventListener("submit", updateFlashcardClicked);
  document
    .querySelector("#form-delete .btn-cancel")
    .addEventListener("click", closeDeleteDialog);
  document
    .querySelector("#form-delete")
    .addEventListener("submit", deleteFlashcardClicked);
  document
    .querySelector("#sort-data")
    .addEventListener("change", sortFlashcards);
  document
    .querySelector("#language")
    .addEventListener("change", filterFlashcards);
  document
    .querySelector("#btn-search") // Find the right button, currently it has the same id as "CREATE NEW FLASHCARD"
    .addEventListener("click", searchFlashcards);
  document
    .querySelector("#create-topic")
    .addEventListener("change", handleTopicChange);
  document
    .querySelector("#showanswer")
    .addEventListener("click", () =>
      document.querySelector("#card").classList.add("rotate")
    );
  document.querySelector("#hideanswer").addEventListener("click", () => {
    document.querySelector("#card").offsetHeight;
    document.querySelector("#card").classList.remove("rotate");
  });
}

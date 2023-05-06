"use strict";

// IMPORT MODULES
import {
  updateFlashCard,
  deleteFlashcard,
  createFlashcard,
} from "./js/rest-services.js";

import { closeCreateDialog, closeUpdateDialog } from "./js/toggle-dialog.js";

function updateFlashcardClicked(event) {
  console.log("---updateFlashcardClicked()---");
  event.preventDefault();
  const form = event.target; // or "this"
  // extract the values from inputs in the form
  console.log(form.title);
  const newFlashCard = {
    question: document.querySelector("#update-question").value,
    answer: document.querySelector("#update-answer").value,
    language: document.querySelector("#update-language").value,
    topic: document.querySelector("#update-topic").value,
    difficulty: document.querySelector("#update-difficulty").value,
    image: document.querySelector("#update-image").value,
    link: document.querySelector("#update-link").value,
    code_example: document.querySelector("#update-code-snippet").value,
  };
  const id = form.getAttribute("data-id");
  updateFlashCard(newFlashCard, id);
  closeUpdateDialog();
}

function deleteFlashcardClicked(event) {
  console.log("---deleteFlashcardClicked()---");
  const id = event.target.getAttribute("data-id");
  deleteFlashcard(id);
}

async function createFlashcardClicked(event) {
  event.preventDefault();

  const newFlashCard = {
    question: document.querySelector("#create-question").value,
    answer: document.querySelector("#create-answer").value,
    language: document.querySelector("#create-language").value,
    topic: document.querySelector("#create-topic").value,
    difficulty: document.querySelector("#create-difficulty").value,
    image: document.querySelector("#create-image").value,
    link: document.querySelector("#create-link").value,
    code_example: document.querySelector("#create-code-snippet").value,
  };

  createFlashcard(newFlashCard);
  closeCreateDialog();
}

export {
  updateFlashcardClicked,
  deleteFlashcardClicked,
  createFlashcardClicked,
};

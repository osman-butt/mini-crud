"use strict";

// Create flashcard dialog
function showCreateDialog() {
  // Reset input
  document.querySelector("#create-question").value = "";
  document.querySelector("#create-answer").value = "";
  document.querySelector("#create-language").value = "";
  document.querySelector("#create-topic").value = "";
  document.querySelector("#create-difficulty").value = "";
  document.querySelector("#create-image").value = "";
  document.querySelector("#create-link").value = "";
  document.querySelector("#create-code-snippet").value = "";
  // open dialog
  document.getElementById("dialog-create").showModal();
}

// Read Flashcard dialog
function showReadDialog(flashCard) {
  console.log("---showReadDialog()---");
  document.querySelector(".dialog-read-question").textContent =
    flashCard.question;
  document.querySelector(".dialog-read-answer").textContent = flashCard.answer;
  // document.querySelector("#dialog-read-img").src = flashCard.image;
  document.querySelector(".dialog-read-language").textContent =
    flashCard.language;
  document.querySelector(".dialog-read-topic").textContent = flashCard.topic;
  document.querySelector(".dialog-read-difficulty").textContent =
    flashCard.difficulty;
  document.querySelector("pre.dialog-read-example").textContent =
    flashCard.code_example;
  document.querySelector(".dialog-read-docs a").textContent = flashCard.link;
  document.querySelector(".dialog-read-docs a").href = flashCard.link;
  document.querySelector("#card").offsetHeight;
  document.querySelector("#card").classList.remove("rotate");
  document.querySelector("#dialog-read").showModal();
}

function showUpdateDialog(flashCard) {
  document.querySelector("#update-question").value = flashCard.question;
  document.querySelector("#update-answer").value = flashCard.answer;
  document.querySelector("#update-language").value = flashCard.language;
  document.querySelector("#update-topic").value = flashCard.topic;
  document.querySelector("#update-difficulty").value = flashCard.difficulty;
  document.querySelector("#update-image").value = flashCard.image;
  document.querySelector("#update-link").value = flashCard.link;
  document.querySelector("#update-code-snippet").value = flashCard.code_example;
  document.querySelector("#update-form").setAttribute("data-id", flashCard.id);
  document.querySelector("#dialog-update").showModal();
}

function showDeleteDialog(flashCard) {
  console.log("---flashCard()---");
  document.querySelector(".dialog-delete-question span").textContent =
    flashCard.question;
  document.querySelector("#form-delete").setAttribute("data-id", flashCard.id);
  document.querySelector("#dialog-delete").showModal();
}

export { showReadDialog, showUpdateDialog, showCreateDialog, showDeleteDialog };

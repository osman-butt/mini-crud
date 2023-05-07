"use strict";

// Create flashcard dialog
function closeCreateDialog() {
  document.getElementById("dialog-create").close();
}

// Read Flashcard dialog
function closeUpdateDialog() {
  console.log("---closeUpdateDialog()---");
  document.querySelector("#dialog-update").close();
}

function closeDeleteDialog() {
  console.log("closeDeleteDialog");
  document.querySelector("#form-delete").removeAttribute("data-id");
  document.querySelector("#dialog-delete").close();
}

export { closeUpdateDialog, closeCreateDialog, closeDeleteDialog };

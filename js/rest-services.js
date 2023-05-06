"use strict";

// IMPORT MODULES
import { updateFlashCardsGrid } from "./js/view.js";

const endpoint =
  "https://mini-crud-kea-default-rtdb.europe-west1.firebasedatabase.app";
const query = "cards";

// READ
async function getFlashCards() {
  console.log("---getFlashCards()---");
  const response = await fetch(`${endpoint}/${query}.json`);
  if (response.ok) {
    console.log("getFlashCards status " + response.status);
  } else {
    console.log(response.status, response.statusText);
    showFeedbackMsg(
      `Unable to read from database - ${response.status}: ${response.statusText}`
    );
  }
  const data = await response.json();
  const listOfFlashCards = prepareData(data);
  return listOfFlashCards;
}

function prepareData(dataObject) {
  console.log("---prepareData---");
  const flashCards = [];
  for (const key in dataObject) {
    const flashCard = dataObject[key];
    flashCard.id = key;
    flashCards.push(flashCard);
  }
  return flashCards;
}

// UPDATE
async function updateFlashCard(newFlashCard, id) {
  console.log("---updateFlashCard()---");
  const flashCardAsJson = JSON.stringify(newFlashCard);
  const url = `${endpoint}/${query}/${id}.json`;
  const res = await fetch(url, {
    method: "PUT",
    body: flashCardAsJson,
  });
  if (res.ok) {
    console.log("id=" + id + ", was updated succesfully");
    showFeedbackMsg("put");
  } else {
    console.log(res.status, res.statusText);
    showFeedbackMsg(
      `Unable to update database - ${res.status}: ${res.statusText}`
    );
  }
  updateFlashCardsGrid();
}

async function deleteFlashcard(id) {
  console.log("---deleteFlashcard()---");
  const url = `${endpoint}/${query}/${id}.json`;
  const res = await fetch(url, { method: "DELETE" });
  console.log(res.status, res.statusText);
  if (res.ok) {
    console.log("id=" + id + ", was deleted succesfully");
    showFeedbackMsg("delete");
  } else {
    console.log(res.status, res.statusText);
    showFeedbackMsg(
      `Unable to delete from database - ${res.status}: ${res.statusText}`
    );
  }
  console.log(res);
  updateFlashCardsGrid();
}

async function createFlashcard(flashCard) {
  const response = await fetch(`${endpoint}/${query}.json`, {
    method: "POST",
    body: JSON.stringify(flashCard),
  });
  if (response.ok) {
    console.log("The flashcard was updated succesfully");
    showFeedbackMsg("post");
  } else {
    console.log(response.status, response.statusText);
    showFeedbackMsg(
      `Unable to create item in database - ${response.status}: ${response.statusText}`
    );
  }
  updateFlashCardsGrid();
}

function showFeedbackMsg(httpMethod) {
  console.log("---showFeedbackMsg()---");
  let msg;
  let color;
  if (httpMethod == "delete") {
    msg = "The flashcard was succesfully deleted!";
    color = "rgb(255, 68, 68)";
  } else if (httpMethod == "post") {
    msg = "The flashcard was succesfully created!";
    color = "rgb(117, 214, 117)";
  } else if (httpMethod == "put") {
    msg = "The flashcard was succesfully updated!";
    color = "rgb(117, 214, 117)";
  } else {
    msg = httpMethod;
    color = "rgb(255, 68, 68)";
  }
  const prompt = document.querySelector("#feedback");
  prompt.textContent = msg;
  prompt.style.backgroundColor = color;
  prompt.addEventListener("animationend", hidePrompt);
  prompt.classList.remove("hidden");
}

function hidePrompt() {
  const prompt = document.querySelector("#feedback");
  prompt.textContent = "";
  prompt.offsetHeight;
  prompt.classList.add("hidden");
}

export { getFlashCards, updateFlashCard, deleteFlashcard, createFlashcard };

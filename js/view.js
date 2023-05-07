"use strict";

import { getFlashCards } from "./rest-services.js";

import {
  showReadDialog,
  showUpdateDialog,
  showDeleteDialog,
} from "./open-dialog.js";

async function updateFlashCardsGrid() {
  const flashCards = await getFlashCards();
  showFlashCards(flashCards);
  filterFlashcards();
}

function showFlashCards(listOfFlashCards) {
  console.log("---showFlashCards()---");
  document.querySelector("#grid-container").innerHTML = ""; // reset the content of section#posts
  listOfFlashCards.forEach(showFlashCard);
}

function showFlashCard(flashCard) {
  console.log("---showFlashCard()---");
  const html = /*html*/ `
    <article class="grid-item" data-language="${flashCard.language}">
      <img src="${flashCard.image}" />
      <h3>${flashCard.question}</h3>
      <p class="language">Language: ${flashCard.language}</p>
      <p class="topic">Topic: ${flashCard.topic}</p>
      <div class="btns">
        <button class="btn-delete">Delete</button>
        <button class="btn-update">Update</button>
      </div>
    </article>
  `;
  document
    .querySelector("#grid-container")
    .insertAdjacentHTML("beforeend", html);

  document
    .querySelector("#grid-container article:last-child img")
    .addEventListener("click", () => showReadDialog(flashCard));

  document
    .querySelector("#grid-container article:last-child .btn-delete")
    .addEventListener("click", () => showDeleteDialog(flashCard));

  document
    .querySelector("#grid-container article:last-child .btn-update")
    .addEventListener("click", () => showUpdateDialog(flashCard));
}

async function sortFlashcards(event) {
  console.log("---sortFlashcards---");
  const flashCards = await getFlashCards();
  if (event.target.value === "DifficultyAsc") {
    console.log("Sorting by Difficulty Asc");
    flashCards.sort(sortByDifficultyAscending);
    showFlashCards(flashCards);
  } else if (event.target.value === "DifficultyDesc") {
    console.log("Sorting by Difficulty Desc");
    flashCards.sort(sortByDifficultyDescending);
    showFlashCards(flashCards);
  } else if (event.target.value === "TopicAz") {
    console.log("Sorting by Topic A-Z");
    flashCards.sort(sortByTopicAz);
    showFlashCards(flashCards);
  } else if (event.target.value === "TopicZa") {
    console.log("Sorting by Topic Z-A");
    flashCards.sort(sortByTopicZa);
    showFlashCards(flashCards);
  } else {
    updateFlashCardsGrid();
  }
}

function sortByDifficultyAscending(flashCard1, flashCard2) {
  flashCard1.difficultyLevel = rankDifficulty(flashCard1);
  flashCard2.difficultyLevel = rankDifficulty(flashCard2);
  return flashCard1.difficultyLevel - flashCard2.difficultyLevel;
}
function sortByDifficultyDescending(flashCard1, flashCard2) {
  flashCard1.difficultyLevel = -rankDifficulty(flashCard1);
  flashCard2.difficultyLevel = -rankDifficulty(flashCard2);
  return flashCard1.difficultyLevel - flashCard2.difficultyLevel;
}
function sortByTopicAz(flashCard1, flashCard2) {
  return flashCard1.topic.localeCompare(flashCard2.topic);
}
function sortByTopicZa(flashCard1, flashCard2) {
  return flashCard2.topic.localeCompare(flashCard1.topic);
}

function rankDifficulty(flashCard) {
  if (flashCard.difficulty === "easy") {
    return 1;
  } else if (flashCard.difficulty === "medium") {
    return 2;
  } else if (flashCard.difficulty === "hard") {
    return 3;
  }
}

async function filterFlashcards() {
  const selectedLanguage = document.getElementById("language").value;
  const flashcards = await getFlashCards();
  let filteredFlashcards;
  if (selectedLanguage !== "") {
    filteredFlashcards = flashcards.filter(flashcard => {
      return flashcard.language === selectedLanguage;
    });
  } else {
    filteredFlashcards = flashcards;
  }
  showFlashCards(filteredFlashcards);
  return filteredFlashcards;
}

async function searchFlashcards() {
  console.log("---searchFlashcards---");
  const searchKeyword = document
    .querySelector("#input-search")
    .value.toLowerCase();
  // const flashCards = await getFlashCards();
  const flashCards = await filterFlashcards();
  console.log(flashCards);
  const searchedFlashCards = flashCards.filter(
    flashCard =>
      flashCard.question.toLowerCase().includes(searchKeyword) ||
      flashCard.answer.toLowerCase().includes(searchKeyword) ||
      flashCard.language.toLowerCase().includes(searchKeyword) ||
      flashCard.topic.toLowerCase().includes(searchKeyword) ||
      flashCard.difficulty.toLowerCase().includes(searchKeyword)
  );

  showFlashCards(searchedFlashCards);
}

const imageMap = {
  classlist: "images/classlist.webp",
  css: "images/css.png",
  flexbox: "images/flexbox.webp",
  functions: "images/functions.png",
  grid: "images/grid.webp",
  localStorage: "images/localStorage.png",
  promise: "images/promise.jpg",
  websocket: "images/websocket.jpg",
  async: "images/async-await.png",
  fetch: "images/fetch.jpg",
  variables: "images/variables_image.jpg",
  functions: "images/functions_image.jpg",
};

function handleTopicChange(event) {
  const selectedTopic = event.target.value.toLowerCase();
  const imageFilename = imageMap[selectedTopic];

  if (imageFilename) {
    document.getElementById("create-image").value = imageFilename;
  } else if (selectedTopic === "async-await") {
    document.getElementById("create-image").value = "images/async-await.png";
  } else {
    document.getElementById("create-image").value = "";
  }
}

export {
  updateFlashCardsGrid,
  showFlashCards,
  sortFlashcards,
  filterFlashcards,
  searchFlashcards,
  handleTopicChange,
};

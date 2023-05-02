"use strict";

window.addEventListener("load", initApp);

const endpoint =
  "https://mini-crud-kea-default-rtdb.europe-west1.firebasedatabase.app";
const query = "cards";

async function initApp() {
  console.log("initApp: app.js is running 🎉");
  updateFlashCardsGrid();
  document
    .querySelector("#form-delete")
    .addEventListener("submit", deleteFlashcardClicked);
  document
    .querySelector("#form-delete .btn-cancel")
    .addEventListener("click", closeDeleteDialog);
  document
    .querySelector("#sort-data")
    .addEventListener("change", sortFlashcards);
  document
    .querySelector("#filter-btn")
    .addEventListener("click", filterFlashcards);
  document
    .querySelector("#btn-search") // Find the right button, currently it has the same id as "CREATE NEW FLASHCARD"
    .addEventListener("click", searchFlashcards);
}

async function updateFlashCardsGrid() {
  const flashCards = await getFlashCards();
  showFlashCards(flashCards);
}

async function getFlashCards() {
  console.log("---getFlashCards()---");
  const response = await fetch(`${endpoint}/${query}.json`);
  const data = await response.json();
  const listOfFlashCards = prepareData(data);
  if (response.ok) {
    console.log("getFlashCards status " + response.status);
  }
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

function showFlashCards(listOfFlashCards) {
  console.log("---showFlashCards()---");
  document.querySelector("#grid-container").innerHTML = ""; // reset the content of section#posts
  listOfFlashCards.forEach(showFlashCard);
}

function showFlashCard(flashCard) {
  console.log("---showFlashCard()---");
  const html = /*html*/ `
  <article class="grid-item">
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
}

function showReadDialog(flashCard) {
  console.log("---showReadDialog()---");
  document.querySelector(".dialog-read-question span").textContent =
    flashCard.question;
  document.querySelector(".dialog-read-answer span").textContent =
    flashCard.answer;
  // document.querySelector("#dialog-read-img").src = flashCard.image;
  document.querySelector(".dialog-read-language span").textContent =
    flashCard.language;
  document.querySelector(".dialog-read-topic span").textContent =
    flashCard.topic;
  document.querySelector(".dialog-read-difficulty span").textContent =
    flashCard.difficulty;
  document.querySelector("pre.dialog-read-example").textContent =
    flashCard.code_example;
  document.querySelector(".dialog-read-docs a").textContent = flashCard.link;
  document.querySelector(".dialog-read-docs a").href = flashCard.link;
  document.querySelector("#dialog-read").showModal();
}

function showDeleteDialog(flashCard) {
  console.log("---flashCard()---");
  document.querySelector(".dialog-delete-question span").textContent =
    flashCard.question;
  document.querySelector("#form-delete").setAttribute("data-id", flashCard.id);
  document.querySelector("#dialog-delete").showModal();
}

function deleteFlashcardClicked(event) {
  console.log("---deleteFlashcardClicked()---");
  const id = event.target.getAttribute("data-id");
  deleteFlashcard(id);
}

async function deleteFlashcard(id) {
  console.log("---deleteFlashcard()---");
  const url = `${endpoint}/${query}/${id}.json`;
  const res = await fetch(url, { method: "DELETE" });
  if (res.ok) {
    console.log("id=" + id + ", was deleted succesfully");
    showFeedbackMsg("delete");
  }
  console.log(res);
  updateFlashCardsGrid();
}

function closeDeleteDialog() {
  console.log("closeDeleteDialog");
  document.querySelector("#form-delete").removeAttribute("data-id");
  document.querySelector("#dialog-delete").close();
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
  console.log("---filterFlashcards---");
  const filterKeyword = document
    .querySelector("#filter-input")
    .value.toLowerCase();
  const flashCards = await getFlashCards();
  const filteredFlashCards = flashCards.filter(
    (flashCard) =>
      flashCard.question.toLowerCase().includes(filterKeyword) ||
      flashCard.answer.toLowerCase().includes(filterKeyword) ||
      flashCard.language.toLowerCase().includes(filterKeyword) ||
      flashCard.topic.toLowerCase().includes(filterKeyword) ||
      flashCard.difficulty.toLowerCase().includes(filterKeyword)
  );
  showFlashCards(filteredFlashCards);
}

async function searchFlashcards() {
  console.log("---searchFlashcards---");
  const searchKeyword = document
    .querySelector("#input-search")
    .value.toLowerCase();
  const flashCards = await getFlashCards();
  const searchedFlashCards = flashCards.filter((flashCard) =>
    flashCard.question.toLowerCase().includes(searchKeyword)
  );
  showFlashCards(searchedFlashCards);
}

//Eventlistener for create button and dialog box
document
  .getElementById("btn-create")
  .addEventListener("click", openCreateDialog);
document
  .getElementById("create-flashcard-btn-cancel")
  .addEventListener("click", closeCreateDialog);
document.getElementById("create-form").addEventListener("submit", handleSave);

function openCreateDialog() {
  document.getElementById("dialog-create").showModal();
}

function closeCreateDialog() {
  document.getElementById("dialog-create").close();
}

async function handleSave(event) {
  event.preventDefault();

  const newFlashCard = {
    question: document.getElementById("input-question").value,
    answer: document.getElementById("input-answer").value,
    subject: document.getElementById("input-subject").value,
    difficulty: document.getElementById("input-difficulty".value),
    code_example: document.getElementById("input-code-snippet").value,
  };

  await createFlashcard(newFlashCard);
  updateFlashCardsGrid();

  closeCreateDialog();
}

async function createFlashcard(flashcard) {
  const response = await fetch(`${endpoint}/${query}.json`, {
    method: "POST",
    body: JSON.stringify(flashCard),
  });
  if (response.ok) {
    console.log("Flashcard created succesfully");
  } else {
    console.error("Error creating flashcard", response.status);
  }
}

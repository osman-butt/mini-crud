"use strict";

window.addEventListener("load", initApp);

const endpoint =
  "https://mini-crud-kea-default-rtdb.europe-west1.firebasedatabase.app";
const query = "cards";

async function initApp() {
  console.log("initApp: app.js is running 🎉");
  updateFlashCardsGrid();
  document
    .getElementById("btn-create")
    .addEventListener("click", openCreateDialog);
  document.getElementById("create-form").addEventListener("submit", handleSave);
  document
    .getElementById("update-flashcard-btn-cancel")
    .addEventListener("click", closeUpdateDialog);
  document
    .querySelector("#update-form")
    .addEventListener("submit", updateFlashcardClicked);
  document
    .getElementById("create-flashcard-btn-cancel")
    .addEventListener("click", closeCreateDialog);
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
    .querySelector("#language")
    .addEventListener("change", filterFlashcards);
  document
    .querySelector("#btn-search") // Find the right button, currently it has the same id as "CREATE NEW FLASHCARD"
    .addEventListener("click", searchFlashcards);
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

async function updateFlashCardsGrid() {
  const flashCards = await getFlashCards();
  showFlashCards(flashCards);
  filterFlashcards();
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

function showDeleteDialog(flashCard) {
  console.log("---flashCard()---");
  document.querySelector(".dialog-delete-question span").textContent =
    flashCard.question;
  document.querySelector("#form-delete").setAttribute("data-id", flashCard.id);
  document.querySelector("#dialog-delete").showModal();
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

function closeUpdateDialog() {
  console.log("---closeUpdateDialog()---");
  document.querySelector("#dialog-update").close();
}

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
  }

  updateFlashCardsGrid();
}

function deleteFlashcardClicked(event) {
  console.log("---deleteFlashcardClicked()---");
  const id = event.target.getAttribute("data-id");
  deleteFlashcard(id);
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

//Eventlistener for create button and dialog box
function openCreateDialog() {
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

function closeCreateDialog() {
  document.getElementById("dialog-create").close();
}

async function handleSave(event) {
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

async function createFlashcard(flashCard) {
  const response = await fetch(`${endpoint}/${query}.json`, {
    method: "POST",
    body: JSON.stringify(flashCard),
  });
  if (response.ok) {
    console.log("The flashcard was updated succesfully");
    showFeedbackMsg("post");
  }
  updateFlashCardsGrid();
}

const imageMap = {
  classlist:"images/classlist.webp",
  css:"images/css.png",
  flexbox:"images/flexbox.webp",
  functions:"images/functions.png",
  grid:"images/grid.webp",
  localStorage:"images/localStorage.png",
  promise:"images/promise.jpg",
  websocket:"images/websocket.jpg",
  async:"images/async-await.png",
  fetch: "images/fetch.jpg",
  variables: "images/variables_image.jpg",
  functions: "images/functions_image.jpg",
};
document.querySelector("#create-topic").addEventListener("change", handleTopicChange);

function handleTopicChange(event) {
  
  const selectedTopic = event.target.value;
  const imageFilename = imageMap[selectedTopic];
  
  if (imageFilename) {
    document.getElementById("create-image").value = imageFilename;
  } else {
    document.getElementById("create-image").value = "";
  }
}
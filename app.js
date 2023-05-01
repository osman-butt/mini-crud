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
  console.log("DELETED: " + event);
}

async function deleteFlashcard(id) {
  console.log("---deleteFlashcard()---");
}

function closeDeleteDialog() {
  console.log("closeDeleteDialog");
}

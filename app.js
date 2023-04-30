"use strict";

window.addEventListener("load", initApp);

const endpoint =
  "https://mini-crud-kea-default-rtdb.europe-west1.firebasedatabase.app";
const query = "cards";

async function initApp() {
  console.log("initApp: app.js is running 🎉");
  updateFlashCardsGrid();
}

async function updateFlashCardsGrid() {
  const flashCards = await getFlashCards();
  showFlashCards(flashCards);
}

async function getFlashCards() {
  console.log("---getFlashCards()---");
  const response = await fetch(`${endpoint}/${query}.json`);
  const listOfFlashCards = await response.json();
  if (response.ok) {
    console.log("getFlashCards status " + response.status);
  }
  return listOfFlashCards;
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

//Eventlistener for create button
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

function handleSave(event) {
  event.preventDefault();

  closeCreateDialog();
}

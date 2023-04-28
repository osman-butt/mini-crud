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
}

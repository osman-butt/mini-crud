"use strict";

window.addEventListener("load", initApp);

const endpoint =
  "https://mini-crud-kea-default-rtdb.europe-west1.firebasedatabase.app";
const query = "cards";

async function initApp() {
  console.log("initApp: app.js is running 🎉");
  const data = await getFlashCards();
  console.log(data);
}

async function getFlashCards() {
  console.log("---getFlashCards()---");
  const response = await fetch(`${endpoint}/${query}.json`);
  const data = await response.json();
  return data;
}

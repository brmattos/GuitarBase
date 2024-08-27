/*
File: home.js
Description:
    backend for the home page of the entire website/project,
    implements authentication/login & navigation between
    the pages/features
*/

import { userSignIn } from "./backend/auth.js";

const fretboardImg = document.querySelector(".fretboard-img");
const libraryImg = document.querySelector(".library-img");
const toolsImg = document.querySelector(".tools-img");
const fretboardLink = document.getElementById("fretboard-link");
const libraryLink = document.getElementById("library-link");
const toolsLink = document.getElementById("tools-link");
const signBtn = document.querySelector(".sign-in");

fretboardImg.addEventListener("click", function() {
    window.location.href = "../pages/fretboard.html";
});
fretboardLink.addEventListener("click", function() {
    window.location.href = "../pages/fretboard.html";
});

libraryImg.addEventListener("click", function() {
    if (signBtn.innerHTML == "SIGN OUT") {
        window.location.href = "../pages/library.html";
    } else {
        // prompt with popup, don't allow into page until signed in
        userSignIn();
    }
});
libraryLink.addEventListener("click", function() {
    if (signBtn.innerHTML == "SIGN OUT") {
        window.location.href = "../pages/library.html";
    } else {
        // prompt with popup, don't allow into page until signed in
        userSignIn();
    }
});

toolsImg.addEventListener("click", function() {
    window.location.href = "../pages/tools.html";
});
toolsLink.addEventListener("click", function() {
    window.location.href = "../pages/tools.html";
});
/*
File: home.js
Description:
    backend for the home page of the entire website/project,
    implements authentication/login & navigation between
    the pages/features
*/

const fretboardImg = document.querySelector(".fretboard-img");
const libraryImg = document.querySelector(".library-img");
const toolsImg = document.querySelector(".tools-img");
const fretboardLink = document.getElementById("fretboard-link");
const libraryLink = document.getElementById("library-link");
const toolsLink = document.getElementById("tools-link");

// Page images links
fretboardImg.addEventListener("click", function() {
    window.location.href = "../pages/fretboard.html";
});
libraryImg.addEventListener("click", function() {
    window.location.href = "../pages/library.html";
});
toolsImg.addEventListener("click", function() {
    window.location.href = "../pages/tools.html";
});

// Feature title links
fretboardLink.addEventListener("click", function() {
    window.location.href = "../pages/fretboard.html";
});
libraryLink.addEventListener("click", function() {
    window.location.href = "../pages/library.html";
});
toolsLink.addEventListener("click", function() {
    window.location.href = "../pages/tools.html";
});
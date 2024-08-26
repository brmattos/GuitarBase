/*
File: library.js
Description:
    the backend for the library page, database for tracking 
    songs that the user is learning / wants to learn
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// DATABASE SETUP
// const appSettings = {
//     databaseURL: "https://guitarbase-3d851-default-rtdb.firebaseio.com/"
// }
// const app = initializeApp(appSettings);
// const database = getDatabase(app);
// const entriesInDB = ref(database, "songs");

const searchField = document.querySelector(".input-group input");
const tableBody = document.querySelector("tbody");
const tableHeadings = document.querySelectorAll("thead th")
const addBtn = document.querySelector(".add-btn");

let count = 0;

const app = {
    init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
        searchField.addEventListener("input", table.searchTable);
        addBtn.addEventListener("click", listeners.addEntry);
        tableHeadings.addEventListener("click", handlers.handleSorting);
        tableBody.addEventListener("click", function(event) {
            // Inner entry functionalities
            if (event.target.classList.contains("favorite")) {
                listeners.getFavorite(event);
            } else if (event.target.classList.contains("status")) {
                listeners.changeStatus(event);
            } else if (event.target.classList.contains("tabs")) {
                listeners.getTabs(event);
            } else if (event.target.classList.contains("edit")) {
                listeners.editEntry(event);
            } else if (event.target.classList.contains("del")) {
                listeners.deleteEntry(event);
            }
        });
    }
}

const table = {
    searchTable() {
        /* Upon search in searchbar, finds any occurence in any of the text fields */
        const tableRows = document.querySelectorAll("tbody tr");
        const searchData = searchField.value.toLowerCase();
        tableRows.forEach((row, i) => {
            let data = "";
            row.querySelectorAll("input").forEach(input => {
                data += input.value.toLowerCase() + " ";
            });
            row.classList.toggle(".hide", data.indexOf(searchData) < 0);
            row.style.setProperty("--delay", i/25 + "s");  // seamless transition on group hide
        });
    },
}

const listeners = {
    getFavorite(event) {
        if (event.target.style.color === "gold") {
            event.target.style.color = "";  // revert to default
        } else {
            event.target.style.color = "gold"; // set to gold
        }
    },

    changeStatus(event) {
        if (event.target.id == "not-learned") {
            event.target.id = "in-progress";
            event.target.innerHTML = "In Progress";
        } else if (event.target.id == "in-progress") {
            event.target.id = "learned";
            event.target.innerHTML = "Learned";
        } else if (event.target.id == "learned") {
            event.target.id = "not-learned";
            event.target.innerHTML = "Not Learned";
        }
    },

    getTabs(event) {
        /* Get the link for the tabs (Ultimate Guitar Tabs) */

        event.preventDefault();
        let newLink = "";
        let link = "https://www.ultimate-guitar.com/search.php?search_type=title&value=";
        const row = event.target.parentElement.parentElement;

        row.querySelectorAll("input").forEach(input => {
            // Get the song title and artist name
            if (!input.classList.contains("tuning")) {
                input.value.split(" ").forEach(word => {
                    if (word.toLowerCase()) {
                        newLink += word.toLowerCase() + "%20";
                    }
                });
            }
        });

        if (newLink) {
            // open link in new tab
            link += newLink;
            window.open(link, "_blank");
        }
    },

    editEntry(event) {

    },

    deleteEntry(event) {
        /* Delete the given entry */
        let row = event.target.parentElement.parentElement;
        row.parentElement.removeChild(row);
    },

    addEntry() {
        /* Add a new entry with the table data field defaults */
        let row = tools.createElement("tr");
        tableBody.appendChild(row);
        for (let i = 0; i < 8; i++) {
            let data = tools.createElement("td");
            row.appendChild(data);
            if (i == 0) {
                // FAVORITE STAR
                let favorite = tools.createElement("span", "&#9733;");
                favorite.setAttribute("class", "favorite");
                favorite.setAttribute("id", count);
                data.appendChild(favorite);
            } else if (i == 1) {
                // LEARNING STATUS BUTTON
                let status = tools.createElement("button", "Not Learned");
                status.setAttribute("class", "status");
                status.setAttribute("id", "not-learned");
                data.appendChild(status);
            } else if (i == 2) {
                // SONG TITLE
                let song = tools.createElement("input");
                song.setAttribute("type", "text");
                song.setAttribute("placeholder", "song title");
                song.setAttribute("autocomplete", "off");
                song.setAttribute("id", "song:" + count);
                song.setAttribute("class", "song");
                data.appendChild(song);
            } else if (i == 3) {
                // ARTIST NAME
                let artist = tools.createElement("input");
                artist.setAttribute("type", "text");
                artist.setAttribute("placeholder", "artist name");
                artist.setAttribute("autocomplete", "off");
                artist.setAttribute("id", "artist:" + count);
                artist.setAttribute("class", "artist");
                data.appendChild(artist);
            } else if (i == 4) {
                // TUNING
                let tuning = tools.createElement("input");
                tuning.setAttribute("type", "text");
                tuning.setAttribute("autocomplete", "off");
                tuning.setAttribute("placeholder", "EADGBE");
                tuning.setAttribute("id", "tuning:" + count);
                tuning.setAttribute("class", "tuning");
                data.appendChild(tuning);
            } else if (i == 5) {
                // TABS LINK
                let tabs = tools.createElement("a", "TABS");
                tabs.setAttribute("class", "tabs");
                tabs.setAttribute("href", "");
                data.appendChild(tabs);
            } else if (i == 6) {
                // EDIT BUTTON
                let edit = tools.createElement("span", "edit");
                edit.setAttribute("class", "material-symbols-outlined edit");
                data.appendChild(edit);
            } else if (i == 7) {
                // DELETE BUTTON
                let del = tools.createElement("span", "delete_forever");
                del.setAttribute("class", "material-symbols-outlined del");
                data.appendChild(del);
            }
        }
        count++;
    }
}

const handlers = {
    handleSorting(event) {
        const tableRows = document.querySelectorAll("tbody tr");
        const searchData = searchField.value.toLowerCase();
        tableRows.forEach((row, i) => {
            let data = "";
            row.querySelectorAll("input").forEach(input => {
                data += input.value.toLowerCase() + " ";
            });
            row.classList.toggle(".hide", data.indexOf(searchData) < 0);
            row.style.setProperty("--delay", i/25 + "s");  // seamless transition on group hide
        });

        tableHeadings.forEach((heading) => {
            heading.id = "inactive";
        });
        event.target.id = "active";
    }
}

const tools = {
    createElement(element, content) {
        element = document.createElement(element);
        if (arguments.length > 1) {
            // passed in content
            element.innerHTML = content;
        }
        return element;
    }
}

app.init();
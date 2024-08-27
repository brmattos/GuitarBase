/*
File: library.js
Description:
    the backend for the library page, database for tracking 
    songs that the user is learning / wants to learn
*/

// import { db } from "./auth.js";

const searchField = document.querySelector(".input-group input");
const tableBody = document.querySelector("tbody");
const tableHeadings = document.querySelectorAll("thead th");
const addBtn = document.querySelector(".add-btn");
let count = 0;

const app = {
    init() {
        this.setupEventListeners();
        // handlers.addEntry();  // initial dummy entry
    },

    setupEventListeners() {
        searchField.addEventListener("input", table.searchTable);
        addBtn.addEventListener("click", handlers.addEntry);

        tableBody.addEventListener("click", function(event) {
            /* Inner entry functionalities */
            if (event.target.classList.contains("favorite")) {
                listeners.getFavorite(event);
            } else if (event.target.classList.contains("status")) {
                listeners.changeStatus(event);
            } else if (event.target.classList.contains("tabs")) {
                listeners.getTabs(event);
            } else if (event.target.classList.contains("del")) {
                listeners.deleteEntry(event);
            }
        });

        tableHeadings.forEach((heading, column) => {
            /* Event listeners for each table heading, implements sorting the table */
            let sort_asc = true;
            heading.addEventListener("click", (event) => {
                if (event.target.tagName == "TH") {
                    return;
                }
                
                // Remove the most recent active sort
                tableHeadings.forEach((heading) => {
                    if (!event.target.classList.contains("edit")) {
                        heading.classList.remove("active");
                    }
                });
        
                // Set as active
                let validHead = event.target.parentElement.classList;
                let id = event.target.parentElement.id;
                if (id == 1 || id == 2 || id == 3 || id == 4) {
                    validHead.add("active");
                }
        
                // Set all to inactive
                document.querySelectorAll("td").forEach(td => td.classList.remove("active"));
        
                // Get the column (all row table data for the active column)
                const tableRows = document.querySelectorAll("tbody tr");
                tableRows.forEach((row) => {
                    if (id != 0 && id != 5 && id != 6) {
                        row.querySelectorAll("td")[id].classList.add("active");
                    }
                });
        
                // Determine whether in ascending or descending order
                event.target.parentElement.classList.toggle("asc", sort_asc);
                sort_asc = event.target.parentElement.classList.contains("asc") ? false : true;

                handlers.sortTable(tableRows, column, sort_asc);  // sort the table by the column
            });
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
            row.classList.toggle("hide", data.indexOf(searchData) < 0);
            row.style.setProperty("--delay", i/25 + "s");  // seamless transition on group hide
        });
    },
}

const listeners = {
    getFavorite(event) {
        /* Update a favorite star to on or off for a song */
        if (event.target.style.color === "gold") {
            event.target.style.color = "";  // revert to default
            event.target.setAttribute("value", "off");
        } else {
            event.target.style.color = "gold"; // set to gold
            event.target.setAttribute("value", "on");
        }
    },

    changeStatus(event) {
        /* Update the learn status of a song */
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

    deleteEntry(event) {
        /* Delete the given entry, add disappear effect */
        let row = event.target.parentElement.parentElement;
        row.classList.add("fadeout");
        setTimeout(() => {
            row.parentElement.removeChild(row);
        }, 400);
    }
}

const handlers = {
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
                song.setAttribute("class", "song");
                data.appendChild(song);
            } else if (i == 3) {
                // ARTIST NAME
                let artist = tools.createElement("input");
                artist.setAttribute("type", "text");
                artist.setAttribute("placeholder", "artist name");
                artist.setAttribute("autocomplete", "off");
                artist.setAttribute("class", "artist");
                data.appendChild(artist);
            } else if (i == 4) {
                // TUNING
                let tuning = tools.createElement("input");
                tuning.setAttribute("type", "text");
                tuning.setAttribute("autocomplete", "off");
                tuning.setAttribute("placeholder", "EADGBE");
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
    },

    sortTable(tableRows, column, sort_asc) {
        /* Sort function, run on the selected column to sort table alphabetically by column */
        [...tableRows].sort((a, b) => {

            // split into (a, b) to compare at each entry
            let first_row = a.querySelectorAll("td")[column].firstElementChild;
            let second_row = b.querySelectorAll("td")[column].firstElementChild;

            if (first_row.tagName == "INPUT") {
                // input column (get value)
                first_row = first_row.value;
                second_row = second_row.value;
            } else if (first_row.tagName == "BUTTON") {
                // button column (get html)
                first_row = first_row.innerHTML;
                second_row = second_row.innerHTML;
            } else if (first_row.tagName == "") {
                return;  // non-sortable column
            }

            // handle swapping positions (T: ascending F: descending)
            return sort_asc ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1);

        }).map(sorted_row => document.querySelector("tbody").appendChild(sorted_row));
    }
}

const tools = {
    createElement(element, content) {
        /* Helper function (used for creating html elements with js in addEntry()) */
        element = document.createElement(element);
        if (arguments.length > 1) {
            element.innerHTML = content;
        }
        return element;
    }
}

app.init();
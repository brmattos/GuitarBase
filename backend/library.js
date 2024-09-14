/*
File: library.js
Description:
    the backend for the library page, database for tracking 
    songs that the user is learning / wants to learn
*/

import { doc, setDoc, getDocs, collection, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { clientId, clientSecret } from "../keys.js";
import { db } from "./auth.js";

const userId = localStorage.getItem("uid");
const searchField = document.querySelector(".input-group input");
const tableBody = document.querySelector("tbody");
const tableHeadings = document.querySelectorAll("thead th");
const addBtn = document.querySelector(".add-btn");
let count = 0;
let accessToken = "";


/* ------------------------------- SPOTIFY API ------------------------------- */
const APIController = (() => {
    // API access token
    const authParams = {
        method: "Post",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "grant_type=client_credentials&client_id=" + clientId + "&client_secret=" + clientSecret
    }

    fetch("https://accounts.spotify.com/api/token", authParams)
        .then(result => result.json())
        .then(data => {
            accessToken = data.access_token;
        }).catch(error => console.error("Error fetching access token:", error));
})();

async function searchTrack(song, artist, accessToken) {
    const query = encodeURIComponent(`${song} ${artist}`);
    const searchParams = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    }
    let searchRef = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, searchParams)
        .then(response => response.json())
        .then(data => data.tracks.items[0].href);
    return searchRef;
}
/* --------------------------------------------------------------------------- */

const app = {
    init() {
        database.loadUserLibrary();
        this.setupEventListeners();
    },

    setupEventListeners() {
        searchField.addEventListener("input", table.searchTable);
        addBtn.addEventListener("click", () => handlers.addEntry(false));

        tableBody.addEventListener("click", function(event) {
            /* Inner entry functionalities */
            if (event.target.classList.contains("favorite")) {
                listeners.getFavorite(event);
            } else if (event.target.classList.contains("status")) {
                listeners.changeStatus(event);
            } else if (event.target.classList.contains("tabs")) {
                listeners.getTabs(event);
            } else if (event.target.classList.contains("play")){
                listeners.playEntry(event);
            } else if (event.target.classList.contains("del")) {
                handlers.deleteEntry(event);
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
                    if (!event.target.classList.contains("play")) {
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

                table.sortTable(tableRows, column, sort_asc);  // sort the table by the column
            });
        });
    }
}

const database = {
    async loadUserLibrary() {
        const userLibraryRef = collection(db, "users", userId, "library");
        const librarySnapshot = await getDocs(userLibraryRef);
        if (librarySnapshot.size == 0) {
            // no data, start with empty
            handlers.addEntry(false);  // initial dummy entry
        } else {
            librarySnapshot.forEach((doc) => {
                this.readEntryDB(doc);
            });
        } 
    },

    readEntryDB(doc) {
        let entryRow = handlers.addEntry(true);
        entryRow.setAttribute("id", doc.id);

        // Cascading load effect
        entryRow.classList.add("fade-in");
        const index = tableBody.children.length - 1;
        entryRow.style.animationDelay = `${index * 0.1}s`;


        for (let i = 0; i < 6; i++) {
            let element = entryRow.children[i].firstElementChild;
            if (i == 0) {
                // FAVORITE STAR
                if (doc.data().favorite) {
                    // is favorited
                    element.style.color = "gold";
                    element.setAttribute("value", "on");
                } else {
                    element.setAttribute("value", "off");
                }
            } else if (i == 1) {
                // STATUS
                element.id = doc.data().status;
                if (doc.data().status == "not-learned") {
                    element.innerHTML = "Not Learned";
                } else if (doc.data().status == "in-progress") {
                    element.innerHTML = "In Progress";
                } else if (doc.data().status == "learned") {
                    element.innerHTML = "Learned";
                }
            } else if (i == 2) {
                // SONG TITLE
                element.value = doc.data().song;
            } else if (i == 3) {
                // ARTIST NAME
                element.value = doc.data().artist;
            } else if (i == 4) {
                // TUNING
                element.value = doc.data().tuning;
            } else if (i == 5) {
                // TAB LINK
                element.href = doc.data().tabs;
            }
        }

        // Add event listeners to input fields for updates
        this.addInputListeners(entryRow, doc.id);
    },

    async createEntryDB() {
        const userLibraryRef = collection(db, "users", userId, "library");
        const docRef = doc(userLibraryRef);
        await setDoc(docRef, {
            favorite: false,
            status: "not-learned",
            song: "",
            artist: "",
            tuning: "",
            tabs: ""
        });
        return docRef.id;
    },

    async deleteEntryDB(docId) {
        const docRef = doc(db, "users", userId, "library", docId);
        await deleteDoc(docRef);
    },

    async updateEntryDB(docId, updates) {
        const docRef = doc(db, "users", userId, "library", docId);
        await updateDoc(docRef, updates);
    },

    addInputListeners(row, docId) {
        row.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", () => {
                const updates = {};
                const songInput = row.querySelector(".song");
                const artistInput = row.querySelector(".artist");
                const tuningInput = row.querySelector(".tuning");

                if (songInput) updates.song = songInput.value;
                if (artistInput) updates.artist = artistInput.value;
                if (tuningInput) updates.tuning = tuningInput.value;
                this.updateEntryDB(docId, updates);
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

    sortTable(tableRows, column, sort_asc) {
        /* Sort function, run on the selected column to sort table alphabetically by column */
        [...tableRows].sort((a, b) => {

            // split into (a, b) to compare at each entry
            let first_row = a.querySelectorAll("td")[column].firstElementChild;
            let second_row = b.querySelectorAll("td")[column].firstElementChild;

            if (first_row.tagName == "INPUT") {
                // input column (get value)
                first_row = first_row.value;
                second_row = second_row;
            } else if (first_row.tagName == "BUTTON") {
                // button column (get html)
                first_row = first_row.innerHTML;
                second_row = second_row.innerHTML;
            } else {
                return;  // non-sortable column
            }
            
            return sort_asc ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1);

        }).map(sorted_row => document.querySelector("tbody").appendChild(sorted_row));
    }
}

const listeners = {
    getFavorite(event) {
        /* Update a favorite star to on or off for a song */
        if (event.target.style.color == "gold") {
            // revert to default (off)
            event.target.style.color = "";
            event.target.setAttribute("value", "off");
        } else {
            // set to gold (on)
            event.target.style.color = "gold";
            event.target.setAttribute("value", "on");
        }

        // Update database
        const updates = {};
        let docId = event.target.parentElement.parentElement.id;
        updates.favorite = (event.target.style.color == "gold") ? true : false;
        database.updateEntryDB(docId, updates);
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

        // Update database
        const updates = {};
        let docId = event.target.parentElement.parentElement.id;
        updates.status = event.target.id;
        database.updateEntryDB(docId, updates);
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

            // Update database
            const updates = {};
            let docId = event.target.parentElement.parentElement.id;
            updates.tabs = link;
            database.updateEntryDB(docId, updates);
        }
    },

    async playEntry(event) {
        /* Play the given entry on Spotify */
        let row = event.target.parentElement.parentElement;
        let song, artist;
        row.querySelectorAll("input").forEach(input => {
            // Get the song title and artist name
            if (input.classList.contains("artist")) {
                artist = input.value
            } else if (input.classList.contains("song")) {
                song = input.value;
            }
        });
        const track = await searchTrack(song, artist, accessToken);
        const trackId = track.split('/').pop();
        const spotifyWebUrl = `https://open.spotify.com/track/${trackId}`;
        window.open(spotifyWebUrl, '_blank');
    }
}

const handlers = {
    addEntry(initialRender) {
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
                // PLAY BUTTON
                let play = tools.createElement("span", "play_circle");
                play.setAttribute("class", "material-symbols-outlined play");
                data.appendChild(play);
            } else if (i == 7) {
                // DELETE BUTTON
                let del = tools.createElement("span", "delete_forever");
                del.setAttribute("class", "material-symbols-outlined del");
                data.appendChild(del);
            }
        }

        count++;
        if (initialRender) {
            return row;
        }
        row.id = database.createEntryDB();
    },

    deleteEntry(event) {
        /* Delete the given entry, add disappear effect */
        let docId = event.target.parentElement.parentElement.id;
        let row = event.target.parentElement.parentElement;
        row.classList.add("fadeout");
        setTimeout(() => {
            // remove the entry from the page and the database
            database.deleteEntryDB(docId);
            row.parentElement.removeChild(row);
        }, 100);
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
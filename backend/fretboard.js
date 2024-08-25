/*
File: fretboard.js
Description:
    backend for the interactive fretboard page,
    change tuning, number of frets, accidental
    and select/play notes & chords on a fretboard
*/

// import { userSignIn } from "./auth.js";

(function () {

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Setup the audio, {data-note : audio}
const noteSounds = {

    "-9": new Audio("../sounds/DS0.mp3"),
    "-10": new Audio("../sounds/D0.mp3"),
    "-11": new Audio("../sounds/CS0.mp3"),
    "-12": new Audio("../sounds/C0.mp3"),

    0: new Audio("../sounds/C1.m4a"),
    1: new Audio("../sounds/CS1.m4a"),
    2: new Audio("../sounds/D1.m4a"),
    3: new Audio("../sounds/DS1.m4a"),
    4: new Audio("../sounds/E1.m4a"),
    5: new Audio("../sounds/F1.m4a"),
    6: new Audio("../sounds/FS1.m4a"),
    7: new Audio("../sounds/G1.m4a"),
    8: new Audio("../sounds/GS1.m4a"),
    9: new Audio("../sounds/A1.m4a"),
    10: new Audio("../sounds/AS1.m4a"),
    11: new Audio("../sounds/B1.m4a"),

    12: new Audio("../sounds/C2.mp3"),
    13: new Audio("../sounds/CS2.m4a"),
    14: new Audio("../sounds/D2.m4a"),
    15: new Audio("../sounds/DS2.m4a"),
    16: new Audio("../sounds/E2.m4a"),
    17: new Audio("../sounds/F2.m4a"),
    18: new Audio("../sounds/FS2.m4a"),
    19: new Audio("../sounds/G2.m4a"),
    20: new Audio("../sounds/GS2.m4a"),
    21: new Audio("../sounds/A2.m4a"),
    22: new Audio("../sounds/AS2.m4a"),
    23: new Audio("../sounds/B2.m4a"),

    24: new Audio("../sounds/C3.mp3"),
    25: new Audio("../sounds/CS3.mp3"),
    26: new Audio("../sounds/D3.mp3"),
    27: new Audio("../sounds/DS3.mp3"),
    28: new Audio("../sounds/E3.m4a"),
    29: new Audio("../sounds/F3.m4a"),
    30: new Audio("../sounds/FS3.m4a"),
    31: new Audio("../sounds/G3.m4a"),
    32: new Audio("../sounds/GS3.m4a"),
    33: new Audio("../sounds/A3.m4a"),
    34: new Audio("../sounds/AS3.m4a"),
    35: new Audio("../sounds/B3.m4a"),

    36: new Audio("../sounds/C4.mp3"),
    37: new Audio("../sounds/CS4.mp3"),
    38: new Audio("../sounds/D4.mp3"),
    39: new Audio("../sounds/DS4.m4a"),
    40: new Audio("../sounds/E4.m4a"),
    41: new Audio("../sounds/F4.m4a"),
    42: new Audio("../sounds/FS4.m4a"),
    43: new Audio("../sounds/G4.m4a"),
    44: new Audio("../sounds/GS4.m4a"),
    45: new Audio("../sounds/A4.m4a"),
    46: new Audio("../sounds/AS4.m4a"),
    47: new Audio("../sounds/B4.m4a"),
};

const root = document.documentElement;  // access css root vars
const fretboard = document.querySelector(".fretboard");
const fretNumbers = document.querySelector(".numbers");
const accidentalSelector = document.querySelector(".accidental-selector");
const fretNumInput = document.getElementById("fret-input");
const tuningSetting = document.querySelector(".tuning-setting");
const increaseFret = document.getElementById("increment");
const decreaseFret = document.getElementById("decrement");
const resetBtn = document.querySelector(".reset-button");
const playBtn = document.querySelector(".play-button");
const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const fretmarkDots = [3, 5, 7, 9, 15, 17, 19, 21];
const signBtn = document.querySelector(".sign-in");

let tunings = {
    /* Possible alternate tunings for each string (relative to flats/sharps arr positions) */
    // {string : possible tunings}
    // - 1 up + 1 root + 4 down
    1: [4, 3, 2, 1, 0, 5],    // E Eb D Db C F
    2: [11, 10, 9, 8, 7, 6],  // B Bb A Ab G C
    3: [7, 6, 5, 4, 3, 2],    // G Gb F E Eb Ab
    4: [2, 1, 0, 11, 10, 9],  // D Db C B Bb Eb
    5: [9, 8, 7, 6, 5, 4],    // A Ab G Gb F Bb
    6: [4, 3, 2, 1, 0, 5]     // E Eb D Db C F
}

let noteSet = {
    /* track all selected notes (can only have one selected on each string)*/
    // { string : [currently selected note, octave] }
    1: ["", 0],
    2: ["", 0],
    3: ["", 0],
    4: ["", 0],
    5: ["", 0],
    6: ["", 0]
}

// IMPORTANT VARS
let num_frets = 12;
let accidentals = "sharps";
let tuning = [4, 11, 7, 2, 9, 4];      // high E -> low E
let base_octaves = [3, 2, 2, 1, 1, 1]  // high E -> low E (4 octaves)

// ---------------------------------------------------------------------------------------------

/* ----------------------------- MAIN ------------------------------ */

const app = {
    init() {
        this.setupFretboard();
        this.setupEventListeners();
        this.setupTuningSection();
        audio.loadAudio();
    },

    setupFretboard() {
        /* Setup the fretboard (strings, frets, fretmarks) */

        fretboard.innerHTML = "";
        fretNumbers.innerHTML= "";
        root.style.setProperty("--number-of-strings", 6);

        for (let i = 0; i < 6; i++) {
            // Add strings to the fretboard
            let str = tools.createElement("div");
            str.setAttribute("id", (i+1).toString());
            str.classList.add("string");
            fretboard.appendChild(str);

            let octave = base_octaves[i];
            for (let fret = 0; fret <= num_frets; fret++) {
                // Add the frets to the fretboard
                let note_fret = tools.createElement("div");
                note_fret.classList.add("note-fret");
                str.appendChild(note_fret);

                // Setup the tuning
                let note_name = tools.generateNoteNames((fret + tuning[i]), accidentals);
                note_fret.setAttribute("data-note", note_name);

                // Set up the octave
                
                if (note_name == "E" && fret > 0) {
                    octave += 1;
                }
                note_fret.setAttribute("octave", octave);

                // Setup the fret numbers
                if (i == 0) {
                    let num = tools.createElement("div", fret);
                    num.classList.add("fret-number");
                    fretNumbers.appendChild(num);
                }
                
                // Add the fretmarks (single & double)
                if (i == 0) {
                    if (fretmarkDots.indexOf(fret) != -1) {
                        note_fret.classList.add("single-fretmark");
                    } else if (fret == 12) {
                        let double_fretmark = tools.createElement("div");
                        double_fretmark.classList.add("double-fretmark");
                        note_fret.appendChild(double_fretmark);
                    }
                }
            }
        }
    },

    setupTuningSection() {
        /* For the tuning section of the settings, create each individual select drop-down */
        tuningSetting.innerHTML = "";
        for (let i = 5; i >= 0; i--) {

            // Create the div for the column
            let group = tools.createElement("div");
            group.classList.add("setting-group");
            tuningSetting.appendChild(group);

            // Create the div for the respective note str
            // (start off at given tuning, EADGBE)
            let str_tuning;
            if (accidentals == "flats") {
                note = notesFlat[tuning[i]];
            } else {
                note = notesSharp[tuning[i]];
            }
            str_tuning = tools.createElement("button", note);
            str_tuning.value = 0;
            str_tuning.id = (i+1).toString();
            str_tuning.classList.add("tuning");
            str_tuning.addEventListener("click", listeners.changeTuning)
            group.appendChild(str_tuning);
        }
    },

    setupEventListeners() {
        document.addEventListener("keydown", listeners.enter);
        document.addEventListener("keydown", listeners.backspace);
        fretboard.addEventListener("click", listeners.fretboardClick);
        accidentalSelector.addEventListener("click", listeners.selectAccidental);
        resetBtn.addEventListener("click", listeners.reset);
        playBtn.addEventListener("click", listeners.playNotes);
        increaseFret.addEventListener("click", listeners.changeFretNumber);
        decreaseFret.addEventListener("click", listeners.changeFretNumber);
    }
}

/* --------------------------- LISTENERS ---------------------------- */

const listeners = {
    fretboardClick(event) {
        if (event.target.classList.contains("note-fret")) {
            let string = event.target.parentElement.id;
            let note = event.target.getAttribute("data-note");
            let octave = event.target.getAttribute("octave");
            const currentOpacity = getComputedStyle(event.target).getPropertyValue("--noteOpacity");

            if (currentOpacity == 0) {
                // Click on (VISIBLE)
                if (noteSet[string] != "") {
                    // replace previously selected note
                    let stringNotes = event.target.parentElement.querySelectorAll(".note-fret");
                    stringNotes.forEach(child => {
                        child.style.setProperty("--noteOpacity", 0);  // de-toggle note
                    });
                }

                // update the note
                noteSet[string] = [note, parseInt(octave, 10)];
                event.target.style.setProperty("--noteOpacity", 1);   // toggle note
            } else {
                // Click off (HIDDEN)
                noteSet[string] = ["", 0];
                event.target.style.setProperty("--noteOpacity", 0);  // de-toggle note
            }
        }
    },

    selectAccidental(event) {
        if (event.target.classList.contains("acc-selector")) {
            if (event.target.value != accidentals) {
                // Changed the button
                accidentals = event.target.value;
                Object.keys(noteSet).forEach(str => noteSet[str] = ["", 0]);
                tools.clearNotes();
                app.setupFretboard();  // reset the fretboard
            }
        }
    },

    reset() {
        num_frets = 12;
        tuning = [4, 11, 7, 2, 9, 4];
        Object.keys(noteSet).forEach(str => noteSet[str] = ["", 0]);
        fretNumInput.setAttribute("value", "12");
        app.setupFretboard();
        app.setupTuningSection();
        tools.clearNotes();
    },

    changeTuning(event) {
        let pos = parseInt(event.target.getAttribute("value"), 10);
        let string_number = parseInt(event.target.getAttribute("id"), 10);

        let length = tunings[1].length;
        if (pos < (length - 1)) {
            pos += 1  // can iterate forward
        } else {
            pos = 0  // need to go back to start (standard)
        }

        let new_note = "";
        if (accidentals == "flats") {
            new_note = notesFlat[tunings[string_number][pos]];
        } else {
            new_note = notesSharp[tunings[string_number][pos]];
        }

        // Change the padding depending on note
        if (new_note.length == 2) {
            event.target.style.padding = "20px 14px 20px 14px";
        } else if (new_note == "F") {
            event.target.style.padding = "20px 21px 20px 21px";
        } else {
            event.target.style.padding = "20px";
        }

        // Update the octave when going below orig tuning for E string
        if (string_number == 6) {
            if (pos == 0 || pos == 5) {
                base_octaves[string_number - 1] = 1;
            } else {
                base_octaves[string_number - 1] = 0;
            }
        }

        event.target.innerHTML = new_note;
        event.target.setAttribute("value", pos);
        tuning[string_number - 1] = tunings[string_number][pos];
        Object.keys(noteSet).forEach(str => noteSet[str] = ["", 0]);
        tools.clearNotes();
        app.setupFretboard();
    },

    changeFretNumber(event) {
        let id = event.target.id;
        let min = fretNumInput.min;
        let max = fretNumInput.max;
        let val = fretNumInput.value;
        let direction = (id == "increment") ? 1 : -1
        let newVal = parseInt(val) + direction;
        if (newVal >= min && newVal <= max) {
            fretNumInput.setAttribute("value", newVal);
            num_frets = newVal;
            app.setupFretboard();
            Object.keys(noteSet).forEach(str => noteSet[str] = ["", 0]);
        }
    },

    enter(event) {
        if (event.code == "Space") {
            event.preventDefault();
            listeners.playNotes();
        }
    },

    backspace(event) {
        if (event.code === "Backspace" || event.code === "Delete") {
            event.preventDefault();
            listeners.reset();
        }
    },

    async playNotes() {
        audio.stopAllAudio();
        let index, octave;
        let note_count = 6;
        for (let i = 6; i > 0; i--) {
            note_count -= 1;
            if (noteSet[i][0] != "") {
                if (accidentals == "flats") {
                    index = notesFlat.indexOf(noteSet[i][0]);
                } else {
                    index = notesSharp.indexOf(noteSet[i][0]);
                }

                octave = noteSet[i][1];
                soundKey = parseInt(index + ((octave - 1) * 12));

                if (noteSounds[soundKey]) {
                    noteSounds[soundKey].play();
                    await sleep(50);
                }
            }
        }
    }
}

/* ---------------------------- TOOLS ------------------------------ */

const tools = {
    /* Creation tool methods */
    createElement(element, content) {
        element = document.createElement(element);
        if (arguments.length > 1) {
            // passed in content
            element.innerHTML = content;
        }
        return element;
    },

    generateNoteNames(index, accidentals) {
        /* Get the note at a given fret */
        octave = Math.floor(index / 12);
        index %= 12;
        if (accidentals == "flats") {
            return notesFlat[index];
        } else if (accidentals == "sharps") {
            return notesSharp[index];
        }
    },

    clearNotes() {
        const allNotes = document.querySelectorAll(".note-fret");
        allNotes.forEach(note => {
            // Hide all notes
            note.style.setProperty("--noteOpacity", 0);
        });
    },
}

/* ---------------------------- AUDIO ------------------------------ */

const audio = {
    loadAudio() {
        for (const fret in noteSounds) {
            if (noteSounds[fret]) {
                noteSounds[fret].load();  // Preload the audio file
            }
        }
    },

    stopAllAudio() {
        // Stop all playing audio
        for (const fret in noteSounds) {
            if (noteSounds[fret]) {
                noteSounds[fret].pause();
                noteSounds[fret].currentTime = 0;
            }
        }
    },
}

app.init();
})();
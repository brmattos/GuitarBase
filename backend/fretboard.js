
// (function () {

// Setup the audio, {data-note : audio}  (COME BACK TO FIX THIS)!!!!
const fretSounds = {
    0: new Audio("../sounds/E1.m4a"),
    1: new Audio("../sounds/F1.m4a"),
    2: new Audio("../sounds/FS1.m4a"),
    3: new Audio("../sounds/G1.m4a"),
    4: new Audio("../sounds/GS1.m4a"),
    5: new Audio("../sounds/A1.m4a"),
    6: new Audio("../sounds/AS1.m4a"),
    7: new Audio("../sounds/B1.m4a"),
    8: new Audio("../sounds/C1.m4a"),
    9: new Audio("../sounds/CS1.m4a"),
    10: new Audio("../sounds/D1.m4a"),
    11: new Audio("../sounds/DS1.m4a"),
    12: new Audio("../sounds/E2.m4a")
};

const root = document.documentElement;  // access css root vars
const fretboard = document.querySelector(".fretboard");
const fretNumbers = document.querySelector(".numbers");
const accidentalSelector = document.querySelector(".accidental-selector");
const fretNumInput = document.getElementById("fret-input");
const tuningSetting = document.querySelector(".tuning-setting");
const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const fretmarkDots = [3, 5, 7, 9, 15, 17, 19, 21];

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
let accidentals = "flats";
let tuning = [4, 11, 7, 2, 9, 4];  // high E -> low E

// ---------------------------------------------------------------------------------------------

/* ----------------------------- MAIN ------------------------------ */

const app = {
    init() {
        this.setupFretboard();
        this.setupEventListeners();
        handlers.setupTuningSection();
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

            for (let fret = 0; fret <= num_frets; fret++) {
                // Add the frets to the fretboard
                let note_fret = tools.createElement("div");
                note_fret.classList.add("note-fret");
                str.appendChild(note_fret);

                // Setup the tuning
                let note_name = tools.generateNoteNames((fret + tuning[i]), accidentals);
                note_fret.setAttribute("data-note", note_name);
                note_fret.setAttribute("octave", Math.floor());

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

    setupEventListeners() {
        fretboard.addEventListener("click", listeners.fretboardClick);
        accidentalSelector.addEventListener("click", listeners.selectAccidental);
    }
}

/* --------------------------- LISTENERS ---------------------------- */

const listeners = {
    fretboardClick(event) {
        if (event.target.classList.contains("note-fret")) {
            
            let string = event.target.parentElement.id;
            let note = event.target.getAttribute("data-note");
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
                noteSet[string] = [note, 0];
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
                tools.clearNotes();
                app.setupFretboard();  // reset the fretboard
            }
        } else {
            return;
        }
    }
}

/* --------------------------- HANDLERS ------------------------------ */

const handlers = {
    changeFretNumber(btn) {
        let id = btn.id;
        let min = fretNumInput.min;
        let max = fretNumInput.max;
        let val = fretNumInput.value;
        
        let direction = (id == "increment") ? 1 : -1
        let newVal = parseInt(val) + direction;
        if (newVal >= min && newVal <= max) {
            fretNumInput.setAttribute("value", newVal);
            num_frets = newVal;
            app.setupFretboard();
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

            str_tuning.onclick = function() {
                /* CLICK - (update tuning, rotating) */ 
                let pos = parseInt(this.getAttribute("value"), 10);
                let string_number = parseInt(this.getAttribute("id"), 10);

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
                    str_tuning.style.padding = "20px 14px 20px 14px";
                } else if (new_note == "F") {
                    str_tuning.style.padding = "20px 21px 20px 21px";
                } else {
                    str_tuning.style.padding = "20px";
                }

                this.innerHTML = new_note;
                this.setAttribute("value", pos);
                tuning[string_number - 1] = tunings[string_number][pos];
                tools.clearNotes();
                app.setupFretboard();
            }

            group.appendChild(str_tuning);
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

    reset() {
        tuning = [4, 11, 7, 2, 9, 4];
        Object.keys(noteSet).forEach(str => noteSet[str] = ["", 0]);
        num_frets = 12;
        fretNumInput.setAttribute("value", "12");
        app.setupFretboard();
        handlers.setupTuningSection();
        this.clearNotes();
    }
}

/* ---------------------------- AUDIO ------------------------------ */

const audio = {
    loadAudio() {
        window.onload = function() {
            for (const fret in fretSounds) {
                fretSounds[fret].load();  // Preload the audio file
            }
        };
    },

    playNote(fretNumber) {
        fretSounds[fretNumber].play();
    },

    playNotes() {
        this.playNote();
    }
}

app.init();

// })();
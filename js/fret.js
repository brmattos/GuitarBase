const root = document.documentElement;  // access css root vars

const fretboard = document.querySelector(".fretboard");
const fretNumbers = document.querySelector(".numbers");
const accidentalSelector = document.querySelector(".accidental-selector");

const max_frets = 22;
const num_frets = 12;
const num_strs = 6;

const fretmarkDots = [3, 5, 7, 9, 15, 17, 19, 21];
const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

let accidentals = "flats";
const tuning = [4, 11, 7, 2, 9, 4]  // ** indicies relative to notes flat/sharp arrays - default: EADGBE

// Setup the audio, {data-note : audio}  (COME BACK TO FIX THIS)!!!!
const fretSounds = {
    0: new Audio("./notes/E1.m4a"),
    1: new Audio("./notes/F1.m4a"),
    2: new Audio("./notes/FS1.m4a"),
    3: new Audio("./notes/G1.m4a"),
    4: new Audio("./notes/GS1.m4a"),
    5: new Audio("./notes/A1.m4a"),
    6: new Audio("./notes/AS1.m4a"),
    7: new Audio("./notes/B1.m4a"),
    8: new Audio("./notes/C1.m4a"),
    9: new Audio("./notes/CS1.m4a"),
    10: new Audio("./notes/D1.m4a"),
    11: new Audio("./notes/DS1.m4a"),
    12: new Audio("./notes/E2.m4a")
};

const app = {
    init() {
        this.setupFretboard();
        this.setupEventListeners();
        sounds.loadAudio();
    },

    setupFretboard() {
        /* Setup the fretboard (strings, frets, fretmarks) */

        fretboard.innerHTML = "";  // empty HTML before setup
        root.style.setProperty('--number-of-strings', num_strs);

        for (let i = 0; i < num_strs; i++) {
            // Add strings to the fretboard
            let str = tools.createElement('div');
            str.classList.add('string');
            fretboard.appendChild(str);

            for (let fret = 0; fret <= num_frets; fret++) {
                // Add the frets to the fretboard
                let note_fret = tools.createElement('div');
                note_fret.classList.add('note-fret');
                str.appendChild(note_fret);

                // Setup the tuning
                let note_name = this.generateNoteNames((fret + tuning[i]), accidentals);
                note_fret.setAttribute('data-note', note_name);

                if (i == 0 && fretmarkDots.indexOf(fret) !== -1) {
                    // Add the single fretmarks
                    note_fret.classList.add('single-fretmark');
                }

                if (i == 0 && fret == 12) {
                    // Add the double fretmarks
                    let double_fretmark = tools.createElement('div');
                    double_fretmark.classList.add('double-fretmark');
                    note_fret.appendChild(double_fretmark);
                }
            }
        }
    },

    generateNoteNames(index, accidentals) {
        /* Get the note at a given fret */
        index %= 12;
        if (accidentals === "flats") {
            return notesFlat[index];
        } else if (accidentals === "sharps") {
            return notesSharp[index];
        }
    },

    setupEventListeners() {
        fretboard.addEventListener("click", (event) => {
            if (event.target.classList.contains("note-fret")) {
                // Toggle the visibility by checking current opacity
                const currentOpacity = getComputedStyle(event.target).getPropertyValue("--noteOpacity");
                
                // Toggle between visible (opacity 1) and hidden (opacity 0)
                if (currentOpacity == 1) {
                    event.target.style.setProperty("--noteOpacity", 0);
                } else {
                    event.target.style.setProperty("--noteOpacity", 1);
                }
            }
        });

        accidentalSelector.addEventListener("click", (event) => {
            if (event.target.classList.contains("acc-selector")) {
                accidentals = event.target.value;
                console.log(accidentals);
                const allNotes = document.querySelectorAll(".note-fret");
                allNotes.forEach(note => {
                    // Hide all notes
                    note.style.setProperty("--noteOpacity", 0);
                });
                this.setupFretboard();  // reset the fretboard
            } else {
                return;
            }
        });
    }
}

const tools = {
    /* Creation tool methods */
    createElement(element, content) {
        element = document.createElement(element);
        if (arguments.length > 1) {
            // passed in content
            element.innerHTML = content;
        }
        return element;
    }
}

const handlers = {

}

const sounds = {
    loadAudio() {
        window.onload = function() {
            for (const fret in fretSounds) {
                fretSounds[fret].load();  // Preload the audio file
            }
        };
    },

    playFretSound(fretNumber) {
        fretSounds[fretNumber].play();
    }
}

app.init();
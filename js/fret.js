const root = document.documentElement;  // access css root vars

const fretboard = document.querySelector(".fretboard");
const fretNumbers = document.querySelector(".numbers");
const accidentalSelector = document.querySelector(".accidental-selector");
const fretNumInput = document.getElementById("fret-input");
const tuningGroup = document.querySelector(".tuning-group");

const fretmarkDots = [3, 5, 7, 9, 15, 17, 19, 21];
const notesFlat = ["E", "F", "Gb", "G", "Ab", "A", "Bb", "B", "C", "Db", "D", "Eb"];
const notesSharp = ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#"];

let allNotes = [];
for (let i = 0; i < 5; i++) {
    allNotes.push([i, ["E", "F", "Gb", "G", "Ab", "A", "Bb", "B", "C", "Db", "D", "Eb"]]);
}

let tunings = {
    /* Possible alternate tunings for each string (relative to flats/sharps arr positions) 
        - 1 up + 1 root + 4 down
    */
    // 1) E Eb D Db C F
    // 2) B Bb A Ab G C
    // 3) G Gb F E Eb Ab
    // 4) D Db C B Bb Eb
    // 5) A Ab G Gb F Bb
    // 6) E Eb D Db C F
    1: [0, 11, 10, 9, 8, 1],
    2: [7, 6, 5, 4, 2, 8],    
    3: [3, 2, 1, 11, 4],     
    4: [10, 9, 8, 7, 6, 11],  
    5: [5, 4, 3, 2, 1, 6],    
    6: [0, 11, 10, 9, 8, 1]   
}

// IMPORTANT VARS
let num_frets = 12;
let accidentals = "flats";
let tuning = [0, 7, 3, 10, 5, 0];  // high E -> low E

// ---------------------------------------------------------------------------------------------

// Setup the audio, {data-note : audio}  (COME BACK TO FIX THIS)!!!!
const fretSounds = {
    0: new Audio("./sounds/E1.m4a"),
    1: new Audio("./sounds/F1.m4a"),
    2: new Audio("./sounds/FS1.m4a"),
    3: new Audio("./sounds/G1.m4a"),
    4: new Audio("./sounds/GS1.m4a"),
    5: new Audio("./sounds/A1.m4a"),
    6: new Audio("./sounds/AS1.m4a"),
    7: new Audio("./sounds/B1.m4a"),
    8: new Audio("./sounds/C1.m4a"),
    9: new Audio("./sounds/CS1.m4a"),
    10: new Audio("./sounds/D1.m4a"),
    11: new Audio("./sounds/DS1.m4a"),
    12: new Audio("./sounds/E2.m4a")
};

const app = {
    init() {
        this.setupFretboard();
        this.setupEventListeners();
        handlers.createTuning();
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
                let note_name = this.generateNoteNames((fret + tuning[i]), accidentals);
                note_fret.setAttribute('data-note', note_name);

                // Setup the fret numbers
                if (i === 0) {
                    let num = tools.createElement("div", fret);
                    num.classList.add("fret-number");
                    fretNumbers.appendChild(num);
                }
                
                // Add the single fretmarks
                if (i == 0 && fretmarkDots.indexOf(fret) !== -1) {
                    note_fret.classList.add("single-fretmark");
                }

                // Add the double fretmarks
                if (i == 0 && fret == 12) {
                    let double_fretmark = tools.createElement("div");
                    double_fretmark.classList.add("double-fretmark");
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
                if (event.target.value !== accidentals) {
                    // Changed the button
                    accidentals = event.target.value;
                    tools.clearNotes();
                    this.setupFretboard();  // reset the fretboard
                }
            } else {
                return;
            }
        });
    }
}

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

    createTuning() {
        /* For the tuning section of the settings, create each individual select drop-down */
        tuningGroup.innerHTML = "";
        for (let i = 5; i >= 0; i--) {

            // Create the div for the column
            let group = tools.createElement("div");
            group.classList.add("setting-group");
            tuningGroup.appendChild(group);

            // Create the div for the respective note str
            // (start off at given tuning, EADGBE)
            let str_tuning;
            if (accidentals === "flats") {
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
                if (accidentals === "flats") {
                    new_note = notesFlat[tunings[string_number][pos]];
                } else {
                    new_note = notesSharp[tunings[string_number][pos]];
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

    clearNotes() {
        const allNotes = document.querySelectorAll(".note-fret");
            allNotes.forEach(note => {
                // Hide all notes
                note.style.setProperty("--noteOpacity", 0);
            });
    },

    reset() {
        tuning = [0, 7, 3, 10, 5, 0];
        num_frets = 12;
        fretNumInput.setAttribute("value", "12");
        app.setupFretboard();
        handlers.createTuning();
        this.clearNotes();
    },

    updateStringNote() {

    }
}

app.init();
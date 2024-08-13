const root = document.documentElement;  // access css root vars

const fretboard = document.querySelector('.fretboard');
const num_frets = 12;
const num_strs = 6;
const single_fretmark_positions = [3, 5, 7, 9, 15, 17, 19, 21];
const double_fretmark_positions = [12];

const app = {
    init() {
        this.setupFretboard();
    },

    setupFretboard() {

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

                
                if (i == 0 && single_fretmark_positions.indexOf(fret) !== -1) {
                    // Add the single fretmarks
                    note_fret.classList.add('single-fretmark');
                }

                if (i == 0 && double_fretmark_positions.indexOf(fret) != -1) {
                    // Add the double fretmarks
                    let double_fretmark = tools.createElement('div');
                    double_fretmark.classList.add('double-fretmark');
                    note_fret.appendChild(double_fretmark);
                }
            }
        }
    }
}

const tools = {
    // Creation tool methods
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
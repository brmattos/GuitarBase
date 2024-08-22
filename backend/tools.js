/*
File: tools.js
Description:
    backend for the tools page, implements the metronome
*/

import Timer from './timer.js';

(function () {

const tempo = document.querySelector(".tempo");
const tempoText = document.querySelector('.tempo-speed-text');
const decreaseTempoBtn = document.querySelector('.tempo-adjust.decrease');
const increaseTempoBtn = document.querySelector('.tempo-adjust.increase');
const tempoSlider = document.querySelector('.tempo-slider');
const startStopBtn = document.querySelector('.start-stop-btn');
const subBeats = document.querySelector('.measure-adjust.decrease');
const addBeats = document.querySelector('.measure-adjust.increase');
const measureCount = document.querySelector('.measure-count');

const click1 = new Audio("../sounds/click1.mp3");
const click2 = new Audio("../sounds/click2.mp3");

let count = 0;
let bpm = 140;
let measureBeats = 4;
let currRunning = false;
let currTempoText = "Steady";

const app = {
    init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
        decreaseTempoBtn.addEventListener("click", listeners.decreaseTempo);
        increaseTempoBtn.addEventListener("click", listeners.increaseTempo);
        tempoSlider.addEventListener("input", listeners.updateTempoSlider);
        subBeats.addEventListener("click", listeners.subMeasureBeats);
        addBeats.addEventListener("click", listeners.addMeasureBeats);
        startStopBtn.addEventListener("click", listeners.startStop);
    }
}

const listeners = {
    decreaseTempo(event) {
        if (bpm > 20) {
            bpm--;
            handlers.validateTempo();
            handlers.updateMetronome();
        }
    },
    increaseTempo(event) {
        if (bpm < 280) {
            bpm++;
            handlers.validateTempo();
            handlers.updateMetronome();
        }
    },
    updateTempoSlider(event) {
        bpm = tempoSlider.value;
        handlers.validateTempo();
        handlers.updateMetronome();
    },
    addMeasureBeats(event) {
        if (measureBeats < 12) {
            measureBeats++;
            measureCount.textContent = measureBeats;
            count = 0;
        }
    },
    subMeasureBeats(event) {
        if (measureBeats > 2) {
            measureBeats--;
            measureCount.textContent = measureBeats;
            count = 0;
        }
    },
    startStop(event) {
        count = 0;
        if (!currRunning) {
            metronome.start();
            currRunning = true;
            startStopBtn.textContent = "STOP";
        } else {
            metronome.stop();
            currRunning = false;
            startStopBtn.textContent = "START";
        }
    }
}

const handlers = {
    updateMetronome() {
        tempo.textContent = bpm;
        tempoSlider.value = bpm;
        metronome.timeInterval = 60000 / bpm;

        if (bpm <= 40) { currTempoText = "Super Slow" };
        if (bpm > 40 && bpm < 80) { currTempoText = "Slow" };
        if (bpm > 80 && bpm < 120) { currTempoText = "Getting there" };
        if (bpm > 120 && bpm < 180) { currTempoText = "Steady" };
        if (bpm > 180 && bpm < 220) { currTempoText = "Speeding up" };
        if (bpm > 220 && bpm < 240) { currTempoText = "Fast" };
        if (bpm > 240 && bpm < 260) { currTempoText = "Faster" };
        if (bpm > 260 && bpm <= 280) { currTempoText = "Super Fast" };
    
        tempoText.textContent = currTempoText;
    },

    validateTempo() {
        if (bpm <= 20) { return };
        if (bpm >= 280) { return };
    }
}

const audio = {
    playClick() {
        if (count === measureBeats) {
            count = 0;
        }
        if (count === 0) {
            click1.play();
            click1.currentTime = 0;
        } else {
            click2.play();
            click2.currentTime = 0;
        }
        count++;
    }
}

const metronome = new Timer(audio.playClick, 60000 / bpm, { immediate: true });
app.init();
})();
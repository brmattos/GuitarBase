# GuitarBase

<p align="center">
   <img src="https://github.com/user-attachments/assets/0053c91b-9def-4405-a604-cfcdebb3c063" alt="Home Page" width="850" height="480">
</p>
<p align="center">
   https://guitarbase.netlify.app/
</p>

---

## Overview
This project implements a full-stack web application for guitar players, featuring an interactive, playable fret-board, a personalized learning progress tracking & song library database system, accompanied with a range of tools to enhance and centralize the learning experience. The app lerverages Firebase authentication with Google, and integrates a Cloud Firestore database for
users to manage and come back to their own personal library to keep track of the songs they have learned and what they wish to learn in the future. This enables seamless management of personal library entries, along with user-specific preferences. As reflected in the file system and README of this repo, this project's current implementation utilizes vanilla `javascript` with HTML and CSS. I am currently in the progress of working on translating the project into the `React` frontend framework with a `Next.js` and `Node.js` backend to enhance the application's frontend, backend, and authentication to be more modernized and clean. 

## Project Structure
Below is the file structure of the project:
- `index.html`, `index.css`, `index.js`: main files for the homepage - root of the project
- `backend`: folder with all javascript files for the project - js for all the individual pages that need it, as well as for the user-authentication
- `pages`: folder with all html pages for the project, stemming from `index.html`
- `styles`: folder with css files for all page and component styles
- `images`: folder with all images for the project as well as the favicon
- `sounds`: folder with all sounds for the project, including all of the fretboard notes, as well as the metronome clicks

---


# Features

## Library
Essentially, the goal of this feature is to minimize the often daunting tutorial hell that many learners face, making it feel very easy to just pick up an play - pick up an learn:

<p align="center">
   <img src="https://github.com/user-attachments/assets/9cf3b212-4f8a-417b-8a88-8a93eb9f420e" alt="Library Page" width="800" height="480">
</p>

- Settings: Employs interactive elements and features such as favorite status toggles, learning status updates, and auto-generated external tab links to promote time-efficiency & organization.
- Customization: Search and sort features for a personal, comprehensive, and smooth user experience - limiting the amount of sifting through and opening new tabs, or managing your own spreadsheets in order to find what your are looking for
- Benefit: Keeping track of the status of a song, whether you have learned it, want to learn it, or are in progress of doing so, leaves a great push to keep learning, as well as a rewarding feeling when the library is comprised of green "learned" status tags. 

## Fretboard
Curious about what a few notes sound like strung together or just want to mess around in a guitar sandbox?

<p align="center">
   <img src="https://github.com/user-attachments/assets/607a72c8-7b27-45e7-adc6-1a454488ee85" alt="Fretboard Page" width="850" height="380">
</p>

- Dynamic Fretboard: Customize the number of frets on the fretboard, allowing users to choose between different fret configurations for various playing styles.
- Custom Tunings: Easily switch between standard and alternate tunings for each string with just a click, providing flexibility for exploring different sounds and techniques.
- Accidental Selection: Toggle between sharp and flat notes on the fretboard to match your preferred notation style, ensuring that the notes displayed align with your playing needs.
- Interactive Note Selection: Click on individual frets to select or deselect notes, with visual feedback showing which notes are currently selected. Perfect for learning scales, chords, or specific note patterns.
- Play Notes & Chords: Hear the notes and chords you’ve selected on the fretboard by simply clicking the play button or pressing the spacebar. Notes are played in sequence, mimicking the sound of strumming or picking.
- Reset and Quick Navigation: Quickly reset the fretboard to its default settings or use keyboard shortcuts to navigate and play notes, enhancing usability and learning efficiency.
- Octave Awareness: The fretboard intelligently tracks octave changes across strings, ensuring that notes are accurately represented for the correct pitch.

## Tools
This fully functional metronome allows users to adjust the tempo, change the number of beats per measure, and start or stop the metronome with responsive controls.

<p align="center">
   <img src="https://github.com/user-attachments/assets/e10f2330-6040-402c-801e-cdb1fb90ebc0" alt="Tools Page" width="450" height="450">

</p>

- Tempo Adjustment: Users can increase or decrease the tempo within a range of 20 to 280 BPM. The tempo is also synchronized with a slider for easy adjustment.
- Measure Beats Control: The metronome supports 2 to 12 beats per measure, with visual feedback displaying the current number of beats.
- Start/Stop Functionality: The metronome can be easily started or stopped with a single button, providing real-time tempo feedback.
- Audio Feedback: The metronome plays distinct audio clicks to indicate the first beat of each measure and the subsequent beats, enhancing the user experience by providing clear auditory cues.
- Modular Design: The metronome's functionality is powered by a Timer class defined in timer.js, which handles precise timing and drift correction to ensure accurate tempo playback.

---

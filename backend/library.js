/*
File: library.js
Description:
    the backend for the library page, database for tracking 
    songs that the user is learning / wants to learn
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
import { userSignIn } from "./auth.js";


// DATABASE SETUP
// const appSettings = {
//     databaseURL: "https://guitarbase-3d851-default-rtdb.firebaseio.com/"
// }
// const app = initializeApp(appSettings);
// const database = getDatabase(app);
// const entriesInDB = ref(database, "songs");

// Listeners ...
const signBtn = document.querySelector(".sign-in");
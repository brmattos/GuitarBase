import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCnJvrnNtfh5kaiok6g1GPATjNfhtPEkCU",
  authDomain: "guitarbase-3d851.firebaseapp.com",
  projectId: "guitarbase-3d851",
  storageBucket: "guitarbase-3d851.appspot.com",
  messagingSenderId: "732121041360",
  appId: "1:732121041360:web:9924156d39f35533c891d5",
  measurementId: "G-DGW1V697W0"
};

export const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

const auth = getAuth();
const provider = new GoogleAuthProvider();
const signBtn = document.querySelector(".sign-in");

let signedIn = true;

export const userSignIn = async() => {
    signInWithPopup(auth, provider).then((result) => {
        const user = result.user;
        // console.log("Signed in");
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    })
}

const userSignOut = async() => {
    signOut(auth).then(() => {
        // console.log("Signed out");
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    })
}

const signChange = async() => {
    if (!signedIn) {
        userSignIn();
    } else {
        userSignOut();
    }
}

// always check if signed in/out state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Signed in
        signBtn.innerHTML = "SIGN OUT";
        signBtn.style.setProperty("margin-right", "20px");
        signedIn = true;
    } else {
        // Signed out
        signBtn.innerHTML = "SIGN IN";
        signBtn.style.setProperty("margin-right", "30px");
        signedIn = false;
    }
});

signBtn.addEventListener("click", signChange);
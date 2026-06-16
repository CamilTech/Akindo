import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDUZOiCF9cPPS_1riUA3CZ7dyen0C56VzU",
    authDomain: "projetopw2.firebaseapp.com",
    projectId: "projetopw2",
    storageBucket: "projetopw2.firebasestorage.app",
    messagingSenderId: "4480386861",
    appId: "1:4480386861:web:663be9a1cb4f95bca435a4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

document.getElementById("loginGoogle").addEventListener("click", async (event) => {

    try {

        event.preventDefault();

        const result = await signInWithPopup(auth, provider);

        const user = result.user;

        localStorage.setItem("nome", user.displayName);
        localStorage.setItem("foto", user.photoURL);

        window.location.href = "../../pagina-inicial.html";

    } catch (error) {
        console.error(error);
    }
});


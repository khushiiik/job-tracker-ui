// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBc_JRIjhZinTB2QY_YiEJFSO0O0Dl6Y64",
  authDomain: "jobtracker-995a4.firebaseapp.com",
  projectId: "jobtracker-995a4",
  storageBucket: "jobtracker-995a4.firebasestorage.app",
  messagingSenderId: "108615657910",
  appId: "1:108615657910:web:3edd79e785b43687713917",
  measurementId: "G-XJPYQHRNY5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Common signup handler
function setupSignupHandler(formId, nameId, emailId, passwordId, confirmId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById(nameId).value.trim();
    const email = document.getElementById(emailId).value.trim();
    const password = document.getElementById(passwordId).value;
    const confirmPassword = document.getElementById(confirmId).value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        createdAt: new Date(),
      });

      alert("Sign up successful!");
      window.location.href = "deshbord.html";
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message);
    }
  });
}

// Hook both forms
setupSignupHandler("signupForm", "name", "email", "password", "confirmPassword");
setupSignupHandler("signupFormDesktop", "name-d", "email-d", "password-d", "confirmPassword-d");
// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBc_JRIjhZinTB2QY_YiEJFSO0O0Dl6Y64",
  authDomain: "jobtracker-995a4.firebaseapp.com",
  projectId: "jobtracker-995a4",
  storageBucket: "jobtracker-995a4.firebasestorage.app",
  messagingSenderId: "108615657910",
  appId: "1:108615657910:web:3edd79e785b43687713917",
  measurementId: "G-XJPYQHRNY5"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Signup Logic
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

      const avatar = localStorage.getItem("selectedAvatar") || "";

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        avatar,
        createdAt: new Date(),
      });

alert("Sign up successful! Please select an avatar.");
sessionStorage.setItem("loggedInUser", JSON.stringify({
  uid: user.uid,
  name,
  email,
  avatar
}));
window.location.href = "avatar.html";

    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message);
    }
  });
}

setupSignupHandler("signupForm", "name", "email", "password", "confirmPassword");
setupSignupHandler("signupFormDesktop", "name-d", "email-d", "password-d", "confirmPassword-d");

// ✅ Login Logic (no localStorage, only Firestore)
function setupLoginHandler(formId, emailId, passwordId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById(emailId).value.trim();
    const password = document.getElementById(passwordId).value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Get user data from Firestore
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        sessionStorage.setItem("loggedInUser", JSON.stringify(userData)); // ✅ Save full user data (for dashboard use)
      }

      alert("Login successful!");
      window.location.href = "deshbord.html";
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    }
  });
}

setupLoginHandler("loginForm", "email", "password");
setupLoginHandler("loginFormDesktop", "email-d", "password-d");

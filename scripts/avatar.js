import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
  import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

  // Your Firebase Config
  const firebaseConfig = {
    apiKey: "AIzaSyBc_JRIjhZinTB2QY_YiEJFSO0O0Dl6Y64",
    authDomain: "jobtracker-995a4.firebaseapp.com",
    projectId: "jobtracker-995a4",
    storageBucket: "jobtracker-995a4.firebasestorage.app",
    messagingSenderId: "108615657910",
    appId: "1:108615657910:web:3edd79e785b43687713917",
    measurementId: "G-XJPYQHRNY5"
  };

  // Init Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  // ✅ Handle avatar selection & Firestore update
  document.addEventListener("DOMContentLoaded", () => {
    const avatars = document.querySelectorAll(".avatar-option");
    const nextBtn = document.querySelector(".doodle-btn");

    let selectedAvatar = "";

    avatars.forEach(avatar => {
      avatar.addEventListener("click", () => {
        avatars.forEach(a => a.classList.remove("selected"));
        avatar.classList.add("selected");
        selectedAvatar = avatar.getAttribute("src");
      });
    });

    nextBtn.addEventListener("click", async () => {
      if (!selectedAvatar) {
        alert("Please select an avatar first!");
        return;
      }

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userRef = doc(db, "users", user.uid);

          try {
            // ✅ Update avatar in Firestore
            await updateDoc(userRef, { avatar: selectedAvatar });

            // ✅ Update sessionStorage for current session use
            const userData = JSON.parse(sessionStorage.getItem("loggedInUser")) || {};
            userData.avatar = selectedAvatar;
            sessionStorage.setItem("loggedInUser", JSON.stringify(userData));

            // ✅ Redirect to dashboard
            window.location.href = "deshbord.html";
          } catch (err) {
            console.error("Failed to update avatar in Firestore:", err);
            alert("Something went wrong while saving your avatar.");
          }
        } else {
          alert("User not logged in.");
          window.location.href = "login.html";
        }
      });
    });
  });
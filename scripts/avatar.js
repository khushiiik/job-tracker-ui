// Firebase Imports
import { app } from "./firebase_init.js"; // ✅ This brings the initialized app
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Init Auth and Firestore
const db = getFirestore(app);
const auth = getAuth();

const currentUser = auth.currentUser;
if (!currentUser || currentUser.uid !== user.uid) {
  alert("Session mismatch. Please log in again.");
  return;
}
document.addEventListener("DOMContentLoaded", () => {
  const avatarImgs = document.querySelectorAll(".avatar-option");
  const nextBtn = document.getElementById("nextBtn");
  const doneBtn = document.getElementById("doneBtn");

  //  Get context: "signup" or "profile"
  const avatarFrom = sessionStorage.getItem("avatarFrom") || "profile";

  // Show proper button
  if (avatarFrom === "signup") {
    nextBtn.classList.remove("hidden");
  } else {
    doneBtn.classList.remove("hidden");
  }

  //  Handle avatar selection
  avatarImgs.forEach(img => {
    img.addEventListener("click", () => {
      avatarImgs.forEach(i => i.classList.remove("selected"));
      img.classList.add("selected");
      img.previousElementSibling.checked = true;
    });
  });

  // Shared avatar saving function
  async function saveAvatar() {
    const selected = document.querySelector("input[name='avatar']:checked");
    if (!selected) {
      alert("Please select an avatar.");
      return;
    }

    const avatarUrl = selected.value;
    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (!user || !user.uid) {
      alert("User session not found. Please log in again.");
      window.location.href = "login.html";
      return;
    }

    try {
      // Only update Firestore if user is from "profile"
      if (avatarFrom === "profile") {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { avatar: avatarUrl });
      }

      user.avatar = avatarUrl;
      sessionStorage.setItem("loggedInUser", JSON.stringify(user));
      localStorage.setItem("selectedAvatar", avatarUrl);

      if (avatarFrom === "profile") {
        alert("Avatar updated successfully!");
      }

      sessionStorage.setItem("avatarFrom", "profile");
      window.location.href = "deshbord.html";
    } catch (error) {
      console.error("Failed to save avatar:", error);
      alert("Failed to save avatar. Please try again.");
    }
  }

  // Events for both buttons
  document.getElementById("avatarForm").addEventListener("submit", (e) => {
    e.preventDefault();
    saveAvatar();
  });

  doneBtn.addEventListener("click", () => {
    saveAvatar();
  });
});

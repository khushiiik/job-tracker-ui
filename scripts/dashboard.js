document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("loggedInUser")) || {};

  // Avatar & name/email
  const avatarImg = document.getElementById("userAvatar");
  const emailSpan = document.getElementById("userEmail");
  const welcomeUser = document.getElementById("welcomeUser");

  avatarImg.src = user.avatar || "images/default_avatar.svg";
  emailSpan.textContent = user.email || "No email found";
  if (user.name) {
    welcomeUser.innerHTML = `Welcome, ${user.name}! 👋`;
  }

  // Dropdown toggle
  const avatarBtn = document.getElementById("avatarBtn");
  const profileDropdown = document.getElementById("profileDropdown");

  avatarBtn?.addEventListener("click", () => {
    profileDropdown?.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!avatarBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
      profileDropdown.classList.add("hidden");
    }
  });

  // Logout
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  });

  // Add Job auth check
  window.handleAddJob = () => {
    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (!user) {
      alert("Please log in to add a new job.");
      window.location.href = "login.html";
    } else {
      window.location.href = "add_job.html";
    }
  };

  // Sidebar drag
  const sidebarToggle = document.getElementById("sidebarToggle");
  let isDragging = false;

  sidebarToggle?.addEventListener("mousedown", (e) => {
    isDragging = true;
    document.body.style.userSelect = "none";

    const shiftX = e.clientX - sidebarToggle.getBoundingClientRect().left;
    const shiftY = e.clientY - sidebarToggle.getBoundingClientRect().top;

    const moveAt = (pageX, pageY) => {
      const btnWidth = sidebarToggle.offsetWidth;
      const btnHeight = sidebarToggle.offsetHeight;
      const maxX = window.innerWidth - btnWidth;
      const maxY = window.innerHeight - btnHeight;

      const x = Math.min(Math.max(0, pageX - shiftX), maxX);
      const y = Math.min(Math.max(0, pageY - shiftY), maxY);

      sidebarToggle.style.left = `${x}px`;
      sidebarToggle.style.top = `${y}px`;
    };

    const onMouseMove = (e) => {
      if (isDragging) moveAt(e.pageX, e.pageY);
    };

    document.addEventListener("mousemove", onMouseMove);

    sidebarToggle.onmouseup = () => {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      sidebarToggle.onmouseup = null;
      document.body.style.userSelect = "auto";
    };
  });

  sidebarToggle?.ondragstart = () => false;

  // Sidebar toggle
  window.toggleSidebar = () => {
    const sidebar = document.getElementById("mobileSidebar");
    const mobilelogo = document.getElementById("mobilelogo");
    sidebar?.classList.toggle("hidden");
    if (window.innerWidth < 768) {
      mobilelogo?.classList.toggle("hidden");
    }
  };
});

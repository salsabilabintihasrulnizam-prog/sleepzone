// =========================
// LOAD PROFILE (localStorage ONLY)
// =========================

let name = localStorage.getItem("name") || "";
let age = Number(localStorage.getItem("age")) || "";
let avatar = localStorage.getItem("avatar") || "🌙";

// display
document.getElementById("displayName").innerText = name;
document.getElementById("displayAge").innerText = age;
document.getElementById("profileAvatar").innerText = avatar;

// input prefill
document.getElementById("nameInput").value = name;
document.getElementById("ageInput").value = age;


// =========================
// RECOMMENDED SLEEP
// =========================

function getRecommendedSleep(age) {

    if (age <= 12) return "9-12 Hours";
    if (age <= 17) return "8-11 Hours";
    if (age <= 64) return "7-9 Hours";
    return "7-8 Hours";
}

document.getElementById("recommendedSleep").innerText =
    age ? getRecommendedSleep(age) : "-";


// =========================
// SAVE PROFILE
// =========================

document.getElementById("profileForm").addEventListener("submit", (e) => {

    e.preventDefault();

    const newName = document.getElementById("nameInput").value.trim();
    const newAge = Number(document.getElementById("ageInput").value);

    localStorage.setItem("name", newName);
    localStorage.setItem("age", newAge);

    // refresh UI
    document.getElementById("displayName").innerText = newName;
    document.getElementById("displayAge").innerText = newAge;
    document.getElementById("recommendedSleep").innerText =
        getRecommendedSleep(newAge);

    alert("Profile updated!");
});

// =========================================
// MOBILE DROPDOWN TOGGLE
// =========================================

const profileIcon     = document.querySelector('.profile-icon');
const profileDropdown = document.querySelector('.profile-dropdown');

profileIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('dropdown-open');
});

document.addEventListener('click', () => {
    profileDropdown.classList.remove('dropdown-open');
});

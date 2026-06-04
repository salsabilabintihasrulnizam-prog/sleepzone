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

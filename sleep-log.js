/* =========================================
   DATE LIMIT
========================================= */

const today = new Date().toISOString().split("T")[0];

document.getElementById("sleepDate").setAttribute("max", today);


/* =========================================
   OPTION BUTTONS
========================================= */

const optionButtons = document.querySelectorAll(".option-btn");

let sleepData = {
    quality: "",
    mood: "",
    screen: "",
    caffeine: "",
    exercise: ""
};

optionButtons.forEach(button => {
    button.addEventListener("click", () => {
        const group = button.dataset.group;

        document
            .querySelectorAll(`[data-group="${group}"]`)
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        sleepData[group] = button.innerText;
    });
});


/* =========================================
   SAVE LOG
========================================= */

document
    .getElementById("sleepLogForm")
    .addEventListener("submit", function(e) {

        e.preventDefault();

        const log = {
            date:               document.getElementById("sleepDate").value,
            sleepTime:          document.getElementById("sleepTime").value,
            wakeTime:           document.getElementById("wakeTime").value,
            quality:            document.getElementById("qualitySlider").value,
            mood:               document.getElementById("moodSlider").value,
            screenTimeBeforeBed: sleepData.screen,
            caffeineIntake:     sleepData.caffeine,
            sleepOnset:         document.getElementById("sleepOnset").value,
            exerciseLevel:      sleepData.exercise,
            napDuration:        document.getElementById("napDuration").value,
            notes:              document.getElementById("notes").value
        };

let logs = JSON.parse(localStorage.getItem("sleepLogs")) || [];

// Check if same date already exists
const existingIndex = logs.findIndex(
    item => item.date === log.date
);

if (existingIndex !== -1) {

    const overwrite = confirm(
        "A sleep log already exists for this date. Replace it?"
    );

    if (!overwrite) {
        return;
    }

    logs[existingIndex] = log;

    alert("Sleep log saved successfully! Check sleep history to view your sleep records and insight ");

} else {

    logs.push(log);

    alert("Sleep log saved successfully! Check sleep history to view your sleep records and insight ");
}

localStorage.setItem(
    "sleepLogs",
    JSON.stringify(logs)
);



        document.getElementById("sleepLogForm").reset();

        document
            .querySelectorAll(".option-btn")
            .forEach(btn => btn.classList.remove("active"));
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

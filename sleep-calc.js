// =========================
// AGE RECOMMENDATION
// =========================

const age = Number(localStorage.getItem("age")) || 18;

let recommendedRange = "";
let ageGroup = "";

if (age <= 13) {
    recommendedRange = "8–10 Hours";
    ageGroup = "Teenagers(13 years)";
}
else if (age <= 17) {
    recommendedRange = "8–10 Hours";
    ageGroup = "Teenagers (14–17 years)";
}
else if (age <= 64) {
    recommendedRange = "7–9 Hours";
    ageGroup = "Adults (18–64 years)";
}
else {
    recommendedRange = "7–8 Hours";
    ageGroup = "Older Adults (65+ years)";
}

document.getElementById("recommendedSleep").innerText =
    recommendedRange;

document.getElementById("ageGroup").innerText =
    ageGroup;


// =========================
// MODE
// =========================

let mode = "bed";

const bedBtn = document.getElementById("bedBtn");
const wakeBtn = document.getElementById("wakeBtn");

bedBtn.onclick = () => {

    mode = "bed";

    bedBtn.classList.add("active");
    wakeBtn.classList.remove("active");

    document.getElementById("timeLabel").innerText =
        "Sleep Time";
};

wakeBtn.onclick = () => {

    mode = "wake";

    wakeBtn.classList.add("active");
    bedBtn.classList.remove("active");

    document.getElementById("timeLabel").innerText =
        "Wake Up Time";
};


// =========================
// FORMAT TIME (AM/PM)
// =========================

function formatTime(date) {

    let hours = date.getHours();
    let minutes = date.getMinutes();

    const ampm =
        hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    if (hours === 0) {
        hours = 12;
    }

    return `${hours}:${String(minutes).padStart(2, "0")} ${ampm}`;
}


// =========================
// SLEEP OPTIONS
// =========================

const sleepOptions = [
    7,
    7.5,
    8,
    8.5,
    9
];


// =========================
// CALCULATE
// =========================

document.getElementById("calculateBtn").onclick = () => {

    const input =
        document.getElementById("timeInput").value;

    if (!input) {

        document.getElementById("resultTable").innerHTML = "";

        document.getElementById("adviceText").innerText =
            "Please select a time first.";

        return;
    }

    let [hours, minutes] =
        input.split(":").map(Number);

    let tableHTML = `
        <table class="result-table">
            <tr>
                <th>Sleep Duration</th>
                <th>${mode === "bed"
                    ? "Wake Up Time"
                    : "Sleep Time"
                }</th>
            </tr>
    `;

    sleepOptions.forEach(duration => {

        let date = new Date();

        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);

        const adjustment =
            duration * 60;

        if (mode === "bed") {

            date.setMinutes(
                date.getMinutes() + adjustment
            );
        }
        else {

            date.setMinutes(
                date.getMinutes() - adjustment
            );
        }

        tableHTML += `
            <tr>
                <td>${duration} Hours</td>
                <td>${formatTime(date)}</td>
            </tr>
        `;
    });

    tableHTML += `</table>`;

    document.getElementById(
        "resultTable"
    ).innerHTML = tableHTML;


    // =========================
    // ADVICE
    // =========================

    if (mode === "bed") {

        document.getElementById(
            "resultTitle"
        ).innerText =
            "Wake Up Recommendations";

        document.getElementById(
            "adviceText"
        ).innerHTML = `
            Most adults perform best with 7–9 hours of sleep.
            If you're studying, working long hours, or feeling tired,
            choosing 8–9 hours may help improve focus, memory,
            and overall recovery.
        `;
    }
    else {

        document.getElementById(
            "resultTitle"
        ).innerText =
            "Bedtime Recommendations";

        document.getElementById(
            "adviceText"
        ).innerHTML = `
            Keeping a consistent bedtime and wake-up time can improve
            sleep quality. Try avoiding screens, caffeine,
            and heavy meals 1–2 hours before sleeping.
        `;
    }
};
// =========================================
// GET USER NAME
// =========================================

let name = localStorage.getItem("name");

if (!name) {
    name = "Dreamer";
}

document.getElementById("welcomeText").innerText = "Welcome , " + name;


// =========================================
// GET SLEEP LOGS
// =========================================

let sleepLogs = JSON.parse(localStorage.getItem("sleepLogs")) || [];


// =========================================
// ELEMENTS
// =========================================

const emptyState       = document.getElementById("emptyState");
const dashboardContent = document.getElementById("dashboardContent");
const averageSleep     = document.getElementById("averageSleep");
const sleepScore       = document.getElementById("sleepScore");
const chartBars        = document.getElementById("chartBars");


// =========================================
// EMPTY STATE CHECK
// =========================================

if (sleepLogs.length === 0) {
    emptyState.style.display = "flex";
    dashboardContent.style.display = "none";
} else {
    emptyState.style.display = "none";
    dashboardContent.style.display = "block";
    loadDashboard();
}


// =========================================
// GO TO SLEEP LOG PAGE
// =========================================

function goToSleepLog() {
    window.location.href = "sleep-log.html";
}


// =========================================
// CALCULATE SLEEP HOURS
// =========================================

function getSleepHours(start, end) {
    let sleep = new Date("2026-01-01 " + start);
    let wake  = new Date("2026-01-01 " + end);

    if (wake < sleep) {
        wake.setDate(wake.getDate() + 1);
    }

    return (wake - sleep) / (1000 * 60 * 60);
}


// =========================================
// LOAD DASHBOARD DATA
// =========================================

function loadDashboard() {

    // SORT BY DATE
    sleepLogs.sort((a, b) => new Date(a.date) - new Date(b.date));

    // LAST 7 DAYS
    let recentLogs = sleepLogs.slice(-7);


    // =========================
    // AVERAGE SLEEP
    // =========================

    let totalHours = 0;

    recentLogs.forEach(log => {
        totalHours += getSleepHours(log.sleepTime, log.wakeTime);
    });

    let avgHours = totalHours / recentLogs.length;
    let hours    = Math.floor(avgHours);
    let minutes  = Math.round((avgHours - hours) * 60);

    averageSleep.innerText = `${hours}h ${minutes}m`;


    // =========================
    // DONUT CHART
    // =========================

    let totalQuality = 0;
    let totalMood    = 0;
    let excellent    = 0;
    let average      = 0;
    let poor         = 0;

    recentLogs.forEach(log => {
        let quality = Number(log.quality);
        let mood    = Number(log.mood);

        totalQuality += quality;
        totalMood    += mood;

        // FINAL SCORE
        let finalScore = ((quality + mood) / 10) * 100;

        // CATEGORY
        if (finalScore >= 80) {
            excellent++;
        } else if (finalScore >= 60) {
            average++;
        } else {
            poor++;
        }
    });

    // AVERAGE SCORE
    let avgScore = Math.round(
        ((totalQuality + totalMood) / (recentLogs.length * 10)) * 100
    );

    // DISPLAY SCORE
    sleepScore.innerText = avgScore;

    // DISPLAY COUNTS
    document.getElementById("excellentCount").innerText = excellent;
    document.getElementById("averageCount").innerText   = average;
    document.getElementById("poorCount").innerText      = poor;

    let total      = excellent + average + poor;
    let exPercent  = (excellent / total) * 100;
    let avgPercent = ((excellent + average) / total) * 100;

    document.documentElement.style.setProperty("--exEnd",  exPercent  + "%");
    document.documentElement.style.setProperty("--avgEnd", avgPercent + "%");


    // =========================
    // 7 DAY CHART
    // =========================

    const chartDates = document.getElementById("chartDates");
    chartDates.innerHTML = "";
    chartBars.innerHTML  = "";

    let today = new Date();

    for (let i = 6; i >= 0; i--) {
        let currentDate = new Date();
        currentDate.setDate(today.getDate() - i);

        let formattedDate = currentDate.toISOString().split("T")[0];

        // FIND LOG FOR THIS DAY
        let log = sleepLogs.find(item => item.date === formattedDate);

        let sleepHours = 0;

        if (log) {
            sleepHours = getSleepHours(log.sleepTime, log.wakeTime);
        }

        let height = (sleepHours / 12) * 100;
let labelDate = new Date(currentDate);
labelDate.setDate(labelDate.getDate() - 1);

let day   = labelDate.getDate();
let month = labelDate.getMonth() + 1;

        chartBars.innerHTML += `
    <div class="bar-group">
        <div class="bar" style="height:${height}%"></div>
    </div>
`;

        chartDates.innerHTML += `
    <span>${day}/${month}</span>
`;
    }
}
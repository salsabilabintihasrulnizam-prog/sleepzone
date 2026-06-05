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

    sleepLogs.sort((a, b) => new Date(a.date) - new Date(b.date));

    let recentLogs = sleepLogs.slice(-7);

    // AVERAGE SLEEP
    let totalHours = 0;
    recentLogs.forEach(log => {
        totalHours += getSleepHours(log.sleepTime, log.wakeTime);
    });

    let avgHours = totalHours / recentLogs.length;
    let hours    = Math.floor(avgHours);
    let minutes  = Math.round((avgHours - hours) * 60);
    averageSleep.innerText = `${hours}h ${minutes}m`;

    // DONUT CHART
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
        let finalScore = ((quality + mood) / 10) * 100;
        if (finalScore >= 80) {
            excellent++;
        } else if (finalScore >= 60) {
            average++;
        } else {
            poor++;
        }
    });

    let avgScore = Math.round(
        ((totalQuality + totalMood) / (recentLogs.length * 10)) * 100
    );

    sleepScore.innerText = avgScore;
    document.getElementById("excellentCount").innerText = excellent;
    document.getElementById("averageCount").innerText   = average;
    document.getElementById("poorCount").innerText      = poor;

    let total      = excellent + average + poor;
    let exPercent  = (excellent / total) * 100;
    let avgPercent = ((excellent + average) / total) * 100;

    document.documentElement.style.setProperty("--exEnd",  exPercent  + "%");
    document.documentElement.style.setProperty("--avgEnd", avgPercent + "%");

    // 7 DAY CHART
    const chartDates = document.getElementById("chartDates");
    chartDates.innerHTML = "";
    chartBars.innerHTML  = "";

    let today = new Date();

    for (let i = 6; i >= 0; i--) {
        let currentDate = new Date();
        currentDate.setDate(today.getDate() - i);

        let formattedDate = currentDate.toISOString().split("T")[0];
        let log           = sleepLogs.find(item => item.date === formattedDate);
        let sleepHours    = 0;

        if (log) {
            sleepHours = getSleepHours(log.sleepTime, log.wakeTime);
        }

        let height    = (sleepHours / 12) * 100;
        let labelDate = new Date(currentDate);
        labelDate.setDate(labelDate.getDate() - 1);

        let day   = labelDate.getDate();
        let month = labelDate.getMonth() + 1;

        chartBars.innerHTML += `
            <div class="bar-group">
                <div class="bar" style="height:${height}%"></div>
            </div>
        `;

        chartDates.innerHTML += `<span>${day}/${month}</span>`;
    }

    // LOAD GOALS
    loadGoals();
}


// =========================================
// DAILY GOALS
// =========================================

function loadGoals() {

    let goalDate = new Date().toISOString().split("T")[0];
    let todayLog = sleepLogs.find(l => l.date === goalDate);

    if (!todayLog) return;

    let doneSleep    = false;
    let doneWake     = false;
    let doneDuration = false;
    let doneExercise = false;

    // SLEEP TIME
    let sleepTime = todayLog.sleepTime;
    let sleepH    = parseInt(sleepTime.split(":")[0]);
    let sleepM    = parseInt(sleepTime.split(":")[1]);
    let ampm      = sleepH >= 12 ? "PM" : "AM";
    let display12 = sleepH % 12 || 12;

    document.getElementById("sleepTimeDisplay").innerText =
        `${display12}:${String(sleepM).padStart(2,"0")} ${ampm}`;

    doneSleep = (sleepH >= 21 && sleepH <= 23);

    let sleepAngle = ((sleepH % 12) + sleepM / 60) / 12 * 360;
    rotateClock("clockHandSleep", "clockRingSleep", sleepAngle, doneSleep);

    if (doneSleep) {
        document.getElementById("goalSleep").classList.add("done");
        document.getElementById("checkSleep").classList.add("done");
        document.getElementById("checkSleep").innerText = "✓";
    }

    // WAKE TIME
    let wakeTime      = todayLog.wakeTime;
    let wakeH         = parseInt(wakeTime.split(":")[0]);
    let wakeM         = parseInt(wakeTime.split(":")[1]);
    let wakeAmpm      = wakeH >= 12 ? "PM" : "AM";
    let wakeDisplay12 = wakeH % 12 || 12;

    document.getElementById("wakeTimeDisplay").innerText =
        `${wakeDisplay12}:${String(wakeM).padStart(2,"0")} ${wakeAmpm}`;

    doneWake = (wakeH >= 5 && wakeH <= 11);

    let wakeAngle = ((wakeH % 12) + wakeM / 60) / 12 * 360;
    rotateClock("clockHandWake", "clockRingWake", wakeAngle, doneWake);

    if (doneWake) {
        document.getElementById("goalWake").classList.add("done");
        document.getElementById("checkWake").classList.add("done");
        document.getElementById("checkWake").innerText = "✓";
    }

    // SLEEP DURATION
    let hours  = getSleepHours(todayLog.sleepTime, todayLog.wakeTime);
    let h      = Math.floor(hours);
    let m      = Math.round((hours - h) * 60);

    document.getElementById("durationDisplay").innerText = `${h}h ${m}m`;

    let barPct  = Math.min((hours / 12) * 100, 100);
    let barEl   = document.getElementById("durationBar");
    let warnEl  = document.getElementById("durationWarning");
    let goalDur = document.getElementById("goalDuration");

    barEl.style.width = barPct + "%";

    if (hours < 3) {
        barEl.style.background = "#ef4444";
        warnEl.innerText       = "⚠ Critical — under 3h";
        warnEl.style.color     = "#ef4444";
        document.getElementById("durationDisplay").style.color = "#ef4444";
    } else if (hours < 5) {
        barEl.style.background = "#f59e0b";
        warnEl.innerText       = "⚠ Low — under 5h";
        warnEl.style.color     = "#f59e0b";
        document.getElementById("durationDisplay").style.color = "#f59e0b";
    } else {
        barEl.style.background = "#22c55e";
        warnEl.innerText       = "✓ On target";
        warnEl.style.color     = "#4ade80";
        document.getElementById("durationDisplay").style.color = "#4ade80";
        doneDuration = true;
        goalDur.classList.add("done");
        document.getElementById("checkDuration").classList.add("done");
        document.getElementById("checkDuration").innerText = "✓";
    }

    // EXERCISE
    let exercise = todayLog.exerciseLevel || "None";
    let tags     = document.querySelectorAll(".goal-ex-tag");

    tags.forEach(tag => {
        if (tag.innerText === exercise) {
            tag.classList.add("active");
        }
    });

    doneExercise = (exercise !== "None");

    if (doneExercise) {
        document.getElementById("goalExercise").classList.add("done");
        document.getElementById("checkExercise").classList.add("done");
        document.getElementById("checkExercise").innerText = "✓";
    }

    // COUNTER — must be last
    let doneCount = [doneSleep, doneWake, doneDuration, doneExercise]
        .filter(Boolean).length;

    document.getElementById("goalsCounter").innerText = doneCount + " / 4 done";
}


// =========================================
// CLOCK HAND HELPER
// =========================================

function rotateClock(handId, ringId, angleDeg, done) {
    let hand  = document.getElementById(handId);
    let ring  = document.getElementById(ringId);
    let color = done ? "#22c55e" : "rgba(255,255,255,0.5)";

    let rad = (angleDeg - 90) * Math.PI / 180;
    let x2  = 22 + 12 * Math.cos(rad);
    let y2  = 22 + 12 * Math.sin(rad);

    hand.setAttribute("x2", x2.toFixed(1));
    hand.setAttribute("y2", y2.toFixed(1));
    hand.setAttribute("stroke", color);
    ring.setAttribute("stroke", color);
}


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

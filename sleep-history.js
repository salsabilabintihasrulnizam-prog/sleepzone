// =====================
// PAGE NAVIGATION
// =====================

let currentPage = 1;

const historyPage = document.getElementById("historyPage");
const notesPage = document.getElementById("notesPage");

document.getElementById("pageNext").onclick = () => {
    currentPage = 2;
    historyPage.style.display = "none";
    notesPage.style.display = "block";
};

document.getElementById("pagePrev").onclick = () => {
    currentPage = 1;
    notesPage.style.display = "none";
    historyPage.style.display = "block";
};


// =====================
// UTILITY FUNCTIONS
// =====================

function formatDate(dateString) {
    let date = new Date(dateString);
    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatInsightDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function calculateHours(start, end) {
    let sleep = new Date("2026-01-01 " + start);
    let wake = new Date("2026-01-01 " + end);
    if (wake < sleep) {
        wake.setDate(wake.getDate() + 1);
    }
    let hrs = (wake - sleep) / (1000 * 60 * 60);
    return Number(hrs.toFixed(1));
}

function qualityText(value) {
    value = Number(value);
    if (value >= 5) return "Excellent";
    if (value >= 4) return "Good";
    if (value >= 3) return "Average";
    if (value >= 2) return "Poor";
    return "Very Poor";
}


// =====================
// HISTORY PAGE
// =====================

let currentMonth = new Date();
const monthLabel = document.getElementById("monthLabel");

function renderHistory() {
    let logs = JSON.parse(localStorage.getItem("sleepLogs")) || [];
    let year = currentMonth.getFullYear();
    let month = currentMonth.getMonth();

    monthLabel.innerText = currentMonth.toLocaleString("default", {
        month: "long",
        year: "numeric"
    });

    let filtered = logs.filter(log => {
        let d = new Date(log.date);
        return d.getFullYear() === year && d.getMonth() === month;
    });

    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    const container = document.getElementById("historyContent");

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                No sleep history available for this month.
            </div>
        `;
        return;
    }

    let html = `
    <table class="history-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Sleep Time</th>
                <th>Wake Up Time</th>
                <th>Duration</th>
                <th>Quality</th>
            </tr>
        </thead>
        <tbody>
    `;

    filtered.forEach(log => {
        html += `
        <tr>
            <td>${formatDate(log.date)}</td>
            <td>${log.sleepTime}</td>
            <td>${log.wakeTime}</td>
            <td>${calculateHours(log.sleepTime, log.wakeTime)}h</td>
            <td>${qualityText(log.quality)}</td>
        </tr>
        `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

document.getElementById("monthPrev").onclick = () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderHistory();
};

document.getElementById("monthNext").onclick = () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderHistory();
};


// =====================
// INSIGHTS PAGE
// =====================

const insightsGrid = document.getElementById("insightsGrid");
const insightDateLabel = document.getElementById("insightDateLabel");
let currentInsightDate = new Date();

document.getElementById("insightPrev").onclick = () => {
    currentInsightDate.setDate(currentInsightDate.getDate() - 1);
    renderInsightDay();
};

document.getElementById("insightNext").onclick = () => {
    currentInsightDate.setDate(currentInsightDate.getDate() + 1);
    renderInsightDay();
};

function renderInsightDay() {
    let logs = JSON.parse(localStorage.getItem("sleepLogs")) || [];
    insightDateLabel.innerText = formatInsightDate(currentInsightDate);

    const selectedLog = logs.find(log => {
        const d = new Date(log.date);
        return (
            d.getFullYear() === currentInsightDate.getFullYear() &&
            d.getMonth() === currentInsightDate.getMonth() &&
            d.getDate() === currentInsightDate.getDate()
        );
    });

console.log(logs);
console.log(currentInsightDate);
console.log(selectedLog);

    renderInsights(selectedLog);
}


// =====================
// INSIGHT CARD BUILDER
// =====================

function createInsightCard(icon, title, value, badge, badgeClass, explanation) {
    return `
    <div class="insight-card">
        <div class="insight-icon">${icon}</div>
        <div class="insight-title">${title}</div>
        <div class="insight-value">${value}</div>
        <div class="insight-badge ${badgeClass}">${badge}</div>
        <div class="insight-text">${explanation}</div>
    </div>
    `;
}

function createJournalCard(notes) {

    return `
    <div class="insight-card journal-card">

        <div class="insight-icon">📖</div>

        <div class="insight-title">
            Sleep Journal
        </div>

        <div class="insight-text journal-text">
            ${notes || "No journal entry recorded for this day."}
        </div>

    </div>
    `;
}


// =====================
// INSIGHT LOGIC
// =====================

function getSleepDurationInsight(hours) {
    if (hours < 4) {
        return {
            badge: "Sleep Debt",
            class: "badge-yellow",
            text: "You slept only " + hours.toFixed(1) + " hours. Consistently getting less than 4 hours of sleep may affect concentration, mood, and recovery."
        };
    }
    if (hours < 6) {
        return {
            badge: "Below Recommended",
            class: "badge-yellow",
            text: "Your sleep duration was shorter than the recommended amount. Aim for at least 7 hours of sleep whenever possible."
        };
    }
    if (hours <= 8) {
        return {
            badge: "Healthy Range",
            class: "badge-green",
            text: "Great job. Your sleep duration falls within the recommended range for most adults."
        };
    }
    return {
        badge: "Longer Sleep Duration",
        class: "badge-blue",
        text: "You slept longer than usual. Occasional long sleep is normal, but frequent oversleeping may indicate fatigue or inconsistent sleep patterns."
    };
}

function getSleepOnsetInsight(minutes) {
    if (minutes < 15) {
        return {
            badge: "Very Fast Sleep Onset",
            class: "badge-yellow",
            text: "You fell asleep very quickly. While this may seem positive, it can sometimes be a sign of accumulated sleep deprivation."
        };
    }
    if (minutes <= 30) {
        return {
            badge: "Ideal",
            class: "badge-green",
            text: "It took you 15–30 minutes to fall asleep, which is considered a healthy sleep onset time."
        };
    }
    if (minutes <= 60) {
        return {
            badge: "Slight Difficulty",
            class: "badge-yellow",
            text: "You needed some time to fall asleep. Consider reducing stimulation before bedtime."
        };
    }
    return {
        badge: "Sleep Initiation Difficulty",
        class: "badge-yellow",
        text: "Falling asleep took longer than an hour. Stress, screen exposure, or caffeine may be contributing factors."
    };
}

function getScreenInsight(screenTime) {
    if (screenTime === "None") {
        return {
            badge: "Excellent Habit",
            class: "badge-green",
            text: "Avoiding screens before bed supports natural melatonin production and better sleep quality."
        };
    }
    if (screenTime === "< 1 Hour") {
        return {
            badge: "Good Habit",
            class: "badge-green",
            text: "Your screen exposure was relatively low before bedtime."
        };
    }
    if (screenTime === "> 1 Hour") {
        return {
            badge: "Consider Reducing Screen Time",
            class: "badge-yellow",
            text: "Extended screen exposure before sleep may delay melatonin release and affect sleep quality."
        };
    }
    return {
        badge: "High Screen Exposure",
        class: "badge-yellow",
        text: "High screen use before bed is strongly associated with delayed sleep onset and poorer sleep quality."
    };
}

function getCaffeineInsight(caffeine) {
    if (caffeine === "None") {
        return {
            badge: "Excellent",
            class: "badge-green",
            text: "No caffeine was consumed before sleep, supporting better sleep quality."
        };
    }
    if (caffeine === "Low") {
        return {
            badge: "Low Impact",
            class: "badge-green",
            text: "A small amount of caffeine is unlikely to significantly affect sleep for most people."
        };
    }
    if (caffeine === "Moderate") {
        return {
            badge: "Monitor Intake",
            class: "badge-yellow",
            text: "Moderate caffeine consumption may affect sleep sensitivity depending on timing."
        };
    }
    return {
        badge: "High Caffeine Intake",
        class: "badge-yellow",
        text: "High caffeine intake before bedtime may reduce sleep quality and increase the time needed to fall asleep."
    };
}

function getExerciseInsight(exercise) {
    if (exercise === "None") {
        return {
            badge: "Opportunity For Improvement",
            class: "badge-yellow",
            text: "Light daily activity may help improve sleep quality and nighttime recovery."
        };
    }
    if (exercise === "Light") {
        return {
            badge: "Positive Habit",
            class: "badge-green",
            text: "Light exercise supports healthy sleep and overall wellbeing."
        };
    }
    if (exercise === "Moderate") {
        return {
            badge: "Excellent",
            class: "badge-green",
            text: "Moderate activity levels are associated with improved sleep quality and mood."
        };
    }
    return {
        badge: "Very Active",
        class: "badge-green",
        text: "Regular exercise is beneficial, though intense workouts should ideally be completed several hours before bedtime."
    };
}

function getNapInsight(nap) {
    if (nap == 0) {
        return {
            badge: "No Daytime Sleep",
            class: "badge-blue",
            text: "No naps were recorded today."
        };
    }
    if (nap < 30) {
        return {
            badge: "Power Nap",
            class: "badge-green",
            text: "Short naps can improve alertness without significantly affecting nighttime sleep."
        };
    }
    if (nap <= 60) {
        return {
            badge: "Moderate Nap",
            class: "badge-yellow",
            text: "Longer naps may reduce sleep pressure later in the evening."
        };
    }
    return {
        badge: "Extended Nap",
        class: "badge-yellow",
        text: "Long naps may interfere with nighttime sleep and delay bedtime."
    };
}


// =====================
// RENDER INSIGHTS
// =====================

function renderInsights(log) {
    insightsGrid.innerHTML = "";

    if (!log) {
        insightsGrid.innerHTML = `
            <div class="empty-message">
                No Sleep Data Available
            </div>
        `;
        return;
    }

    const sleepHours = calculateHours(log.sleepTime, log.wakeTime);
    const sleepOnset = Number(log.sleepOnset || 0);
    const screen = log.screenTimeBeforeBed || "None";
    const caffeine = log.caffeineIntake || "None";
    const exercise = log.exerciseLevel || "None";
    const nap = Number(log.napDuration || 0);

    const s1 = getSleepDurationInsight(sleepHours);
    insightsGrid.innerHTML += createInsightCard("😴", "Sleep Duration", `${sleepHours}h`, s1.badge, s1.class, s1.text);

    const s2 = getSleepOnsetInsight(sleepOnset);
    insightsGrid.innerHTML += createInsightCard("⏱️", "Time To Fall Asleep", `${sleepOnset} min`, s2.badge, s2.class, s2.text);

    const s3 = getScreenInsight(screen);
    insightsGrid.innerHTML += createInsightCard("📱", "Screen Time", screen, s3.badge, s3.class, s3.text);

    const s4 = getCaffeineInsight(caffeine);
    insightsGrid.innerHTML += createInsightCard("☕", "Caffeine Intake", caffeine, s4.badge, s4.class, s4.text);

    const s5 = getExerciseInsight(exercise);
    insightsGrid.innerHTML += createInsightCard("🏃", "Exercise", exercise, s5.badge, s5.class, s5.text);

    const s6 = getNapInsight(nap);
    insightsGrid.innerHTML += createInsightCard("🌙", "Nap Duration", `${nap} min`, s6.badge, s6.class, s6.text);

    insightsGrid.innerHTML += createJournalCard(log.notes);
}


// =====================
// INITIALIZWE
// =====================

renderHistory();
renderInsightDay();
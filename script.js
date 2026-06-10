const startingTrees = 25;

const TREE_CUT_POINTS = 1;
const PLANK_POINTS = 5;
const TREE_PLANT_POINTS = 2;
const FOREST_BONUS = 10;
const PLANK_MILESTONE_BONUS = 25;

let logs = 0;
let planks = 0;
let seeds = 5;
let trees = startingTrees;
let health = 100;
let points = 0;

let autoCutting = null;
let autoPlanting = null;
let autoSawmill = null;
let automationRunning = false;
let isCutting = false;

const bigTree = document.getElementById("bigTree");
const lumberjack = document.getElementById("lumberjack");

bigTree.addEventListener("click", cutTree);

function cutTree() {
    if (isCutting || trees <= 0) return;

    isCutting = true;
    lumberjack.style.left = "500px";

    setTimeout(() => {
        lumberjack.classList.add("chop");
        bigTree.classList.add("shake");

        logs += 2;
        trees--;
        points += TREE_CUT_POINTS;

        if (Math.random() < 0.4) {
            seeds++;
        }

        updateGame();

        setTimeout(() => {
            lumberjack.classList.remove("chop");
            bigTree.classList.remove("shake");
            lumberjack.style.left = "340px";
            isCutting = false;
        }, 350);
    }, 400);
}

function plantTree() {
    if (seeds <= 0) {
        alert("You need a seed to plant a tree.");
        return;
    }

    seeds--;
    trees++;

    points += TREE_PLANT_POINTS;

    if (trees >= 50) {
        points += FOREST_BONUS;
    }

    updateGame();
}

function makePlanks() {
    if (logs < 2) {
        alert("Need 2 logs.");
        return;
    }

    logs -= 2;
    planks++;

    points += PLANK_POINTS;

    if (planks % 10 === 0) {
        points += PLANK_MILESTONE_BONUS;
    }

    updateGame();
}

function updateHealth() {
    health = Math.min(100, Math.floor((trees / startingTrees) * 100));
}

function startAutomation() {
    if (automationRunning) return;

    automationRunning = true;

    document.getElementById("automationStatus").textContent = "ON";
    document.getElementById("automationStatus").style.color = "#66ff66";

    startAutoCutting();
    startAutoPlanting();
    startAutoSawmill();
}

function stopAutomation() {
    automationRunning = false;

    document.getElementById("automationStatus").textContent = "OFF";
    document.getElementById("automationStatus").style.color = "#ff5555";

    stopAutoCutting();
    stopAutoPlanting();
    stopAutoSawmill();
}

function startAutoCutting() {
    if (!autoCutting) {
        autoCutting = setInterval(cutTree, 1000);
    }
}

function stopAutoCutting() {
    clearInterval(autoCutting);
    autoCutting = null;
}

function startAutoPlanting() {
    if (!autoPlanting) {
        autoPlanting = setInterval(() => {
            if (seeds > 0) plantTree();
        }, 500);
    }
}

function stopAutoPlanting() {
    clearInterval(autoPlanting);
    autoPlanting = null;
}

function startAutoSawmill() {
    if (!autoSawmill) {
        autoSawmill = setInterval(() => {
            if (logs >= 2) makePlanks();
        }, 800);
    }
}

function stopAutoSawmill() {
    clearInterval(autoSawmill);
    autoSawmill = null;
}

function displayLogs() {
    const container = document.getElementById("logs");
    container.innerHTML = "";

    let count = Math.min(logs, 36);
    let rowSizes = [8, 7, 6, 5, 4, 3, 2];

    rowSizes.forEach(size => {
        if (count <= 0) return;

        const row = document.createElement("div");
        let logsInRow = Math.min(size, count);

        for (let i = 0; i < logsInRow; i++) {
            row.textContent += "🪵";
        }

        container.appendChild(row);
        count -= logsInRow;
    });

    if (logs > 36) {
        const extra = document.createElement("div");
        extra.textContent = "+" + (logs - 36);
        container.appendChild(extra);
    }

    container.classList.add("bounce");
    setTimeout(() => container.classList.remove("bounce"), 400);
}

function displayPlanks() {
    const container = document.getElementById("planks");
    container.innerHTML = "";

    let count = Math.min(planks, 36);
    let rowSizes = [8, 7, 6, 5, 4, 3, 2];

    rowSizes.forEach(size => {
        if (count <= 0) return;

        const row = document.createElement("div");
        let planksInRow = Math.min(size, count);

        for (let i = 0; i < planksInRow; i++) {
            row.textContent += "🟫";
        }

        container.appendChild(row);
        count -= planksInRow;
    });

    if (planks > 36) {
        const extra = document.createElement("div");
        extra.textContent = "+" + (planks - 36);
        container.appendChild(extra);
    }
}

function displaySeeds() {
    const container = document.getElementById("seeds");
    container.innerHTML = "";

    let visibleSeeds = Math.min(seeds, 12);

    for (let i = 0; i < visibleSeeds; i++) {
        const seed = document.createElement("span");
        seed.textContent = "🌰";
        container.appendChild(seed);
    }

    if (seeds > 12) {
        const extra = document.createElement("span");
        extra.textContent = "+" + (seeds - 12);
        container.appendChild(extra);
    }
}

function updateGame() {
    updateHealth();

    document.getElementById("trees").textContent = trees;
    document.getElementById("health").textContent = health;
    document.getElementById("pointsCount").textContent = points;
    document.getElementById("logsCount").textContent = logs;
    document.getElementById("planksCount").textContent = planks;
    document.getElementById("seedsCount").textContent = seeds;

    displayLogs();
    displayPlanks();
    displaySeeds();

    if (trees <= 0) {
        alert("Game Over! The forest was destroyed.");

        points = 0;
        logs = 0;
        planks = 0;
        seeds = 5;
        trees = startingTrees;

        stopAutomation();
        updateGame();
    }
}

updateGame();

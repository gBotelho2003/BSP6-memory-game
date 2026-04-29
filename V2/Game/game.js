


// core variables
let correctSequence = [];
let playerSequence = [];
let score = 0;
let gameStarted = false;
let timer;
let remainingTime = 0;
// correct clicks in a row 
let inARow = 0;

function difficulty(lvl) {

    let playerName = localStorage.getItem("playerName");

    // ask for name only once
    if (!playerName) {
        playerName = prompt("Please enter your name to play:");

        if (!playerName || playerName.trim() === "") {
            alert("You need to enter a name to play.");
            return;
        }

        localStorage.setItem("playerName", playerName.trim());
    }


    // store level 
    localStorage.setItem("currentLevel", lvl);
    if (lvl == 1) {
        window.location.href = "/V2/Game/level1Page.html";

    }
    else if (lvl == 2) {
        window.location.href = "/V2/Game/level2Page.html";
    }
    else if (lvl == 3) {
        window.location.href = "/V2/Game/level3Page.html";
    }

}


function initFakeLeaderboard(level) {
    if (localStorage.getItem(`leaderboardSeeded_level${level}`)) return;

    const fakeEntries = {
        1: [
            { name: "Gabriel", time: "00:11", score: 120 },
            { name: "Bruno", time: "00:10", score: 105 },
            { name: "Jon", time: "00:09", score: 95 },
            { name: "Ana", time: "00:07", score: 85 },
            { name: "Mike", time: "00:05", score: 85 },
        ],
        2: [
            { name: "Sara", time: "00:15", score: 160 },
            { name: "Lucas", time: "00:14", score: 140 },
            { name: "Emma", time: "00:12", score: 125 },
            { name: "Noah", time: "00:10", score: 110 },
            { name: "Mia", time: "00:08", score: 95 },
        ],
        3: [
            { name: "Alex", time: "00:20", score: 210 },
            { name: "Chris", time: "00:18", score: 190 },
            { name: "Maya", time: "00:15", score: 170 },
            { name: "Ryan", time: "00:12", score: 150 },
            { name: "Zoe", time: "00:10", score: 130 },
        ],
    };

    localStorage.setItem(`leaderboard_level${level}`, JSON.stringify(fakeEntries[level]));
    localStorage.setItem(`leaderboardSeeded_level${level}`, "true");
}

function saveToLeaderboard(score, remainingTime) {
    let playerName = localStorage.getItem("playerName") || "Anonymous";
    let level = localStorage.getItem("currentLevel");
    // format time as MM:SS
    let minutes = Math.floor(remainingTime / 60);
    let seconds = remainingTime % 60;
    let formattedTime =
        String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");

    // get old leaderboard or empty array
    let leaderboard = JSON.parse(localStorage.getItem(`leaderboard_level${level}`)) || [];

    // add new score
    leaderboard.push({
        name: playerName,
        time: formattedTime,
        score: score
    });

    // sort descending by score
    leaderboard.sort((a, b) => b.score - a.score);

    // keep only top 10
    leaderboard = leaderboard.slice(0, 10);

    // save back
    localStorage.setItem(`leaderboard_level${level}`, JSON.stringify(leaderboard));
}

function loadLeaderboard() {
    let level = localStorage.getItem("currentLevel");
    let leaderboard = JSON.parse(localStorage.getItem(`leaderboard_level${level}`)) || [];
    let leaderboardContainer = document.getElementById("leaderboardRows");

    if (!leaderboardContainer) return;

    leaderboardContainer.innerHTML = "";

    leaderboard.forEach((entry) => {
        let row = document.createElement("div");
        row.classList.add("leaderboard-row");

        row.innerHTML = `
            <span>${entry.name}</span>
            <span>${entry.time}</span>
            <span>${entry.score}</span>
        `;

        leaderboardContainer.appendChild(row);
    });
}

// Check if we are on a game page and start the game
window.onload = () => {
    const level = localStorage.getItem("currentLevel");
    initFakeLeaderboard(parseInt(level));

    loadLeaderboard(level);
    // Ensure we have a level and we are on a page with a grid
    if (level && document.querySelector('.grid3by3')) {
        startGame(parseInt(level));
    }
};


// starts the game by calling necessary functions 
function startGame(level) {

    // reset the points
    score = 0;
    // prevent clicking on the grid before the sequence is shown
    let sequenceVisible = true;


    // get all the cells from the grid
    const cells = document.querySelectorAll('.item');
    gameStarted = true;
    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            handlePlayerClick(index, cells, level);
        });
    });

    // timer function for the levels 
    function startTimer(timeLimit) {
        remainingTime = timeLimit;
        updateTimerDisplay();

        timer = setInterval(() => {
            remainingTime--;
            updateTimerDisplay();
            

            const overlay = document.getElementById("stressOverlay");

            if (remainingTime === 6) {
                overlay.classList.add("active");
            }

            if (remainingTime <= 0) {
                clearInterval(timer);
                gameStarted = false;
                calculateScore("timeOut");
                showLevelCompletePopup(false);
                document.getElementById("stressOverlay").classList.remove("active");
            }
        }, 1000);
    }

    // live update of the timer display
    function updateTimerDisplay() {
        let minutes = Math.floor(remainingTime / 60);
        let seconds = remainingTime % 60;

        // format as 00:09 instead of 0:9
        let formattedTime =
            String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");

        document.getElementById("timer").textContent = formattedTime;
    }

    function handlePlayerClick(index) {
        if (!gameStarted) return;
        if (sequenceVisible) return;
        playerSequence.push(index);

        console.log("User clicked:", playerSequence);

        checkSequence();
    }


    if (level == 1) {
        length = 4;
        timeLimit = 10;
    } else if (level == 2) {
        length = 5;
        timeLimit = 15;
    } else if (level == 3) {
        length = 7;
        timeLimit = 20;
    }
    generateSequence(length);
    startTimer(timeLimit);


    // length is the amount of numbers to guess 
    function generateSequence(length) {

        correctSequence = [];
        // generate random indices until we have the correct amount of numbers to guess
        while (correctSequence.length < length) {

            let randomIndex = Math.floor(Math.random() * cells.length);

            // verify that we do not get duplicates in the sequence
            if (!correctSequence.includes(randomIndex)) {
                correctSequence.push(randomIndex);
            }
        }
        displaySequence();
        console.log(correctSequence);
    }


    function displaySequence() {

        // loop through the correct sequence and add the 'active' class to the corresponding cells with a delay
        correctSequence.forEach((index, i) => {
            // display the order number on the cell
            cells[index].textContent = i + 1;
        });

        if (level == 1) {
            hideSequence(750);
        }
        else if (level == 2) {
            hideSequence(1000);
        }
        else if (level == 3) {
            hideSequence(1500);
        }

    }

    // hide the sequence after a short delay
    function hideSequence(displayTime) {
        // loop through the correct sequence and remove the 'active' class from the corresponding cells
        setTimeout(() => {
            cells.forEach(cell => {
                cell.textContent = "";
            });
            sequenceVisible = false;
        }, displayTime); // visible for 2 seconds
    }

    // check the player's sequence against the correct sequence
    function checkSequence() {
        let currentClick = playerSequence.length - 1;
        let clickedIndex = playerSequence[currentClick];
        // save the clicked cell so when it gets popped i still can be accessed to change its color
        let clickedCell = cells[clickedIndex];



        if (clickedIndex !== correctSequence[currentClick]) {

            if (correctSequence.includes(clickedIndex)) {
                // this means the cell contains a number so we only blink it red so they can retry it again 
                let originalColor = cells[playerSequence[currentClick]].style.backgroundColor;
                clickedCell.style.backgroundColor = "orange";
                setTimeout(() => {
                    clickedCell.style.backgroundColor = originalColor;
                }, 500);
                console.log("Wrong click, try again!");

                calculateScore("wrongPath");
            }
            else {
                // color the cell red to indicate a wrong click
                clickedCell.style.backgroundColor = "red";
                clickedCell.textContent = "X";
                console.log("Wrong again!");
                calculateScore("wrongEmpty");
            }

            // wrong click so reset  
            inARow = 0;

            // take the wrong number out of the player sequence
            playerSequence.pop();
        }
        else {
            // color the cell green to indicate a correct click
            cells[playerSequence[currentClick]].style.backgroundColor = "green";
            // show the order number on the cell
            cells[playerSequence[currentClick]].textContent = currentClick + 1;

            // update correct clicks in a row and calculate score
            inARow++;
            calculateScore("correct", inARow);
        }

        if (
            currentClick === correctSequence.length - 1 &&
            clickedIndex === correctSequence[currentClick]
        ) {
            clearInterval(timer);
            calculateScore("timerBonus", remainingTime);
            gameStarted = false;
            saveToLeaderboard(score, remainingTime);
            loadLeaderboard();
            showLevelCompletePopup(true);


        }
    }

    // points calculation to be refined
    function calculateScore(action, value = 0) {

        switch (action) {
            case "correct":
                score += 10 * value;
                break;
            case "timerBonus":
                score += value * 5;
                break;
            case "timeOut":
                score = score / 2;
                break;
            case "wrongEmpty":
                score -= 10;
                break;
            case "wrongPath":
                score -= 5;
                break;
            default:
                score += 0; // default case, no points
        }
        if (score < 0) score = 0; // prevent negative scores

        const scoreDisplay = document.getElementById("playerScore");
        if (scoreDisplay) {
            scoreDisplay.textContent = `${score}`;
        }
    }
    function showLevelCompletePopup(success) {
        const timeOver = document.getElementById("timeOver");
        if (!success) {
            timeOver.textContent = "Time's up!";

        }
        const popup = document.getElementById("levelPopup");
        const message = document.getElementById("popupMessage");


        message.textContent = `Score: ${score} | Time Left: ${remainingTime}s`;
        popup.classList.remove("hidden");
        levelComplete(level);
    }

    function levelComplete(lvl) {
        if (lvl == 1) {
            localStorage.setItem("enableLevel2", "true");
        }
        if (lvl == 2) {
            localStorage.setItem("enableLevel3", "true");
        }

    }



}



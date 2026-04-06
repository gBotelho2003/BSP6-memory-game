


// core variables
let correctSequence = [];
let playerSequence = [];
let score = 0;
let gameStarted = false;

function difficulty(lvl) {

    // store level 
    localStorage.setItem("currentLevel", lvl);
    if (lvl == 1) {
        window.location.href = "/V1/Game/level1Page.html";

    }
    else if (lvl == 2) {
        window.location.href = "/V1/Game/level2Page.html";
    }
    else if (lvl == 3) {
        window.location.href = "/V1/Game/level3Page.html";
    }

}

// Check if we are on a game page and start the game
window.onload = () => {
    const level = localStorage.getItem("currentLevel");
    // Ensure we have a level and we are on a page with a grid
    if (level && document.querySelector('.grid4by3')) {
        startGame(parseInt(level));
    }
};


// starts the game by calling necessary functions 
function startGame(level) {

    // get all the cells from the grid
    const cells = document.querySelectorAll('.item');
    gameStarted = true;
    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            handlePlayerClick(index, cells, level);
        });
    });

    function handlePlayerClick(index) {
        playerSequence.push(index);

        console.log("User clicked:", playerSequence);

        checkSequence();
    }

    if (level == 1) {
        length = 5;
    } else if (level == 2) {
        length = 7;
    } else if (level == 3) {
        length = 9;
    }
    generateSequence(length);

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
            hideSequence(1000);
        }
        else if (level == 2) {
            hideSequence(1500);
        }
        else if (level == 3) {
            hideSequence(2000);
        }

    }

    // hide the sequence after a short delay
    function hideSequence(displayTime) {
        // loop through the correct sequence and remove the 'active' class from the corresponding cells
        setTimeout(() => {
            cells.forEach(cell => {
                cell.textContent = "";
            });
        }, displayTime); // visible for 2 seconds
    }

    // check the player's sequence against the correct sequence
    function checkSequence() {
        let currentClick = playerSequence.length - 1;
        let clickedIndex = playerSequence[currentClick];
        // save the clicked cell so when it gets popped i still can be accessed to change its color
        let clickedCell = cells[clickedIndex];

        if (clickedIndex !== correctSequence[currentClick]) {

            if(correctSequence.includes(clickedIndex)){ 
                // this means the cell contains a number so we only blink it red so they can retry it again 
                let originalColor = cells[playerSequence[currentClick]].style.backgroundColor;
                clickedCell.style.backgroundColor = "red";
                setTimeout(() => {
                    clickedCell.style.backgroundColor = originalColor;
                }, 500);
                console.log("Wrong click, try again!");
            }
            else{
                // color the cell red to indicate a wrong click
                clickedCell.style.backgroundColor = "red";
                clickedCell.textContent = "X";
                console.log("Wrong again!");
            }

            

            // take the wrong number out of the player sequence
            playerSequence.pop();
        }
        else {
            // color the cell green to indicate a correct click
            cells[playerSequence[currentClick]].style.backgroundColor = "green";
            // show the order number on the cell
            cells[playerSequence[currentClick]].textContent = currentClick + 1;
        }

        if (playerSequence === correctSequence) {
            alert("Correct! Level Complete.");
        }
    }

    // points calculation to be refined
    function calculateScore() {
        score = playerSequence.length * 10; // example scoring: 10 points per correct click
        document.getElementById("score").textContent = `Score: ${score}`;
    }



}



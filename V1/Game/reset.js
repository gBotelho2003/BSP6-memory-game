// reset local storage variables
function resetGame() {
    localStorage.setItem("level2", "false");
    localStorage.setItem("level3", "false");
    localStorage.removeItem("playerName");
    location.reload();
}


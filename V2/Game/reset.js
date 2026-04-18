// reset local storage variables
function resetGame() {
    localStorage.setItem("enableLevel2", "false");
    localStorage.setItem("enableLevel3", "false");
    localStorage.removeItem("playerName");
    location.reload();
}


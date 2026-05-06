// reset local storage variables
function resetGame() {
    localStorage.setItem("enableLevel2", "false");
    localStorage.setItem("enableLevel3", "false");
    localStorage.removeItem("playerName");
    // reset stats list for new user
    localStorage.removeItem("stats"); 
    
    location.reload();
}


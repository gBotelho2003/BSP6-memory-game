// update difficulty buttons based on current level
function updateDifficultyButtons(){

    const enableLevel2 = localStorage.getItem("enableLevel2");
    const enableLevel3 = localStorage.getItem("enableLevel3");

    document.getElementById("level2").disabled = enableLevel2 !== "true";
    document.getElementById("level3").disabled = enableLevel3 !== "true";

    if(enableLevel2 === "true"){
        document.getElementById("level2").disabled = false;
        document.getElementById("level1").disabled = true;
    }
    if(enableLevel3 === "true"){
        document.getElementById("level3").disabled = false;
        document.getElementById("level2").disabled = true;
        
    }

}

// call the function to update buttons on page load
if(window.location.href.includes("levelPage.html")){
    
    updateDifficultyButtons();
}
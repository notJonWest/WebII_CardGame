/* This file contains global variables and functions that set up the game. */
//Trackers to help test functionality
let trackers = {};
for (let el of qsAll("#tracking > span"))
    trackers[el.id] = 0; //Add trackers based on what's in the tracking div
let updateTrackers = function(_reset = false)
{
    for (let counter in trackers)
    {
        if (_reset) //If _reset is true, reset counters
            trackers[counter] = 0;
        qs("#" + counter).innerHTML = trackers[counter];
    }  
};
let listCommands = function()
{
    let cmds =
    {
        ENTER: "Continue Game. You can also click the played card deck if you don't want use the keyboard/don't have one..",
        E: "Use autoplay. Useful for reaching end game fast (Hold e down)",
        R: "Switch sort mode (Sort hand automatically vs not)",
        F: "Toggle whether you can see cards that you should not be able to see (i.e. your opponents)",
        T: "Toggle visibility of tracking div",
        Q: "Bring up the Eight Choice div",
        W: "Bring up the Game Over div (Will look empty if game isn't actually over)",
        "<- and ->": "Loop through your hand (Select next/previous card)"
    };
    console.groupCollapsed("Key Commands");
    console.table(cmds);
    console.log("Bring this back up anytime by typing in console: listCommands()");
    console.groupEnd();
};
listCommands();
//End tracking/testing code
let USER, TABLE;
const SUITS = ["Spades", "Clubs", "Hearts", "Diamonds"];

let fillUserInfo = function()
{
    if (!checkLocalStorage())
        location.href = "intro.html";
    else
        USER = new User(localStorage.fname, localStorage.lname, localStorage.username,
            parseInt(localStorage.money), localStorage.phone, localStorage.postal, localStorage.lastVisit);

};
let removeCredentials = function()
{
    localStorage.removeItem("fname");
    localStorage.removeItem("lname");
    localStorage.removeItem("username");
    localStorage.removeItem("money");
    localStorage.removeItem("phone");
    localStorage.removeItem("postal");
    localStorage.removeItem("lastVisit");
};
let resetForm = function()
{
    $("#gameForm").validate().resetForm();
    $("#bet").val("");
    $("#plrNumSlider").slider("option", "value", 1);
    $("#plrNum").text("1");

    $("#cardNumSlider").slider("option", "value", 8);
    $("#cardNum").text("8");
};
let startGame = function(form, e)
{
    e.preventDefault();
    let values = {
        bet:$("#bet").val(),
        plrNum:$("#plrNumSlider").slider("option", "value"),
        cardNum:$("#cardNumSlider").slider("option", "value")};
    let gameArgs = {bet: parseInt(qs("#bet").placeholder), plrNum: 1, cardNum: 8};
    for (let fld in values) //Loop through form texts and add values to gameArgs
    {
        if (!isNaN(parseInt(values[fld]))) //If not a valid number, assume defaults (Which are the placeholders)
            gameArgs[fld] = parseInt(values[fld]);
    }
    if (USER.money >= gameArgs.bet) //Make sure the user has more money than they're betting
    {
        resetForm();
        TABLE = new Table();
        TABLE.prepareGame(gameArgs.plrNum, gameArgs.bet, gameArgs.cardNum);
        qs("#gameDiv").style.display = "block";
        qs("#gameForm").style.display = "none";
        GameGUI.attachListeners();
        updateTrackers(true);
        let plrDis = qs("#playerDisplay");
        let cpuNames = qs("#cpuNames");
		for (let plr of TABLE.players)
		{
			//Create divs to display cards in
			let cardDiv = document.createElement("div");
			cardDiv.id = plr.name + "_cards";
			cardDiv.classList.add("playerCards");
			//Create display for player's name
			let plrNameP = document.createElement((plr.type==="user")?"p":"label");
			plrNameP.for = cardDiv.id;
			plrNameP.id = plr.name + "_name";
			plrNameP.classList.add(plr.type + "Plr");
			plrNameP.innerHTML = plr.name;
            if (plr.type === "cpu")
            {
                if (plr.name === "CPU1")
                {
                    plrNameP.classList.add("visibleCPU");
                    cardDiv.classList.add("visibleCPU");
                }
                cardDiv.classList.add("cpuCards");
            }
			//Append new elements to cardDisplayDiv
            if (plr.type === "user")
            {
                plrDis.appendChild(plrNameP);
                plrDis.insertBefore(cardDiv, qs(".userPlr").nextSibling);
            }
            else
            {
                cpuNames.appendChild(plrNameP);
                qs("#cpuCards").appendChild(cardDiv);
            }
		}
        cpuNames.addEventListener("mouseover", GameGUI.changeVisibleCard);
        qs("#cpuDisplay").addEventListener("mouseleave", ()=>
            GameGUI.changeVisibleCard(qs((TABLE.getCurrentPlayer() === USER.player)?"#CPU1_name":".currentPlayer")));
        GameGUI.updateCardDisplay();
    }
};
$(function() {
    $("#plrNumSlider").slider(
        {
            min: 1,
            max: 5,
            slide: (ev, ui) =>
            {
                $("#plrNum").text(ui.value);
                $cards = $("#cardNumSlider");
                $cards.slider("option", "max", Math.floor(50/(ui.value+1)));
                if ($cards.slider("option", "value") > $cards.slider("option", "max"))
                {
                    $cards.slider("option", "value", $cards.slider("option", "max"));
                    $("#cardNum").text($cards.slider("option", "value"));
                }
            }
        }
    );
    $("#cardNumSlider").slider(
        {
            min: 1,
            max: 25,
            value: 8,
            slide: (ev, ui) =>
                $("#cardNum").text(ui.value)
        }
    );
    fillUserInfo();
    let now = new Date();
    let date = new Intl.DateTimeFormat("en-CA", {
        weekday: "long", month: "long", day: "numeric",
        year: "numeric", hour: "numeric", minute: "numeric"});
    localStorage.lastVisit = date.format(now);
    $("#changeCredentials").on("click", removeCredentials);
    $("#leaveBtn").on("click", ()=>location.href = "index.html");
    $("body").on("error", ()=>{
        GameGUI.rematch();
    });
    $("#gameForm").validate({
        rules: {
            bet: {
                number: true,
                max: USER.money,
                min: 0
            }
        },
        submitHandler: startGame
    });
});

window.addEventListener("error", ()=>
{
   window.alert("Unexpected error occurred, redirecting to home page...");
   location.href="index.html";
});
const canvas = qs("#myCanvas");
const ctx = canvas.getContext("2d");

let walk = function(dist, start, step, townImg)
{
    let size = Math.min(canvas.width, canvas.height);
    ctx.drawImage(townImg, dist / 2, step + (dist * 0.83), start - dist, start - dist, 0, 0, size, size);
};

let tumble = function(xPos, deg, bounce, tumbleImg, townImg)
{
    let yPos = (canvas.height - (canvas.height * 0.14)) - bounce;
    let cSize = Math.min(canvas.width, canvas.height);
    let weedSize = cSize * 0.08;
    walk(0, 1000, 0, townImg);
    ctx.save();
    ctx.translate(xPos - weedSize/2, yPos + weedSize/2);
    ctx.rotate(deg*Math.PI/2);
    ctx.drawImage(tumbleImg, -weedSize/2, -weedSize/2, weedSize, weedSize);
    ctx.restore();
};

let openDoors = function(time = 4000, delay = 0)
{
    $("#doors").css("visibility", "visible");
    setTimeout(() =>
    {
        $("#myCanvas").css("visibility", "hidden");
        $(".door").css("transition", `transform ${time}ms ease-out`);
        $("#leftDoor").css("transform", "rotateY(80deg)");
        $("#rightDoor").css("transform", "rotateY(-80deg)");
    }, delay);
};

$(function(){
    $("#skipBtn").on("click", ()=>location.href = "intro.html");
    canvas.width = Math.min(parseInt($("main").css("width")) - 10, 500); //Subtract 10 to compensate for the border
    canvas.height = canvas.width;
    $("#animation").css("width", canvas.width + "px").css("height", canvas.height + "px");

    let tumblePos = canvas.width + 50;
    let tumbleAngle = 180;
    let tumbleBounce = 5;
    let tumbleBounceDirection = 1;

    let townImg = new Image();
    townImg.src = "images/town.jpg";
    townImg.addEventListener("load", ()=>
    {
        let tumbleImg = new Image();
        tumbleImg.src = "images/tumbleweed.png";
        tumbleImg.addEventListener("load", () =>
        {
            let tumbleInterv = setInterval(() =>
            {
                tumble(tumblePos, tumbleAngle, tumbleBounce, tumbleImg, townImg);
                tumbleAngle -= 0.1;
                tumblePos -= 3;
                tumbleBounce += tumbleBounceDirection;
                if (Math.abs(tumbleBounce) >= 15)
                    tumbleBounceDirection *= -1;
                if (tumblePos < -50)
                {
                    clearInterval(tumbleInterv);
                    let dist = 0;
                    let start = 1000;
                    let stepLength = 5;
                    let stepHeight = 0;
                    let stepHeightDirection = 1;

                    let approachInterv = setInterval(() =>
                    {
                        walk(dist, start, stepHeight, townImg);
                        dist += stepLength;
                        stepHeight += stepHeightDirection;
                        if (Math.abs(stepHeight) >= 10)
                            stepHeightDirection *= -1;
                        if (dist >= 930)
                        {
                            clearInterval(approachInterv);
                            ctx.fillStyle = "#4d2021";
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            openDoors(4000, 1000);
                            setTimeout(() => location.href = "intro.html", 4000);
                        }
                    }, 60);
                }
            }, 30);
        });
    });
});
var currentGyro = 0
var offsetGyro = 0
var cameraStream1 = "http://rpi3-4774.local:1181/"
var alliance = "red"
var timerStart = false;
var firstReset = false;
var current_height = ""
var timerFrom = 135;
var timerCounter = true;
var intervalTimer;

$(document).ready(function () {
    $("#camera1").attr("src", cameraStream1);
    $("#state").attr("src", "img/icons/stationaryred.png");
    $("#compass").attr("src", "img/robotred.png");
    $("#robotSVG").attr("xlink:href", "img/robotred.png");


    // sets a function that will be called when the websocket connects/disconnects
    NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

    // sets a function that will be called  when the robot connects/disconnects
    NetworkTables.addRobotConnectionListener(onRobotConnection, true);


    // sets a function that will be called when any NetworkTables key/value changes
    NetworkTables.addGlobalListener(onValueChanged, true);

    // hook up our SendableChoosers to combo boxes
    attachSelectToSendableChooser("#auto-select", "/SmartDashboard/Autonomous Mode");

    $("#checklist").submit(remove_form)
});

function onValueChanged(key, value, isNew) {
    switch (key) {
        case "/robot/mode":
            if (value === "teleop") {
                if (!timerStart) {
                    startTimer();
                    remove_form();
                    break;
                }
            }
            if (value === "disabled") {
                remove_form();
                resetTimer();
                break;
            }

            break;

        case "/SmartDashboard/gyro":
            rotateCompass(value + Math.PI);
            currentGyro = value;
            break;


        case "/SmartDashboard/alliance":
            if (value === "red") {
                alliance = "red"
                document.documentElement.style.setProperty('--accent-colour', '#C62828')
            } else if (value === "blue") {
                alliance = "blue"
                document.documentElement.style.setProperty('--accent-colour', '#3565bf')
            }
            $("#compass").attr("src", "img/robot" + alliance + ".png");
            $("#robotSVG").attr("src", "img/robot" + alliance + ".png");
            $("#robotSVG").attr("xlink:href", "img/robot" + alliance + ".png");

            break;

        case "/SmartDashboard/reset_video":
            resetVideo()
            break;

        case "/SmartDashboard/default_height":
            change_default_height(value)
            break;


    }
}

function change_default_height(height) {
    if (height == "UPPER_SCALE") { height = "H4" }
    else if (height === "BALANCED_SCALE") { height = "H3" }
    else if (height === "LOWER_SCALE") { height = "H2" }
    else if (height === "SWITCH_HEIGHT") { height = "H1" }

    $("#" + current_height).addClass("green")
    $("#" + height).removeClass("green").addClass("light-green")

    current_height = height

}

function set_map_locations() {
    
}

function resetVideo() {

    if (camera === 1) {
        $("#camera").removeAttr("src").attr("src", cameraStream1);

    }
}

function resetGyro() {

    offsetGyro = currentGyro;
    rotateCompass(currentGyro + Math.PI)
}


function onNetworkTablesConnection(connected) {
    // TODO
    if (connected) {

    } else {

    }
}

function onRobotConnection(connected) {
    if (connected) {
        $("#Connection").text("Connected");
        $("#Connection").css({
            "color": "lime"
        });
    } else {
        $("#Connection").text("Disconnected");
        $("#Connection").css({
            "color": "red"
        });

    }
}
function remove_form() {
    $(".checklist-div").hide()
    $(".inital-hide").show()
}

function rotateCompass(heading) {
    heading = heading - offsetGyro;
    heading = Math.PI - heading; // gyro is the wrong way around
    var robot = document.getElementById("compass");
    robot.style.transform = "rotate(" + heading + "rad)";

}

function startTimer() {
    if (intervalTimer == null) {
        intervalTimer = setInterval(timer, 1000)
    }
}

function resetTimer() {2
    clearInterval(intervalTimer);
    timerFrom = 135;
    intervalTimer = null;
    document.getElementById("cycleTimer").innerHTML = "135";
}

function timer() {
    if (timerCounter) {
        timerFrom = timerFrom - 1
        if (timerFrom <= 0) {
            document.getElementById("cycleTimer").innerHTML = "";
            $("#cycleTimer").text("GOOD JOB!");
            $("#cycleTimer").css("font-size", "425%")
            $("#cycleTimer").css("color", "#4CAF50")
            $("#cycleTimer").toggleClass("blink");
        } else if (timerFrom < 10) {
            document.getElementById("cycleTimer").innerHTML = "00" + timerFrom;
        } else if (timerFrom < 100) {
            document.getElementById("cycleTimer").innerHTML = "0" + timerFrom;
        } else {
            document.getElementById("cycleTimer").innerHTML = timerFrom;
        }
    }
}
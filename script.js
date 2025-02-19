// Canvas and Context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const player = document.getElementById('player');

let carX = 200; // Initial horizontal position of the car
const carSpeed = 5; // Speed for left/right movement
const roadWidth = 400; // Width of the road (adjust as per your road width)

const carElement = document.querySelector('.car');


// Game State
let car = { x: 375, y: 400, width: 50, height: 80 };
let road = { y1: 0, y2: -canvas.height, speed: 0 };
let trafficLight = { state: "red", timer: 0 };
let score = 0;
let gameRunning = false;
let lastScoreEvent = null; // Tracks the last scoring event
let currentLevel = 1; // Start with Level 1
let levelsUnlocked = [true, false, false]; // Unlock status for each level
let speed = 0; // Initial speed
let position = 50; // Horizontal position (in %)
let timeElapsed = 0; // Timer in seconds

const speedDisplay = document.getElementById('speed');
const timeElapsedDisplay = document.getElementById('time-elapsed');

// Time Elapsed Display
setInterval(() => {
    timeElapsed++;
    timeElapsedDisplay.textContent = timeElapsed; // Update time on the screen
}, 1000); // Increment time every second


// Speed Update - Dynamically based on game state (or player movement)
setInterval(() => {
    speedDisplay.textContent = speed.toFixed(1); // Convert speed to 1 decimal place if needed
}, 100); // Update every 100ms



// Add a click event listener to handle level selection:
// Update the level display and add event listeners

function setupLevelDisplay() {

    // Your existing game logic, including level initialization

    // Updated JS for level hover and click behavior
    const levelsContainer = document.getElementById("levels");
    const levelButtons = levelsContainer.querySelectorAll(".level");

    levelButtons.forEach((button, index) => {
        button.addEventListener("mouseenter", () => {
            if (button.classList.contains("locked")) {
                button.style.cursor = "not-allowed";
                const warningMessage = document.createElement("div");
                const rect = button.getBoundingClientRect();


                warningMessage.textContent = "Score 5 in Level 1 to unlock!";
                warningMessage.id = "hoverWarning";
                warningMessage.style.position = "absolute";
                warningMessage.style.top = `${rect.top - 30}px`;
                warningMessage.style.left = `${rect.left}px`;
                warningMessage.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
                warningMessage.style.color = "white";
                warningMessage.style.padding = "5px 10px";
                warningMessage.style.borderRadius = "5px";
                warningMessage.style.fontSize = "14px";
                warningMessage.style.zIndex = "1000";
                document.body.appendChild(warningMessage);
            }

            
        });

        button.addEventListener("mouseleave", () => {
            const warningMessage = document.getElementById("hoverWarning");
            if (warningMessage) {
                document.body.removeChild(warningMessage);
            }
        });

        button.addEventListener("click", () => {
            if (button.classList.contains("locked")) {
                alert("You need to score 5 points in Level 1 to unlock this level!");
            } else {
                alert(`Starting Level ${index + 1}`);
                currentLevel = index + 1;
                initializeLevel(currentLevel); // Function to handle level initialization
            }
        });
    });
        if (!levelsUnlocked[index]) {
            button.classList.add("locked");
        } else {
            button.classList.remove("locked");
        }

}

document.addEventListener("DOMContentLoaded", () => {
    const levelButtons = document.querySelectorAll(".level");
    const errorMessage = document.getElementById("error-message");

    levelButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (button.classList.contains("locked")) {
                errorMessage.style.display = "block";
                setTimeout(() => {
                    errorMessage.style.display = "none";
                }, 2000); // Hide message after 2 seconds
            } else {
                // Logic for unlocked levels
                alert(`Starting ${button.textContent}`);
            }
        });
    });
});


// Show Hover Message
function showHoverMessage(level) {
    const hoverMessage = document.getElementById("hoverMessage");
    hoverMessage.textContent = `You need a score of 5 to unlock Level ${level}`;
    hoverMessage.style.display = "block";
}

// Hide Hover Message
function hideHoverMessage() {
    const hoverMessage = document.getElementById("hoverMessage");
    hoverMessage.style.display = "none";
}


// Call setupLevelDisplay during initialization
document.addEventListener("DOMContentLoaded", () => {
    setupLevelDisplay();
});

    

// Key Handling
let keys = {};
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));
// Correct player movement
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        moveCarLeft();
    } else if (event.key === 'ArrowRight') {
        moveCarRight();
    }
});


function moveCarLeft() {
    if (carX > 0) { // Ensure the car stays within the road bounds
        carX -= carSpeed;
        updateCarPosition();
    }
}

// Move the car right
function moveCarRight() {
    if (carX < roadWidth - carElement.offsetWidth) { // Prevent moving out of the road
        carX += carSpeed;
        updateCarPosition();
    }
}

// Update the car's position on the screen
function updateCarPosition() {
    carElement.style.left = carX + 'px';
}

// Buttons
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');

// Start Game
startBtn.addEventListener('click', () => {
    gameRunning = true;
});

// Pause Game
pauseBtn.addEventListener('click', () => {
    gameRunning = false;
});

// Fullscreen Mode
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// Draw Road
function drawRoad() {
    ctx.fillStyle = "#333";
    ctx.fillRect(100, road.y1, 600, canvas.height);
    ctx.fillRect(100, road.y2, 600, canvas.height);

    // Lane Markings
    ctx.fillStyle = "#fff";
    for (let i = 0; i < canvas.height; i += 50) {
        ctx.fillRect(395, road.y1 + i, 10, 30);
        ctx.fillRect(395, road.y2 + i, 10, 30);
    }

    // Update Road Position
    if (gameRunning && road.speed > 0) {
        road.y1 += road.speed;
        road.y2 += road.speed;

        // Loop Road
        if (road.y1 >= canvas.height) road.y1 = -canvas.height;
        if (road.y2 >= canvas.height) road.y2 = -canvas.height;
    }
}

// draw car
function drawCar() {
    // Car Body
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(car.x, car.y + car.height); 
    ctx.lineTo(car.x + car.width * 0.1, car.y); // Slight curve at front
    ctx.lineTo(car.x + car.width * 0.9, car.y); // Slight curve at rear
    ctx.lineTo(car.x + car.width, car.y + car.height); 
    ctx.closePath();
    ctx.fill();
  
    // Roof
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(car.x + car.width * 0.1, car.y); 
    ctx.lineTo(car.x + car.width * 0.9, car.y); 
    ctx.lineTo(car.x + car.width * 0.9, car.y + car.height * 0.4); // Sloped roof
    ctx.lineTo(car.x + car.width * 0.1, car.y + car.height * 0.4); 
    ctx.closePath();
    ctx.fill();
  
    // Windshield
    ctx.fillStyle = "gray";
    ctx.beginPath();
    ctx.moveTo(car.x + car.width * 0.1, car.y); 
    ctx.lineTo(car.x + car.width * 0.9, car.y); 
    ctx.lineTo(car.x + car.width * 0.5, car.y + car.height * 0.15); // More pointed windshield
    ctx.closePath();
    ctx.fill();
  
    // Hood Scoop
    ctx.fillStyle = "black";
    ctx.fillRect(car.x + car.width * 0.4, car.y, car.width * 0.2, car.height * 0.1);
  
    // Wheels
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(car.x + car.width * 0.25, car.y + car.height * 0.8, car.width * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(car.x + car.width * 0.75, car.y + car.height * 0.8, car.width * 0.15, 0, Math.PI * 2);
    ctx.fill();
  
    // Side Windows (Simplified)
    ctx.fillStyle = "gray";
    ctx.fillRect(car.x + car.width * 0.2, car.y + car.height * 0.2, car.width * 0.6, car.height * 0.4); 
  
  }
  
 


// Draw Traffic Light
function drawTrafficLight() {
    ctx.fillStyle = "#444";
    ctx.fillRect(700, 50, 50, 150);

    // Lights
    ctx.fillStyle = trafficLight.state === "red" ? "red" : "#550000";
    ctx.beginPath();
    ctx.arc(725, 80, 15, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = trafficLight.state === "yellow" ? "yellow" : "#554400";
    ctx.beginPath();
    ctx.arc(725, 125, 15, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = trafficLight.state === "green" ? "green" : "#005500";
    ctx.beginPath();
    ctx.arc(725, 170, 15, 0, 2 * Math.PI);
    ctx.fill();
}

// Traffic Light Logic
function updateTrafficLight() {
    trafficLight.timer++;
    if (trafficLight.timer > 200) {
        if (trafficLight.state === "red") trafficLight.state = "green";
        else if (trafficLight.state === "green") trafficLight.state = "yellow";
        else if (trafficLight.state === "yellow") trafficLight.state = "red";
        trafficLight.timer = 0;
    }
}

// Handle Arrow Keys
function handleKeys() {
    if (keys["ArrowUp"]) {
        road.speed = 2; // Accelerate
    } else if (keys["ArrowDown"]) {
        road.speed = 0; // Decelerate
    }
}

// Define a function to reset the game for a new level:
function startLevel(level) {
    currentLevel = level;

    // Reset game state
    car = { x: 375, y: 400, width: 50, height: 80 };
    road = { y1: 0, y2: -canvas.height, speed: 0 };
    trafficLight = { state: "red", timer: 0 };
    score = 0;
    gameRunning = true;

    // Update Score Display
    document.getElementById("score").textContent = score;

    alert(`Level ${level} started! Good luck!`);
}


// Update Score
function updateScore(points, reason) {
    if (lastScoreEvent === reason && reason !== "resetOnGreen") return;

    score += points;
    lastScoreEvent = reason;

    // Play Sound
    playSound(points);

    // Flash Feedback
    const flash = document.createElement("div");
    flash.textContent = points > 0 ? `+${points}` : `${points}`;
    flash.style.position = "absolute";
    flash.style.top = "50%";
    flash.style.left = "50%";
    flash.style.transform = "translate(-50%, -50%)";
    flash.style.color = points > 0 ? "green" : "red";
    flash.style.fontSize = "48px";
    flash.style.fontWeight = "bold";
    flash.style.opacity = 1;
    flash.style.transition = "opacity 1s ease-out";
    document.body.appendChild(flash);

    setTimeout(() => {
        flash.style.opacity = 0;
        setTimeout(() => document.body.removeChild(flash), 1000);
    }, 1000);

    // Update Total Score
    document.getElementById("score").textContent = score;

    // Check for Level Unlock
    if (currentLevel === 1 && score >= 5 && !levelsUnlocked[1]) {
        gameRunning = false; // Stop Level 1
        alert("Congratulations! You can now proceed to Level 2.");
        levelsUnlocked[1] = true;
        setupLevelDisplay(); // Refresh level display
    }
    if (currentLevel === 2 && score >= 5 && !levelsUnlocked[2]) {
        gameRunning = false; // Stop Level 2
        alert("Congratulations! You can now proceed to Level 3.");
        levelsUnlocked[2] = true;
        setupLevelDisplay(); // Refresh level display
    }
    
}



// Check Scoring Events
function checkEvents() {
    if (road.speed === 0 && trafficLight.state === "red") {
        updateScore(1, "stoppedAtRedLight");
    } else if (road.speed > 0 && trafficLight.state === "red") {
        updateScore(-1, "ranRedLight");
    }
    carElement.style.left = carX + 'px';
    speedDisplay.textContent = speed.toFixed(1);
}

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRoad();
    drawCar();
    drawTrafficLight();
    updateTrafficLight();
    handleKeys();
    if (gameRunning) checkEvents();
    requestAnimationFrame(gameLoop);
}

// Start the Game Loop
gameLoop();
// Additional State
let redLightPenaltyIssued = false; // Tracks if a penalty for the red light has been issued
let hasStoppedAtRed = false; // Tracks if the player has stopped at the red light


// Check Scoring Events
function checkEvents() {
    if (trafficLight.state === "red") {
        if (road.speed === 0 && !hasStoppedAtRed) {
            // Award points for stopping at the red light
            updateScore(1, "stoppedAtRedLight");
            hasStoppedAtRed = true; // Mark that the car has stopped
            redLightPenaltyIssued = false; // Reset penalty as player stopped
        } else if (road.speed > 0 && !redLightPenaltyIssued) {
            // Deduct points for running the red light
            updateScore(-1, "ranRedLight");
            redLightPenaltyIssued = true; // Prevent multiple penalties
            hasStoppedAtRed = false; // Reset stop flag
        }
    } else {
        // Reset flags when light is not red
        redLightPenaltyIssued = false;
        hasStoppedAtRed = false;
    }

    // Allow repeat scoring for stopping at a red light
    if (trafficLight.state !== "red") {
        lastScoreEvent = null;
    }
}

// Load Sounds
const plusOneSound = new Audio('plus1.mp3');
const minusOneSound = new Audio('minus1.mp3');

// Play Sound Function
function playSound(points) {
    if (points > 0) {
        plusOneSound.play();
    } else if (points < 0) {
        minusOneSound.play();
    }
}

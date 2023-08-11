// Define the Reel class for handling individual reels
class Reel {
    // Constructor for the identifier and callback
    constructor(id, callback) {
        // Identifier for the reel
        this.id = id;
        // Array of images
        this.images = ['orange.png', 'lemon.png', 'grape.png', 'diamond.png', 'cherry.png', 'bell.png', '7.jpg', ];
        // Getting the 'reel*' id from the html doc
        this.element = document.getElementById(`reel${id}`);
        // Getting the 'img*' id from the html doc
        this.imageElement = document.getElementById(`img${id}`);
        // Callback function to execute after spinning completes
        this.callback = callback;
    }

    // Method to spin the reel
    spin() {
        // creating a variable for a random index, Math.floor rounds fdown to the nearest integer, and Math.random generates a random number and chooses this from the selection (or lenght/amount) of images
        const randomIndex = Math.floor(Math.random() * this.images.length);
        // Creates a variable to locate the images in their folder and assigns the images to the randomIndex above
        const imagePath = './assets/images/' + this.images[randomIndex];
        // Create a new load event listener and store it in a variable
        const loadListener = () => {
            // Removing the listener after it has been triggered ensures the callback is only called once per spin (as I was having errors with repeated call backs)
            this.imageElement.removeEventListener('load', loadListener);
            // Call the callback once
            this.callback();
        };
        // Add a 'load' event listener to the image element to track when the image is loaded
        this.imageElement.addEventListener('load', this.callback);
        // Set the image source
        this.imageElement.src = imagePath;
    }
}

// Define the SlotMachine class for managing the game
class SlotMachine {
    // constructor for the level setting of the game, easy/med/hard
    constructor(level) {
        // Initializes properties such as arrays, the level of the game, moves, maxMoves, points to win, then connects JS elements to their HTML counter-parts
        this.reels = [];
        this.level = level;
        this.moves = 0;
        this.maxMoves = this.getMaxMoves();
        this.pointsToWin = this.getPointsToWin();
        this.points = 0;
        this.movesDisplay = document.getElementById('moves-display')
        this.pointsDisplay = document.getElementById('points-display');
        this.spinButton = document.getElementById('spin-button');
        this.resetButton = document.getElementById('reset-button');
        this.levelSelect = document.getElementById('level-select');

        // Set up event listeners for the spin button, reset button, and the level select
        this.spinButton.addEventListener('click', this.spin.bind(this));
        this.resetButton.addEventListener('click', this.resetGameNoMsg.bind(this));
        this.resetButton.addEventListener('click', this.resetGame.bind(this));
        this.levelSelect.addEventListener('change', this.updateLevel.bind(this));

        // Set default level and initialize reels
        this.levelSelect.value = this.level;
        this.setupReels();
        this.updatePointsDisplay();
        this.updateMovesDisplay();

    }
    showPopup(message) {
        const popup = document.getElementById('custom-popup');
        const popupMessage = document.getElementById('popup-message');
        popupMessage.innerText = message;
        popup.style.display = 'flex';

        const popupOkayButton = document.getElementById('popup-okay');
        popupOkayButton.addEventListener('click', this.hidePopup.bind(this));
    }

    hidePopup() {
        const popup = document.getElementById('custom-popup');
        popup.style.display = 'none';
    }
    // Method to set up the reels
    setupReels() {
        // for loop for setting up 3 instances for the 3 reels
        for (let i = 1; i <= 3; i++) {
            // Creates a reel instance
            const reel = new Reel(i, this.spinCompleteCallback.bind(this));
            // Adds the reel to the reels array
            this.reels.push(reel);
        }
    }

    // Method to calculate the maximum allowed moves based on the level
    getMaxMoves() {
        // using a switch statement to determine the amount of moves a user gets depending on the level they selected
        switch (this.level) {
            case 'easy':
                return 20;
            case 'medium':
                return 15;
            case 'hard':
                return 10;
            default:
                return 15;
        }
    }

    // Method to calculate points required to win based on the level
    getPointsToWin() {
        // using a switch statement for the different levels available to play the game
        switch (this.level) {
            case 'easy':
                return 100;
            case 'medium':
                return 200;
            case 'hard':
                return 400;
            default:
                return 200;
        }
    }

    // Method to update the points display on the screen
    updatePointsDisplay() {
        this.pointsDisplay.innerText = 'Points: ' + this.points;
    }
    updateMovesDisplay() {
        const movesDisplay = document.getElementById('moves-display');
        movesDisplay.innerText = 'Moves: ' + this.moves;
    }
    // Method to handle the spin button click
    spin() {
        // Spin each reel
        this.reels.forEach(reel => reel.spin());
        // Increment moves counter
        this.moves++;
        this.updateMovesDisplay()
        // Check if the game is still active
        if (this.moves <= this.maxMoves) {
            // Check for win or lose condition
            this.checkWinCondition();
        } else {
            // ends the game
            this.endGame();
        }
    }
    // Method to end the game
    endGame() {
        // if statement: if the points a user has is less than or equal to the points needed to win an alert is displayed
        if (this.points >= this.pointsToWin) {
            // alert for winning the game and then displaying the users points and moves
            this.showPopup(`You win! You reached ${this.pointsToWin} points within ${this.maxMoves} moves.`);
        }
        // else statement to handle the user loosinig the game
        else {
            // an alreat is displayed telling the user they lost and their points/moves is also displayed 
            this.showPopup(`You lose! You did not reach ${this.pointsToWin} points within ${this.maxMoves} moves.`);
        }
        // resets the game
        this.resetGameNoMsg();
    }

    // Callback function to execute after spinning completes
    spinCompleteCallback() {
        // if statement to check for a win condition after every move
        if (this.moves > 0) {
            // Check for a win condition after all reels have stopped spinning
            this.checkWinCondition();
        }
    }

    // Method to check for a win condition
    checkWinCondition() {
        // Get image paths from the reels
        const imagePaths = this.reels.map(reel => reel.imageElement.src);
        // If statement to check if all thee images match and if they do, the user gets 100 points, the points displayed is updated, a pop tells the user they matched the images 
        if (imagePaths[0] === imagePaths[1] && imagePaths[1] === imagePaths[2]) {
            // Award points for a three-of-a-kind win
            this.points += 100;
            // This updates the points displayed on the screem
            this.updatePointsDisplay();
            //  a pop tells the user they matched the images 
            this.showPopup('Congratulations! You have a three-of-a-kind win! Points: ' + this.points);
            // If statement to see if the points gained are greater than or equalt to the points to win AND if the moves made are less than or equal to the max moves to win
            if (this.points >= this.pointsToWin && this.moves <= this.maxMoves) {
                // if points and moves are met a popup tells the user they won
                this.showPopup(`You win! You reached ${this.pointsToWin} points within ${this.maxMoves} moves.`);
            }
            // else/if the moves taken are equal to the max moves then the user looses
            else if (this.moves === this.maxMoves) {
                this.showPopup(`You lose! You did not reach ${this.pointsToWin} points within ${this.maxMoves} moves.`);
                // Reset the game
                this.resetGameNoMsg();
            }
        }
    }
    // Method to handle the reset button click
    resetGameNoMsg() {
        // Reset the game if the user confirms
        this.points = 0;
        this.moves = 0;
        this.updateMovesDisplay();
        this.updatePointsDisplay();
    }

    // Method to handle the reset button click
    resetGame() {
        // Show a confirmation popup before resetting the game
        this.showPopup("Are you sure you want to reset the game?");
        const popupOkayButton = document.getElementById("popup-okay");
        popupOkayButton.addEventListener("click", () => {
            this.hidePopup();
            // Reset the game if the user confirms
            this.points = 0;
            this.moves = 0;
            this.updateMovesDisplay();
            this.updatePointsDisplay();
        });
    }
    // Method to update the selected game level
    updateLevel() {
        const newLevel = this.levelSelect.value; // Get the selected level from the dropdown
        this.level = newLevel; // Update the current level
        this.maxMoves = this.getMaxMoves(); // Update maximum allowed moves
        this.pointsToWin = this.getPointsToWin(); // Update points required to win
    }
}

// Create a new instance of the SlotMachine class with the default level 'medium'
const slotMachine = new SlotMachine('medium');
// Define the Reel class for handling individual reels
class Reel {
    // Constructor for the identifier and callback
    constructor(id, callback) {
        // Identifier for the reel
        this.id = id;
        // array of images
        this.images = ['orange.png', 'lemon.png', 'grape.png', 'diamond.png', 'cherry.png', 'bell.png', '7.jpg', ];
        // Getting the 'reel*' id from the html doc
        this.element = document.getElementById(`reel${id}`);
        // Getting the 'img*' id from the html doc
        this.imageElement = document.getElementById(`img${id}`);
        // Callback function to execute when spinning has completed
        this.callback = callback;
    }

    // Method to spin the reel
    spin() {
        // creating a variable for a random index, Math.floor rounds fdown to the nearest integer, and Math.random generates a random number and chooses this from the selection (or lenght/amount) of images
        const randomIndex = Math.floor(Math.random() * this.images.length);
        // Creates a variable to locate the images in their folder and assigns the images to the randomIndex above
        const imagePath = './assets/images/' + this.images[randomIndex];
        // This sets the image source
        this.imageElement.src = imagePath;
        // Add a 'load' event listener to the image element to track when the image is loaded
        this.imageElement.addEventListener('load', this.callback);
    }
}

// Define the SlotMachine class for managing the game
class SlotMachine {
    constructor(level) {
        // Initializes properties such as arrays, the level of the game, moves, maxMoves, points to win, then connects JS elements to their HTML counter-parts
        this.reels = [];
        this.level = level;
        this.moves = 0;
        this.maxMoves = this.getMaxMoves();
        this.pointsToWin = this.getPointsToWin();
        this.points = 0;
        this.pointsDisplay = document.getElementById('points-display');
        this.spinButton = document.getElementById('spin-button');
        this.resetButton = document.getElementById('reset-button');
        this.levelSelect = document.getElementById('level-select');

        // Set up event listeners for the spin button, reset button, and the level select
        this.spinButton.addEventListener('click', this.spin.bind(this));
        this.resetButton.addEventListener('click', this.resetGame.bind(this));
        this.levelSelect.addEventListener('change', this.updateLevel.bind(this));

        // Set default level and initialize reels
        this.levelSelect.value = this.level;
        this.setupReels();
        this.updatePointsDisplay();
    }

    // Method to set up the reels
    setupReels() {
        for (let i = 1; i <= 3; i++) {
            const reel = new Reel(i, this.spinCompleteCallback.bind(this)); // Create a new Reel instance
            this.reels.push(reel); // Add the reel to the reels array
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

    // Method to handle the spin button click
    spin() {
        // Spin each reel
        this.reels.forEach(reel => reel.spin());
        // Increment moves counter
        this.moves++;

        // Check if the game is still active
        if (this.moves <= this.maxMoves) {
            // Check for win or lose condition
            this.checkWinCondition();
        }
        // otherwise it ends the game
        else {
            this.endGame();
        }
    }
    // Method to end the game
    endGame() {
        // if statement: if the points a uswer has is less than or equal to the points needed to win an alert is displayed
        if (this.points >= this.pointsToWin) {
            // alert for winning the game and then displaying the users points and moves
            alert(`You win! You reached ${this.pointsToWin} points within ${this.maxMoves} moves.`);
        }
        // else statement to handle the user loosinig the game
        else {
            // an alreat is displayed telling the user they lost and their points/moves is also displayed 
            alert(`You lose! You did not reach ${this.pointsToWin} points within ${this.maxMoves} moves.`);
        }
        // this resets the game
        this.resetGame();
    }
    // Method to reset the game
    resetGame() {
        this.points = 0;
        this.moves = 0;
        this.updatePointsDisplay();
    }

}
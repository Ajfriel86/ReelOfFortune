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
}
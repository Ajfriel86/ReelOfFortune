/* jshint esversion: 8 */

// Define the Reel class for handling individual reels
class Reel {
    // Constructor for the identifier and callback
    constructor(id, callback) {
        // Identifier for the reel
        this.id = id;
        // This is hte default image that will be displayed at the start of a game or when the game is reset
        this.defaultImage = 'x.png'
        // This is an Array of images to be used for the reels
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
        // 
        this.imageElement.src = '/assets/images/' + this.defaultImage;
        // creating a variable for a random index, Math.floor rounds fdown to the nearest integer, and Math.random generates a random number and chooses this from the selection (or lenght/amount) of images
        const randomIndex = Math.floor(Math.random() * this.images.length);
        // Creates a variable to locate the images in their folder and assigns the images to the randomIndex above
        const imagePath = '/assets/images/' + this.images[randomIndex];
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
        // Initializes an empty array. This array is intended to store instances of the Reel class.
        this.level = level;
        // this is an empty array that is assigned to the property reels and is used to initialize and store the instance of the Reel class 
        this.reels = [];
        // This sets up all 3 reels for the game and will help to display the default image
        this.setupReels();
        // This is used to track the number of moves a user had made, starting at 0
        this.moves = 0;
        // This represents the max number of moves a player can take depending on the level of the game selected
        this.maxMoves = this.getMaxMoves();
        // This is used to track the number of points a user needs in order to win the game, starting at 0
        this.points = 0;
        // this tracks the number of completed spins
        this.completedSpins = 0;
        // This represents the max number of points needed for a user to win depending on the level of the game selcted
        this.pointsToWin = this.getPointsToWin();
        // This retrieves the HTML element moves-display and assigns it to the property movesDispaly 
        this.movesDisplay = document.getElementById('moves-display')
        // // This retrieves the HTML element points-display and assigns it to the porperty pointsDisplay
        this.pointsDisplay = document.getElementById('points-display');
        // // This retrieves the HTML element spin-button and assigns it to the property spinButton
        this.spinButton = document.getElementById('spin-button');
        // This retrieves the HTML element rest-button and assigns it to the property restButton
        this.resetButton = document.getElementById('reset-button');
        // Greying out hte reset button if its not in use
        this.resetButton.disabled = true;
        // Add the disabled-button class
        this.resetButton.classList.add('disabled-button');
        // This retrieves the HTML element level-select and assigns it the proerpty levelSelect
        this.levelSelect = document.getElementById('level-select');

        // Set up event listeners for the UI elements
        // This refers to the HTML element spin-button, the event is listening for the click on this button and will bind that click to the JS proerpty spinButton
        this.spinButton.addEventListener('click', this.spin.bind(this));
        // This refers to the HTML element reset-button, the event is listening for the click on this button and will bind that click to the JS proerpty resetButton
        this.resetButton.addEventListener('click', this.resetGameNoMsg.bind(this));
        // This refers to the HTML element reset-button, the event is listening for the click on this button and will bind that click to the JS proerpty resetButton
        this.resetButton.addEventListener('click', this.resetGame.bind(this));
        // This refers to the HTML element level-select, the event is listening for the click on this button and will bind that click to the JS proerpty levelSelect
        this.levelSelect.addEventListener('change', this.updateLevel.bind(this));

        this.spinButton.addEventListener('click', this.enableResetButton.bind(this));

        // Set default level and initialize reels
        // This is in reference to the selected level by the user, this will set the value picked by the user and then apply that to the game
        this.levelSelect.value = this.level;
        // This calls the method updatePointsDisplay, which will update the on screen value of the points earned by the user
        this.updatePointsDisplay();
        // This calls the method updateMovesDispaly, which will update the on screen display of moves taken by a user
        this.updateMovesDisplay();

        const homeButton = document.getElementById('home-button');
        const contactButton = document.getElementById('contact-button');
        // Add event listeners to the home and contact buttons
        homeButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default navigation behavior
            const confirmation = confirm("Do you wish to navigate away from this page?")

            if (confirmation) {
                // If the user confirms, navigate to the home page
                window.location.href = "https://ajfriel86.github.io/ReelOfFortune/index.html"; // Replace with your actual home page URL
            } else {
                // do nothing
            }
        });

        contactButton.addEventListener('click', (event) => {
            const confirmation = confirm("Do you wish to navigate away from this page?")

            if (confirmation) {
                // If the user confirms, navigate to the home page
                window.location.href = "https://ajfriel86.github.io/ReelOfFortune/contact.html"; // Replace with your actual home page URL
            } else {
                // do nothing
            }
        });

    }
    // Method for Custom popup messages instead of alrets
    showPopup(message) {
        // This retrieves the HTML element custom-popup and assigns it to the local variable popup 
        const popup = document.getElementById('custom-popup');
        // This retrieves the HTML element popup-message and assigns it to the local variable popupMessage
        const popupMessage = document.getElementById('popup-message');
        // This thats the popupMessage varible, and updates the text within it, the 'messgae' is used as a variable to store the current message being dispalyed
        popupMessage.innerText = message;
        // This assigns the CSS property of 'flex' to the popup window
        popup.style.display = 'flex';
        // This refers to the HTML element popup-okay, which is the button on the popup, and assigns it to the local variable popupOkayButton
        const popupOkayButton = document.getElementById('popup-okay');
        // This then takes the popupOkayButton and the event listens for the click that will then bind this JS proeproty to the HTML elemet counterpart  
        popupOkayButton.addEventListener('click', this.hidePopup.bind(this));
    }
    // Method to hide the pop up
    hidePopup() {
        // This refers to the HTML element custom-popup, which is the button on the popup, and assigns it to the local variable popup
        const popup = document.getElementById('custom-popup');
        // This assigns the CSS property of 'none' to the popup window, in order to hide it
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
            // sets the default image on each reel
            reel.imageElement.src = '/assets/images/' + reel.defaultImage;
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
        // this takes the points the user has earned and the displays them
        this.pointsDisplay.innerText = 'Points: ' + this.points;
    }

    // Method to update the moves displayed on screen
    updateMovesDisplay() {
        // This refers to the HTML element moves-display and assigns it ot the local variable movesDisaply
        const movesDisplay = document.getElementById('moves-display');
        // This then takes the JS property movesDisplay and displays the amount of moves taken by the user on screen 
        movesDisplay.innerText = 'Moves: ' + this.moves;
    }
    // Method to handle the spin button click
    spin() {
        // Spin each reel
        this.reels.forEach(reel => reel.spin());
        // Increment moves counter
        this.moves++;
        // Update the moves
        this.updateMovesDisplay()
        // Check if the game is still active
        if (this.moves <= this.maxMoves) {
            // Check for win or lose condition
            this.checkWinCondition();
        } else {
            // Ends the game
            this.endGame();
        }
    }
    // Method to end the game
    endGame() {
        // If statement: if the points a user has is less than or equal to the points needed to win an alert is displayed
        if (this.points >= this.pointsToWin) {
            // alert for winning the game and then displaying the users points and moves
            this.showPopup(`You win! You reached ${this.pointsToWin} points within ${this.maxMoves} moves.`);
        }
        // Else statement to handle the user loosinig the game
        else {
            // An alreat is displayed telling the user they lost and their points/moves is also displayed 
            this.showPopup(`You lose! You did not reach ${this.pointsToWin} points within ${this.maxMoves} moves.`);
        }
        // Resets the game without asking the user if they want to rest the game
        this.resetGameNoMsg();
    }

    // Callback function to execute after spinning completes
    spinCompleteCallback() {
        // THis increases the spin count
        this.completedSpins++;
        // If statement to check for a win condition after every move
        if (this.moves > 0) {
            console.log("Checking win condition1");
            // Check for a win condition after all reels have stopped spinning
            this.checkWinCondition();
        }
        // Check to see if all reels have finished spinning
        if (this.completedSpins === this.reels.length) {
            // Reset completed spins count
            this.completedSpins = 0;
            // Check for a win condition after all reels have stopped spinning
            this.checkWinCondition();
        }
    }

    // Method to check for a win condition
    checkWinCondition() {
        console.log("Checking win condition2");
        // Get image paths from the reels
        const imagePaths = this.reels.map(reel => reel.imageElement.src);
        // If statement to check if all thee images match and if they do, the user gets 100 points, the points displayed is updated, a pop tells the user they matched the images 
        // It also states that if image[0] contains the default image that it is not a match
        if (imagePaths[0] === imagePaths[1] && imagePaths[1] === imagePaths[2] && !imagePaths[0].includes('x.png')) {
            // Award points for a three-of-a-kind win
            this.points += 100;
            // This updates the points displayed on the screem
            this.updatePointsDisplay();
            //  a pop tells the user they matched the images 
            this.showPopup('Congratulations! You have a three-of-a-kind win! Points: ' + this.points);
            // If statement to see if the points gained are greater than or equalt to the points to win AND if the moves made are less than or equal to the max moves to win
            if (this.points >= this.pointsToWin) {
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
    // Method to enable the reset button when the spin button is clicked
    enableResetButton() {
        // Enable the reset button
        this.resetButton.disabled = false;
        // Remove the 'disabled-button' class
        this.resetButton.classList.remove('disabled-button');
    }
    // Method to handle a reset with no confirmation
    resetGameNoMsg() {
        // Reset the games points & moves if the user confirms
        // This sets the points back to zero
        this.points = 0;
        // This sets the moves back to zero
        this.moves = 0;
        // This updates the moves on screen to reflect them being reset to zero
        this.updateMovesDisplay();
        // This updates the points on screen to reflect them being reset to zero
        this.updatePointsDisplay();
        this.resetButton.disabled = true;
        this.resetButton.classList.add('disabled-button');
        this.reels.forEach(reel => {
            reel.imageElement.src = '/assets/images/' + reel.defaultImage;
        });
    }

    // Method to handle the reset button click with confirmation
    resetGame() {
        // Show a confirmation popup before resetting the game
        this.showPopup("Are you sure you want to reset the game?");
        // This refers to the HTML elemenet popup-okay, which assigns it othe JS property popupOkayButton
        const popupOkayButton = document.getElementById("popup-okay");
        // The event listener then listens for the button click
        popupOkayButton.addEventListener("click", () => {
            // The popup is then hidden and the game resets
            this.hidePopup();
            // Reset the games points & moves if the user confirms
            // This sets the points back to zero
            this.points = 0;
            // This sets the moves back to zero
            this.moves = 0;
            // This updates the moves on screen to reflect them being reset to zero
            this.updateMovesDisplay();
            // This updates the points on screen to reflect them being reset to zero
            this.updatePointsDisplay();
            // Grey's out the reset button if the game is not played or just reset recently
            this.resetButton.disabled = true;
            this.resetButton.classList.add('disabled-button');
        });

    }
    // Method to update the selected game level
    updateLevel() {
        // Get the selected level from the dropdown
        const newLevel = this.levelSelect.value;
        // Update the current level
        this.level = newLevel;
        // Update maximum allowed moves
        this.maxMoves = this.getMaxMoves();
        // Update points required to win 
        this.pointsToWin = this.getPointsToWin();
    }


}

// Create an instance of the SlotMachine class with the default level 'medium'
const slotMachine = new SlotMachine('medium');
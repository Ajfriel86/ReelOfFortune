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
        this.imageElement.src = 'assets/images/' + this.defaultImage;
        // creating a variable for a random index, Math.floor rounds fdown to the nearest integer, and Math.random generates a random number and chooses this from the selection (or lenght/amount) of images
        const randomIndex = Math.floor(Math.random() * this.images.length);
        // Creates a variable to locate the images in their folder and assigns the images to the randomIndex above
        const imagePath = 'assets/images/' + this.images[randomIndex];
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

    // Method to stop the spinning of the reel
    stopSpin() {
        // Remove the 'load' event listener from the image element
        this.imageElement.removeEventListener('load', this.callback);
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
        // This is an event listener for the level-select drop down menuand it listens for the user changing the level and then it binds it to the updateLevel() method and ensure it is called 
        this.levelSelect.addEventListener('change', this.updateLevel.bind(this));
        // This refers to the HTML element spin-button, the event is listening for the click on this button and will bind that click to the JS proerpty spinButton
        this.spinButton.addEventListener('click', this.spin.bind(this));

        // This adds an event listener to the click of the spin-button in the html doc, and then binds it to the reset button to enable it, as it is grayed out other wise
        this.spinButton.addEventListener('click', this.enableResetButton.bind(this));
        // This adds an event listener to the click of the reset-button in the html doc, it then uses an event object and an arrow function to define its behavior, in this case event.preventDefault(); 
        this.resetButton.addEventListener('click', (event) => {
            // When the reset button is clicked  the game will reset but the event will technically pause the game with the event.preventDefault(); until the user selects yes/no from the popup
            this.resetGame(event);
        });
        // This is in reference to the selected level by the user, this will set the value picked by the user and then apply that to the game
        this.levelSelect.value = this.level;
        // This calls the method updatePointsDisplay, which will update the on screen value of the points earned by the user
        this.updatePointsDisplay();
        // This calls the method updateMovesDispaly, which will update the on screen display of moves taken by a user
        this.updateMovesDisplay();
        // This adds a variable that is then assigned to the html document id called home-button, whcih is on the nav bar 
        const homeButton = document.getElementById('home-button');
        // This adds a variable that is then assigned to the html document id called contact-button, whcih is on the nav bar  
        const contactButton = document.getElementById('contact-button');
        // Adding event listeners to the home button on the html doc
        homeButton.addEventListener('click', (event) => {
            // Prevents the default navigation behavior so the user can engauge with the popup before being navigated away from the page
            event.preventDefault();
            // Adding a variable to the confirmation popup
            const confirmation = confirm("Do you wish to navigate away from this page?")
            // Taking that variable and telling the compiler that if it is confirmed (yes) navigate to the following screen
            if (confirmation) {
                // If the user confirms, navigate to the home page
                window.location.href = "https://ajfriel86.github.io/ReelOfFortune/index.html"; // Replace with your actual home page URL
            }
            // If not confirmed, then there is an empty else statement suggesting to "Do nothing"
            else {
                // do nothing
            }
        });
        // Adding event listeners to the contact button on the html doc
        contactButton.addEventListener('click', (event) => {
            // Prevents the default navigation behavior so the user can engauge with the popup before being navigated away from the page
            event.preventDefault();
            // Adding a variable to the confirmation popup
            const confirmation = confirm("Do you wish to navigate away from this page?")
            // Taking that variable and telling the compiler that if it is confirmed (yes) navigate to the following screen
            if (confirmation) {
                // If the user confirms, navigate to the home page
                window.location.href = "https://ajfriel86.github.io/ReelOfFortune/contact.html"; // Replace with your actual home page URL
            }
            // If not confirmed, then there is an empty else statement suggesting to "Do nothing"
            else {
                // do nothing
            }
        });

    }

    // This is a method to show a custom popup message with function parameters that will be passed through it
    showPopup(message, showYesNoButtons) {
        // A variable assigned to the html id custom-popup
        const popup = document.getElementById('custom-popup');
        // A variable assigned to the html id popup-message
        const popupMessage = document.getElementById('popup-message');
        // A variable assigned to the html id popup-content
        const popupContent = document.getElementById('popup-content');
        // A variable assigned to the html id popup-yes
        const popupYesButton = document.getElementById('popup-yes');
        // A variable assigned to the html id popup-no
        const popupNoButton = document.getElementById('popup-no');
        // A variable assigned to the html id popup-okay
        const popupOKButton = document.getElementById('popup-okay');

        // This sets the provided message into the popup
        popupMessage.innerText = message;

        // Using an if statement to display the differrent buttons on the popup
        if (showYesNoButtons) {
            // Show the Yes/No buttons but not the OK button
            popupYesButton.style.display = 'flex';
            popupNoButton.style.display = 'flex';
            popupOKButton.style.display = 'none';
        }
        // Show the ok button but not the yes/no
        else {
            popupYesButton.style.display = 'none';
            popupNoButton.style.display = 'none';
            popupOKButton.style.display = 'flex';
        }

        // Setting the dispaly to flex on the popup for responsiveness 
        popup.style.display = 'flex';

        // Adding an event listener to the yes button to wait for a click
        popupYesButton.addEventListener('click', () => {
            // When clicked, hide the popup
            this.hidePopup();
            // Reset the game
            this.resetGameNoMsg();
            // Enable the reset button again
            this.resetButton.disabled = false;
            // Removed the grayed out look
            this.resetButton.classList.remove('disabled-button');
        });

        // Adding an event listener to the no button to wait for a click
        popupNoButton.addEventListener('click', () => {
            // When clicked, hide the popup
            this.hidePopup();
            // Enable the reset button again
            this.resetButton.disabled = false;
            // Removed the grayed out look
            this.resetButton.classList.remove('disabled-button');
        });

        // Adding an event listener to the no button to wait for a click
        popupOKButton.addEventListener('click', () => {
            // When clicked, hide the popup
            this.hidePopup();
            // Reset the game
            this.resetGameNoMsg();
            // Enable the reset button again
            this.resetButton.disabled = false;
            // REmoved grayed out look
            this.resetButton.classList.remove('disabled-button');
        });
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
            reel.imageElement.src = 'assets/images/' + reel.defaultImage;
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
        this.stopSpin();
    }

    // Method to stop the spinning of reels
    stopSpin() {
        // Loop through each reel and call the stopSpin method on them
        this.reels.forEach(reel => reel.stopSpin());
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
        if (this.moves > 0 && this.completedSpins === this.reels.length) {
            console.log("Checking win condition1");
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
            if (this.points >= this.pointsToWin && this.moves >= this.maxMoves) {
                // if points and moves are met a popup tells the user they won
                this.showPopup(`You win! You reached ${this.pointsToWin} points within ${this.maxMoves} moves.`);
                this.endGame
            }
            // else/if the moves taken are equal to the max moves then the user looses
            else if (this.moves === this.maxMoves && this.points < this.pointsToWin) {
                this.showPopup(`You lose! You did not reach ${this.pointsToWin} points within ${this.maxMoves} moves.`);
                // Reset the game
                this.endGame();
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
            reel.imageElement.src = 'assets/images/' + reel.defaultImage;
        });
    }

    // Game reset with popup confirmation
    resetGame(event) {
        // Prevent the default reset behavior
        event.preventDefault();
        // Disable the spin button
        this.spinButton.disabled = true;
        // Adds the class to it which grays out the button 
        this.spinButton.classList.add('disabled-button');
        // Show a confirmation popup before resetting the game
        this.showPopup("Are you sure you want to reset the game?", true); // Passing true to show yes/no buttons
        // assigning a variable to the html id popup yes button
        const popupYesButton = document.getElementById('popup-yes');
        // Adding an event listener to the click of the button
        popupYesButton.addEventListener('click', () => {
            // when clicked, enable the spin button
            this.spinButton.disabled = false;
            // Removed grayed out look
            this.spinButton.classList.remove('disabled-button');
            // Epdated the level
            this.level = newLevel;
            // Resests the game
            this.resetGameNoMsg();
            // Updates the moves
            this.updateMovesDisplay();
            // Updates the points
            this.updatePointsDisplay();
        });
        // Disable the reset button after it's clicked
        this.resetButton.disabled = true;
        // Addes the grayed out look
        this.resetButton.classList.add('disabled-button');
    }

    // Method to update the selected game level
    updateLevel() {
        // Get the selected level from the dropdown
        const newLevel = this.levelSelect.value;

        // Check if the level is changed
        if (newLevel !== this.level) {
            // Show a confirmation popup before changing the level
            this.showPopup("Changing the level will reset the game. Are you sure you want to continue?", true);
            // Add an event listener to the popup's Yes button for the level change
            const popupYesButton = document.getElementById('popup-yes');
            // Adding an event listener to the click of the yes button
            popupYesButton.addEventListener('click', () => {
                // Close the popup
                this.hidePopup();

                //updates the level
                this.level = newLevel;
                // Update max moves
                this.maxMoves = this.getMaxMoves();
                // Update points to win
                this.pointsToWin = this.getPointsToWin();
                // Reset points and moves
                this.points = 0;
                this.moves = 0;
                // Setting up the reels
                this.setupReels();
                // Updates the moves displayed on the screen
                this.updateMovesDisplay();
                // Updates the points displayed on the screen
                this.updatePointsDisplay();
                // Enable the spin button
                this.spinButton.disabled = false;
                // Removes the grayed out look
                this.spinButton.classList.remove('disabled-button');
                // Disable the reset button after the level change
                this.resetButton.disabled = true;
                // Adds the grayed out look
                this.resetButton.classList.add('disabled-button');
                // Remove the event listener from the Yes button after execution
                popupYesButton.removeEventListener('click', resetListener);
            });

            // Assign a variable to the popups no button
            const popupNoButton = document.getElementById('popup-no');
            // Adding an event listener to the click
            popupNoButton.addEventListener('click', () => {
                // When click close the popup
                this.hidePopup();
                // Disable the reset button after the level change
                this.resetButton.disabled = true;
                // Adds grayed out look
                this.resetButton.classList.add('disabled-button');
                // Enable the spin button after the user decides not to change the level
                this.spinButton.disabled = false;
                // Removes grayed out look
                this.spinButton.classList.remove('disabled-button');
                // Remove the event listener from the No button after execution
                popupNoButton.removeEventListener('click', resetListener);
            });
        }
    }
}

// Create an instance of the SlotMachine class with the default level 'medium'
const slotMachine = new SlotMachine('medium');
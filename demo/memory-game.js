"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

let colors = shuffle(COLORS);

let playingGame = false;
createCards(colors);
addStartListener();




/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

function addStartListener() {
  let startButton = document.getElementById('start-button');
  startButton.addEventListener("click", startGame);
}

function startGame() {
  let startScreen = document.getElementById('start-screen');
  startScreen.remove();
  toggleOpacity();
  playingGame = true;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  let cardGrid = document.getElementById('card-grid');

  for (let i=0; i<colors.length; i++) {
    // missing code here ...
    let color = colors[i];
    let card = document.createElement("div");
    card.classList.add('card');
    card.classList.add(color);
    card.classList.add('face-down');
    card.id = "card-" + i; // For making sure user doesn't pick the same card.
    card.addEventListener('click', handleCardClick);
    
    cardGrid.appendChild(card);
  }
  gameBoard.appendChild(cardGrid);
}

/** Flip a card face-up. */

function flipCard(card) {
  // ... you need to write this ...
  card.style.backgroundColor = card.classList[1];
  card.classList.toggle('face-up');
}

/** Flip a card face-down. */

function unFlipCard(card) {
  // ... you need to write this ...
  card.style.backgroundColor = "gray";
  card.classList.toggle("face-up");
  card.classList.remove("clicked"); // Reset clicked card classes.
}

function cardsMatch(card1, card2) {
  return (card1.classList[1] == card2.classList[1]);
}

function processSecondCard(card1, card2) {
  // If the first card is clicked again, do nothing.
  if (card1.id == card2.id) return; 
  
  // Otherwise, flip the newly clicked card.
  flipCard(card1);
  card1.classList.add('clicked'); // Track that the card was clicked.
  
  // If the cards don't match, wait 1s to flip them back over.
  if (!cardsMatch(card1, card2)) {
    setTimeout(unFlipCard, FOUND_MATCH_WAIT_MSECS, card1);
    setTimeout(unFlipCard, FOUND_MATCH_WAIT_MSECS, card2);
  }

  // Reset the click trackers if there is a match.
  else {
    card1.classList.remove("clicked");
    card2.classList.remove("clicked");
  }
}
/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  // ... you need to write this ...

  // If the user hasn't hit the start button, do nothing.
  if (!playingGame) return;

  // If the user clicks a face-up card, do nothing.
  if (this.classList.contains('face-up')) return;

  let cardsClicked = document.getElementsByClassName("clicked");

  console.log(cardsClicked.length); // Just for debugging, remove later.

  // This is the first card picked in a potential match.
  if (cardsClicked.length === 0) {
    flipCard(this);
    this.classList.add('clicked'); // Track that the card was clicked.
  }
  // This is the second card picked.
  else if (cardsClicked.length === 1) {
    let card1 = this; // card1 is the card just clicked.
    let card2 = cardsClicked[0]; // card2 is the card previously clicked.
    processSecondCard(card1, card2);
  }

  let cardsFaceUp = document.getElementsByClassName('face-up');
  if (cardsFaceUp.length === colors.length) {
    askPlayAgain();
  }
}

function askPlayAgain() {
  playingGame = false;
  let docBody = document.getElementsByTagName("body")[0];

  // Create a play again screen.
  let playAgainScreen = document.createElement('div');

  // Create the header asking the user if they want to play again.
  let playAgainHeader = document.createElement('h1');
  playAgainHeader.textContent = 'Play again?';

  // Create the button that the user can press to play again.
  let playAgainButton = document.createElement('button');
  playAgainButton.textContent = "Let's do it!";
  playAgainButton.addEventListener('click', resetGame);

  // Add an id for the play again screen.
  playAgainScreen.id = 'play-again-screen'; 

  // Append the header and button to the play again screen object.
  playAgainScreen.appendChild(playAgainHeader);
  playAgainScreen.appendChild(playAgainButton);

  // Append the play again screen to the doc body.
  docBody.appendChild(playAgainScreen);

  toggleOpacity();
}

function resetGame() {

  // This helped:
  // https://stackoverflow.com/questions/10842471/how-to-remove-all-elements-of-a-certain-class-from-the-dom
  let cards = document.getElementsByClassName('card');
  while(cards[0]) {
    cards[0].parentNode.removeChild(cards[0]);
  }

  let playAgainScreen = document.getElementById('play-again-screen');
  playAgainScreen.remove();
  toggleOpacity();

  let colors = shuffle(COLORS);
  createCards(colors);
  playingGame = true;
}

function toggleOpacity() {
  let game = document.getElementById('game');
  
  // got help on this here:
  // https://stackoverflow.com/questions/11365296/how-do-i-get-the-opacity-of-an-element-using-javascript
  let opacity = window.getComputedStyle(game).getPropertyValue("opacity")
  console.log(opacity);
  if (opacity == 0.2) {
    game.style.opacity = 1
  }
  else game.style.opacity = 0.2;
}
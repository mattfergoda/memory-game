"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);

createCards(colors);


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

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let i=0; i<colors.length; i++) {
    // missing code here ...
    let color = colors[i];
    let card = document.createElement("div");
    card.classList.add('card');
    card.classList.add(color);
    card.classList.add('face-down');
    card.id = "card-" + i; // For making sure user doesn't pick the same card.
    card.addEventListener('click', handleCardClick);

    let cardGrid = document.getElementById('card-grid');
    cardGrid.appendChild(card);
    gameBoard.appendChild(cardGrid);
  }
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

  let cardsClicked = document.getElementsByClassName("clicked");

  console.log(cardsClicked.length);

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
}

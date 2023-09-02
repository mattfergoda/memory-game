"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;

let colors = [];
//let colors = shuffle(unshuffledColors);
let score = 0;
let numCards = null;

let playingGame = false;
//createCards(colors);
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
  numCards = document.getElementById('num-cards').value;
  // Make sure numCards is even and positive.
  if ((numCards % 2 === 0) && (numCards > 3) && (numCards <= 100)) {
    let startScreen = document.getElementById('start-screen');
    startScreen.remove();

    colors = createColors(numCards);
    colors = shuffle(colors);
    createCards(colors);
    createCardGrid(numCards);
    updateBestScore();
    toggleOpacity();
    playingGame = true;
  }
}

function createColors(numCards) {
  let colors = [];
  for (let i=0; i<numCards / 2; i++) {
    let randomR = Math.random() * 255;
    let randomG = Math.random() * 255;
    let randomB = Math.random() * 255;
    
    let randomColor = `rgb(${randomR},${randomB},${randomG})`;
    // Append the color to the array twice to get pairs.
    colors.push(randomColor);
    colors.push(randomColor);
  }
  return colors;
}

function createCardGrid(numCards) {
  let numCols = 5;
  // After some trial and error, this seems to give the best-looking grids
  // for a variable number of cards.

  // If numCards is divisible by 5, keep that value of numCols.
  // Otherwise, see if 3 or 4 columns will fit numCards evenly. If not, just
  // use 5 columns and embrace the awkward fit.
  if (numCards % numCols !== 0){
    for (let i=3; i<5; i++) { 
      if (numCards % i === 0) {
        numCols = i;
      };
    }
  }
  
  let cardGrid = document.getElementById('card-grid');
  cardGrid.style.gridTemplateColumns = `repeat(${numCols},1fr)`;

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
    
    let mChar = document.createElement('p');
    mChar.classList.add('card-char');
    mChar.textContent = "MM";
    card.appendChild(mChar);
    card.id = `card-${i}`; // For making sure user doesn't pick the same card.
    card.addEventListener('click', handleCardClick);
    
    cardGrid.appendChild(card);
  }
  gameBoard.appendChild(cardGrid);
}

function updateScoreboard(score) {
  let scoreText = document.getElementById('score');
  scoreText.innerHTML = `Score: ${score}`;
}

function updateBestScore(){
  // Get lowest score.
  let lowestScore = localStorage.getItem(`lowestScore-${numCards}`);
  // Don't show best score if there isn't one for this grid size yet.
  if (lowestScore) {
    let lowestScoreElement = document.getElementById('best-score');
    lowestScoreElement.textContent = `Best Score for ${numCards} cards: ${lowestScore}`;
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  // ... you need to write this ...
  card.style.backgroundColor = card.classList[1];
  card.childNodes[0].textContent = '';
  card.classList.toggle('face-up');
  card.classList.toggle('face-down');
  score++;
  updateScoreboard(score);
}

/** Flip a card face-down. */

function unFlipCard(card) {
  // ... you need to write this ...
  card.style.backgroundColor = "lightgray";
  card.childNodes[0].textContent = 'MM';
  card.classList.toggle("face-up");
  card.classList.toggle('face-down');
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

function displayFinalScore(playAgainScreen) {
  // Get lowest score.
  let lowestScore = localStorage.getItem(`lowestScore-${numCards}`);
  // If there's no lowest score recorded, set the lowest score to Infinity.
  if (!lowestScore) lowestScore = Infinity;

  // Create the header showing the user's score.
  let endGameScore = document.createElement('h1');
  let bestScoreMessage = document.createElement('h1');

  // If it's a new best score, tell the user.
  if (score < lowestScore) {
    localStorage.setItem(`lowestScore-${numCards}`, score);
    bestScoreMessage.textContent = `New best score for ${numCards} cards!`;
  } else {
    bestScoreMessage.textContent = '';
  }
  endGameScore.textContent = `Your score: ${score}`;

  playAgainScreen.appendChild(bestScoreMessage);
  playAgainScreen.appendChild(endGameScore);
}

function buildPlayAgainScreenComponents(playAgainScreen) {
  // Create the header asking the user if they want to play again.
  let playAgainHeader = document.createElement('h1');
  playAgainHeader.textContent = 'Play again?';
  playAgainHeader.classList.add('title');
  playAgainHeader.id = 'play-again-message';

  // Create the button that the user can press to play again.
  let playAgainButton = document.createElement('button');
  playAgainButton.textContent = "Let's do it!";
  playAgainButton.addEventListener('click', resetGame);

  playAgainScreen.appendChild(playAgainHeader);
  playAgainScreen.appendChild(playAgainButton);
}

function askPlayAgain() {
  playingGame = false;
  let docBody = document.getElementsByTagName("body")[0];

  // Create a play again screen.
  let playAgainScreen = document.createElement('div');
  // Add an id for the play again screen.
  playAgainScreen.id = 'play-again-screen'; 
  
  displayFinalScore(playAgainScreen)
  buildPlayAgainScreenComponents(playAgainScreen)

  // Append the play again screen to the doc body.
  docBody.appendChild(playAgainScreen);

  toggleOpacity();
}

function resetGame() {
 location.reload();
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
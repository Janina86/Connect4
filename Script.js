const cols = 7;
const rows = 6;
const disks = 4;

let currentPlayer = 'yellow';
let playerNames = { yellow: 'Player 1', red: 'Player 2' };
let boardState = Array(cols).fill().map(() => Array(rows).fill(''));
let gameActive = true;

function initializeGame() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    for (let col = 0; col < cols; ++col) {
        for (let row = 0; row < rows; ++row) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.col = col;
            cell.dataset.row = row;
            cell.onclick = cellColouring;
            board.appendChild(cell);
        }
    }
    document.getElementById('play-again').style.display = 'none';
}

function cellColouring() {
    const col = parseInt(this.dataset.col);
    if (!gameActive) {
        return;
    }
    const row = getAvailableRow(col);
    if (row === -1) {
        return;
    }
    boardState[col][row] = currentPlayer;
    const cell = document.querySelector(`.cell[data-col="${col}"][data-row="${row}"]`);
    cell.classList.add(currentPlayer);
    if (checkForWinner()) {
        endGame(playerNames[currentPlayer] + " WINS!");
    } else if (boardState.flat().every(cell => cell)) {
        endGame("It's a Tie!");
    } else {
        changePlayer();
    }
}

function changePlayer() {
    if (currentPlayer === 'yellow') {
        currentPlayer = 'red';
    } else {
        currentPlayer = 'yellow';
    }
}

function getAvailableRow(col) {
    for (let row = 5; row >= 0; --row) {
        if (boardState[col][row] === '') {
            return row;
        }
    }
    return -1;
}

function checkForWinner() {
    const directions = [
        { dRow: 0, dCol: 1 },
        { dRow: 1, dCol: 0 },
        { dRow: 1, dCol: 1 },
        { dRow: 1, dCol: -1 }
    ];
    for (let col = 0; col < cols; ++col) {
        for (let row = 0; row < rows; ++row) {
            const player = boardState[col][row];
            if (player === '') {
                continue;
            }
            for (let directionIndex = 0; directionIndex < directions.length; ++directionIndex) {
                const dRow = directions[directionIndex].dRow;
                const dCol = directions[directionIndex].dCol;
                let count = 0;
                let foundSequence = true;
                for (let i = 0; i < disks; ++i) {
                    const newRow = row + i * dRow;
                    const newCol = col + i * dCol;
                    if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols || boardState[newCol][newRow] !== player) {
                        foundSequence = false;
                    }
                    if (foundSequence) {
                        ++count;
                    }
                }
                if (count === disks) {
                    return true;
                }
            }
        }
    }
    return false;
}

function endGame(message) {
    document.getElementById('winnerIs').innerText = message;
    gameActive = false;
    document.getElementById('play-again').style.display = 'block';
}

function resetGame() {
    boardState = Array(cols).fill().map(() => Array(rows).fill(''));
    currentPlayer = 'yellow';
    gameActive = true;
    document.getElementById('winnerIs').innerText = '';
    document.getElementById('play-again').style.display = 'none';
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('yellow', 'red'));
}

function setPlayerName(color) {
    let inputId;
    if (color === 'yellow') {
        inputId = 'player1-name';
    } else {
        inputId = 'player2-name';
    }
    const name = document.getElementById(inputId).value.trim();
    if (name) {
        playerNames[color] = name;
        alert(color.charAt(0).toUpperCase() + color.slice(1) + " player's name set to: " + name);
    }
}

window.onload = initializeGame;

let currentPlayer = 'yellow';
let playerNames = { yellow: 'Player 1', red: 'Player 2' };
let boardState = Array(7).fill().map(() => Array(6).fill(''));
let gameActive = true;

function initializeGame() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    for (let col = 0; col < 7; ++col) {
        for (let row = 0; row < 6; ++row) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.col = col;
            cell.dataset.row = row;
            board.appendChild(cell);
        }
    }
    document.getElementById('play-again').style.display = 'none';
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    document.getElementById('set-player1').addEventListener('click', function() {
        setPlayerName('yellow');
    });
    document.getElementById('set-player2').addEventListener('click', function() {
        setPlayerName('red');
    });
}

function handleCellClick() {
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
    } else if (boardState.flat().every(function(cell) { return cell; })) {
        endGame("It's a Tie!");
    } else {
        if (currentPlayer === 'yellow') {
            currentPlayer = 'red';
        } else {
            currentPlayer = 'yellow';
        }
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
    for (let col = 0; col < 7; ++col) {
        for (let row = 0; row < 6; ++row) {
            const player = boardState[col][row];
            if (player === '') {
                continue;
            }
            for (let directionIndex = 0; directionIndex < directions.length; ++directionIndex) {
                const dRow = directions[directionIndex].dRow;
                const dCol = directions[directionIndex].dCol;
                let count = 0;
                let foundSequence = true;
                for (let i = 0; i < 4; ++i) {
                    const newRow = row + i * dRow;
                    const newCol = col + i * dCol;
                    if (newRow < 0 || newRow >= 6 || newCol < 0 || newCol >= 7 || boardState[newCol][newRow] !== player) {
                        foundSequence = false;
                    }
                    if (foundSequence) {
                        ++count;
                    }
                }
                if (count === 4) {
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
    boardState = Array(7).fill().map(() => Array(6).fill(''));
    currentPlayer = 'yellow';
    gameActive = true;
    document.getElementById('winnerIs').innerText = '';
    document.getElementById('play-again').style.display = 'none';
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('yellow', 'red'));
}

document.getElementById('play-again').addEventListener('click', resetGame);

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

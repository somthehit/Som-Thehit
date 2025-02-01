class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.scores = { X: 0, O: 0 };
        this.gameActive = true;
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        this.cells = document.querySelectorAll('[data-cell]');
        this.statusElement = document.querySelector('.status');
        this.restartButton = document.getElementById('restartButton');
        this.scoreXElement = document.getElementById('scoreX');
        this.scoreOElement = document.getElementById('scoreO');

        this.initializeGame();
    }

    initializeGame() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleClick(e), { once: true });
        });

        this.restartButton.addEventListener('click', () => this.restartGame());
    }

    handleClick(e) {
        if (!this.gameActive) return;

        const cell = e.target;
        const index = Array.from(this.cells).indexOf(cell);

        if (this.board[index] !== '') return;

        this.board[index] = this.currentPlayer;
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());

        if (this.checkWin()) {
            this.endGame(false);
        } else if (this.checkDraw()) {
            this.endGame(true);
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateStatus();
        }
    }

    checkWin() {
        for (const combination of this.winningCombinations) {
            if (combination.every(index => this.board[index] === this.currentPlayer)) {
                // Highlight winning cells
                combination.forEach(index => {
                    this.cells[index].classList.add('winner');
                });
                return true;
            }
        }
        return false;
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    endGame(draw) {
        this.gameActive = false;

        if (draw) {
            this.statusElement.textContent = "Game ended in a draw!";
        } else {
            this.statusElement.textContent = `Player ${this.currentPlayer} wins!`;
            this.statusElement.classList.add('winner');
            this.scores[this.currentPlayer]++;
            this.updateScoreBoard();
        }
    }

    updateStatus() {
        this.statusElement.textContent = `Player ${this.currentPlayer}'s Turn`;
    }

    updateScoreBoard() {
        this.scoreXElement.textContent = this.scores.X;
        this.scoreOElement.textContent = this.scores.O;
    }

    restartGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;

        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
        });

        this.statusElement.classList.remove('winner');
        this.updateStatus();

        // Remove old event listeners and add new ones
        this.cells.forEach(cell => {
            const clone = cell.cloneNode(true);
            cell.parentNode.replaceChild(clone, cell);
        });

        this.cells = document.querySelectorAll('[data-cell]');
        this.initializeGame();
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});

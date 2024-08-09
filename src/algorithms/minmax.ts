// Define the board size
const SIZE = 3;

export function findBestMove(board: number[][]): { x: number, y: number, score: number } {
    let bestScore = -Infinity;
    let bestMove = { x: -1, y: -1, score: bestScore };

    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (board[i][j] === 0) {
                board[i][j] = -1; // AI makes a move
                const score = minimax(board, 0, false);
                board[i][j] = 0; // Undo the move

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { x: i, y: j, score: bestScore };
                }
            }
        }
    }

    return bestMove;
}

// Minimax function to evaluate the board
function minimax(board: number[][], depth: number, isMaximizing: boolean): number {
    let score = evaluate(board);

    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (isMovesLeft(board) === false) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;

        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (board[i][j] === 0) {
                    board[i][j] = -1; // AI makes a move
                    bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                    board[i][j] = 0; // Undo the move
                }
            }
        }

        return bestScore;
    } else {
        let bestScore = Infinity;

        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (board[i][j] === 0) {
                    board[i][j] = 1; // Player makes a move
                    bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
                    board[i][j] = 0; // Undo the move
                }
            }
        }

        return bestScore;
    }
}

function evaluate(board: number[][]): number {
    for (let row = 0; row < SIZE; row++) {
        if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
            if (board[row][0] === -1) return 10;
            else if (board[row][0] === 1) return -10;
        }
    }

    for (let col = 0; col < SIZE; col++) {
        if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
            if (board[0][col] === -1) return 10;
            else if (board[0][col] === 1) return -10;
        }
    }

    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        if (board[0][0] === -1) return 10;
        else if (board[0][0] === 1) return -10;
    }

    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        if (board[0][2] === -1) return 10;
        else if (board[0][2] === 1) return -10;
    }

    return 0;
}

// Function to check if there are any moves left
function isMovesLeft(board: number[][]): boolean {
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (board[i][j] === 0) return true;
        }
    }
    return false;
}

import { Move } from "../interfaces/game.interfaces";

export function findBestMove(board: number[][]): Move {
    return negamax(board, 2, -1, -Infinity, Infinity);
}


export const negamax = (
    board: number[][],
    depth: number,
    color: number,
    alpha: number,
    beta: number
): Move => {
    let bestMove: Move = { x: -1, y: -1, score: -Infinity };

    if (depth === 0 || isGameOver(board)) {
        return { x: -1, y: -1, score: color * evaluateBoard(board) };
    }

    let moves = generateMoves(board);

    for (let move of moves) {
        board[move.x][move.y] = color;

        const nextMove = negamax(board, depth - 1, -color, -beta, -alpha);
        nextMove.score = -nextMove.score;

        board[move.x][move.y] = 0; // Undo the move

        if (nextMove.score > bestMove.score) {
            bestMove = { x: move.x, y: move.y, score: nextMove.score };
        }

        alpha = Math.max(alpha, nextMove.score);
        if (alpha >= beta) {
            break; // Beta cutoff
        }
    }

    return bestMove;
};


// Generate possible moves, ordered by proximity to the last moves
const generateMoves = (board: number[][]): Move[] => {
    let moves: Move[] = [];

    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            if (board[x][y] === 0 && hasAdjacent(board, x, y)) {
                moves.push({ x, y, score: 0 });
            }
        }
    }

    // Optionally, sort moves by heuristic score to improve pruning
    moves.sort((a, b) => evaluateMove(board, b) - evaluateMove(board, a));

    return moves;
};

// Check if a move is adjacent to any occupied cell
const hasAdjacent = (board: number[][], x: number, y: number): boolean => {
    const directions = [
        [1, 0], [0, 1], [-1, 0], [0, -1],
        [1, 1], [-1, -1], [1, -1], [-1, 1]
    ];

    for (let [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < board.length && ny >= 0 && ny < board.length && board[nx][ny] !== 0) {
            return true;
        }
    }

    return false;
};

// Heuristically evaluate a move
const evaluateMove = (board: number[][], move: Move): number => {
    board[move.x][move.y] = 1; // Assume the AI plays here
    const score = evaluateBoard(board);
    board[move.x][move.y] = 0; // Undo the move
    return score;
};

const evaluateBoard = (board: number[][]): number => {
    let score = 0;

    // Check rows, columns, and diagonals for potential scores
    score += evaluateLines(board);
    score += evaluateLines(transpose(board));
    score += evaluateDiagonals(board);
    score += evaluateDiagonals(transpose(board));

    return score;
};

// Helper function to transpose the board (rows become columns)
const transpose = (board: number[][]): number[][] => {
    return board[0].map((_, colIndex) => board.map(row => row[colIndex]));
};

// Evaluate rows and columns
const evaluateLines = (board: number[][]): number => {
    let score = 0;

    for (let row of board) {
        score += evaluateLine(row);
    }

    return score;
};

// Evaluate diagonals (both major and minor)
const evaluateDiagonals = (board: number[][]): number => {
    let score = 0;
    const size = board.length;

    // Major diagonals
    for (let i = -size + 1; i < size; i++) {
        let majorDiagonal = [];
        for (let x = 0; x < size; x++) {
            const y = x + i;
            if (y >= 0 && y < size) {
                majorDiagonal.push(board[x][y]);
            }
        }
        score += evaluateLine(majorDiagonal);
    }

    // Minor diagonals
    for (let i = 0; i < 2 * size - 1; i++) {
        let minorDiagonal = [];
        for (let x = 0; x < size; x++) {
            const y = i - x;
            if (y >= 0 && y < size) {
                minorDiagonal.push(board[x][y]);
            }
        }
        score += evaluateLine(minorDiagonal);
    }

    return score;
};

// Evaluate a single line (row, column, or diagonal)
const evaluateLine = (line: number[]): number => {
    let score = 0;

    for (let i = 0; i < line.length - 4; i++) {
        const segment = line.slice(i, i + 5);
        score += evaluateSegment(segment);
    }

    return score;
};

// Evaluate a segment of 5 cells
const evaluateSegment = (segment: number[]): number => {
    const countX = segment.filter(cell => cell === 1).length;
    const countO = segment.filter(cell => cell === -1).length;

    if (countX === 5) return 100000; // Win for X
    if (countO === 5) return -100000; // Win for O
    if (countX > 0 && countO > 0) return 0; // Blocked line
    if (countX === 4) return 1000;
    if (countO === 4) return -1000;
    if (countX === 3) return 100;
    if (countO === 3) return -100;
    if (countX === 2) return 10;
    if (countO === 2) return -10;

    return 0;
};

const isGameOver = (board: number[][]): boolean => {
    return checkWinningCondition(board, 1) || checkWinningCondition(board, -1);
};

// Check if a player has won
const checkWinningCondition = (board: number[][], player: number): boolean => {
    const size = board.length;

    // Check rows, columns, and diagonals
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (
                checkDirection(board, x, y, player, 1, 0) || // Check row
                checkDirection(board, x, y, player, 0, 1) || // Check column
            checkDirection(board, x, y, player, 1, 1) || // Check major diagonal
        checkDirection(board, x, y, player, 1, -1)   // Check minor diagonal
            ) {
                return true;
            }
        }
    }

    return false;
};

// Check a direction (e.g., row, column, diagonal) for a win
function checkDirection(
    board: number[][],
    startX: number,
    startY: number,
    player: number,
    deltaX: number,
    deltaY: number
): boolean {
    const size = board.length;
    let count = 0;

    for (let i = 0; i < 5; i++) {
        const x = startX + i * deltaX;
        const y = startY + i * deltaY;

        if (x >= 0 && x < size && y >= 0 && y < size && board[x][y] === player) {
            count++;
        } else {
            break;
        }

        if (count === 5) {
            return true;
        }
    }

    return false;
};

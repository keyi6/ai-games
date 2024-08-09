import { useState, useCallback, useMemo } from "react";
import { GameStatus, IMove, CellStatus } from "../interfaces/game.interfaces";

function checkRow(arr: CellStatus[], winningCount: number): GameStatus {
    if (arr.length < winningCount) return GameStatus.OnGoing;
    for (let i = 0; i + winningCount <= arr.length; i ++) {
        if (arr[i] === CellStatus.Blank) continue;

        if (arr.slice(i + 1, i + winningCount).every(x => x === arr[i])) {
            console.debug("Matched", arr);
            return arr[i] === CellStatus.Player1
                ? GameStatus.Player1Won
                : GameStatus.Player2Won;
        }
    }

    return GameStatus.OnGoing;
}

export function check(
    bitmap: CellStatus[][],
    row: number,
    column: number,
    winningCount: number,
): GameStatus {
    // add rows
    const arrays: CellStatus[][] = [...bitmap];

    // add columns
    for (let i = 0; i < column; i ++) {
        arrays.push(new Array(row)
            .fill(0)
            .map((_, j) => bitmap[j][i]));
    }

    for (let i = 0; i < column; i ++) {
        let temp = [];
        let x = 0, y = i;
        while (x < row && y < column) {
            temp.push(bitmap[x][y]);
            x ++; y ++;
        }
        arrays.push(temp);

        temp = [];
        x = 0; y = i;
        while (x < row && y >= 0) {
            temp.push(bitmap[x][y]);
            x ++; y --;
        }
        arrays.push(temp);
    }

    for (let i = 0; i < row; i ++) {
        let temp = [];
        let x = i, y = 0;
        while (x < row && y < column) {
            temp.push(bitmap[x][y]);
            x ++; y ++;
        }
        arrays.push(temp);

        temp = [];
        x = i; y = 0;
        while (x < row && y >= 0) {
            temp.push(bitmap[x][y]);
            x ++; y --;
        }
        arrays.push(temp);
    }

    const results = arrays
        .map(arr => checkRow(arr, winningCount))
        .filter(x => x !== GameStatus.OnGoing);
    if (results.length) return results[0];

    if (bitmap.some(row => row.some(c => c === CellStatus.Blank))) return GameStatus.OnGoing;
    return GameStatus.Tie;
}


export function useBoardGame(row: number, column: number, winningCount: number, firstHand: boolean) {
    const [seq, setSeq] = useState<number>(0);
    const [moves, setMoves] = useState<IMove[]>([]);
    // true -> player 1 is going to place next chess; false -> player 2
    const [player, setPlayer] = useState<boolean>(firstHand);

    const placeChess = useCallback((x: number, y: number) => {
        setMoves(pre => [...pre, {
            x, y, seq,
            status: player ? CellStatus.Player1 : CellStatus.Player2,
        }]);
        setSeq(pre => pre + 1);
        setPlayer(pre => !pre);

        return moves;
    }, [seq, player]);

    const bitmap = useMemo<CellStatus[][]>(() => {
        const ret = new Array(row)
            .fill(0)
            .map(_ => new Array(column).fill(CellStatus.Blank));
        moves.forEach(({ x, y, status }) => ret[x][y] = status);
        return ret;
    }, [moves, column, row]);

    const gameStatus = useMemo<GameStatus>(
        () => check(bitmap, row, column, winningCount),
        [bitmap, row, column, winningCount],
    );

    const restart = useCallback(() => {
        setSeq(0);
        setMoves([]);
        setPlayer(firstHand);
    }, [firstHand]);

    return { bitmap, placeChess, gameStatus, player, restart, seq };
}

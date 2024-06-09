import { useState, useCallback, useMemo } from "react";
import { IMove, Status } from "../interfaces/game.interfaces";

function checkRow(arr: Status[], winningCount: number): Status {
    if (arr.length < winningCount) return Status.Blank;
    for (let i = 0; i + winningCount < arr.length; i ++) {
        if (arr[i] === Status.Blank) continue;

        const flag = arr.slice(i + 1, i + winningCount).every(x => x === arr[i]);
        if (flag) return arr[i];
    }
    return Status.Blank;
}

export function check(
    bitmap: Status[][],
    row: number,
    column: number,
    winningCount: number,
): Status {
    // add rows
    const arrays: Status[][] = [...bitmap];
    // add columns
    for (let i = 0; i < column; i ++) {
        arrays.push(new Array(row).map((_, j) => bitmap[j][i]));
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
        .filter(x => x !== Status.Blank);
    return results.length ? results[0] : Status.Blank;
}

export const useBoardGame = (row: number, column: number, winningCount: number) => {
    const [seq, setSeq] = useState<number>(0);
    const [moves, setMoves] = useState<IMove[]>([]);
    const [player, setPlayer] = useState<boolean>(true);

    const placeChess = useCallback((x: number, y: number) => {
        setMoves(pre => [...pre, {
            x, y, seq,
            status: player ? Status.Player1 : Status.Player2,
        }]);
        setSeq(pre => pre + 1);
        setPlayer(pre => !pre);
    }, [seq, player]);

    const bitmap = useMemo<Status[][]>(() => {
        const ret = new Array(row)
            .fill(0)
            .map(_ => new Array(column).fill(Status.Blank));
        moves.forEach(({ x, y, status }) => ret[x][y] = status);
        return ret;
    }, [moves, column, row]);

    const gameStatus = useMemo<Status>(
        () => check(bitmap, row, column, winningCount),
        [bitmap, row, column, winningCount],
    );

    return { bitmap, placeChess, gameStatus };
};

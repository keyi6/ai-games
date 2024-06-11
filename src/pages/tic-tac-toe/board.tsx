import React, {
    FunctionComponent, forwardRef, useEffect, useImperativeHandle, useMemo, useRef,
} from "react"
import { GameStatus, CellStatus } from "../../interfaces/game.interfaces";
import { useBoardGame } from "../../hooks/useBoardGame";

const ROW = 3;
const COL = 3;
const WINNING_COUNT = 3;

const Cell: FunctionComponent<{
    status: CellStatus;
    onClick: () => void;
}> = ({ status, onClick }) => {
    if (status === CellStatus.Blank) {
        return <td onClick={onClick}>blank</td>;
    }

    if (status === CellStatus.Player1) {
        return <td>x</td>
    }
    return <td>o</td>;
};

export interface IBoardRef {
    placeChess: (x: number, y: number) => void;
}

export interface IBoardProps {
    onStatusChange: (status: GameStatus) => void;
}


export const Board = forwardRef(({
    onStatusChange,
}: IBoardProps, ref) => {

    const boardRef = useRef(null);
    const {
        bitmap, placeChess, gameStatus,
    } = useBoardGame(ROW, COL, WINNING_COUNT);

    const enable = useMemo<boolean>(
        () => gameStatus === GameStatus.OnGoing,
        [gameStatus]
    );

    const board = useMemo(() => bitmap.map((r, x) => (
        <tr key={`row-${x}`}>
            {
                r.map((c, y) => (
                    <Cell key={`cell-${x}-${y}`}
                        status={c}
                        onClick={() => enable && placeChess(x, y)}
                    />
                ))
            }
        </tr>
    )), [bitmap, placeChess]);

    useImperativeHandle(ref, (): IBoardRef => ({
        /** Place a chess by the position of (x, y) */
        placeChess: (x: number, y: number) => placeChess(x, y),
    }), [placeChess]);

    useEffect(() => {
        if (gameStatus === GameStatus.OnGoing) return;

        console.debug(`CellStatus Change: ${gameStatus}`);
        onStatusChange(gameStatus);
    }, [gameStatus, onStatusChange]);

    return (
        <table ref={boardRef}>
            <tbody>
                {board}
            </tbody>
        </table>
    );
});

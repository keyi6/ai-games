import React, {
    FunctionComponent, forwardRef, useImperativeHandle, useMemo, useRef,
} from "react"
import { Status } from "../../interfaces/game.interfaces";
import { useBoardGame } from "../../hooks/useBoardGame";

const ROW = 3;
const COL = 3;
const WINNING_COUNT = 3;

const Cell: FunctionComponent<{
    status: Status;
    onClick: () => void;
}> = ({ status, onClick }) => {
    if (status === Status.Blank) {
        return <td onClick={onClick}>blank</td>;
    }

    if (status === Status.Player1) {
        return <td>x</td>
    }
    return <td>o</td>;
};

export interface IBoardRef {
    placeChess: (x: number, y: number) => void;
}

export const Board = forwardRef((_, ref) => {
    const boardRef = useRef(null);
    const { bitmap, placeChess } = useBoardGame(ROW, COL, WINNING_COUNT);

    const board = useMemo(() => bitmap.map((r, x) => (
        <tr key={`row-${x}`}>
            {
                r.map((c, y) => (
                    <Cell key={`cell-${x}-${y}`}
                        status={c}
                        onClick={() => placeChess(x, y)}
                    />
                ))
            }
        </tr>
    )), [bitmap, placeChess]);

    useImperativeHandle(ref, (): IBoardRef => ({
        /** Place a chess by the position of (x, y) */
        placeChess: (x: number, y: number) => placeChess(x, y),
    }), [placeChess]);

    return (
        <table ref={boardRef}>
            <tbody>
                {board}
            </tbody>
        </table>
    );
});

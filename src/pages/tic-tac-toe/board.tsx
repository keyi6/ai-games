import React, {
    FunctionComponent, forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef,
} from "react"
import { GameStatus, CellStatus } from "../../interfaces/game.interfaces";
import { useBoardGame } from "../../hooks/useBoardGame";
import styled from "styled-components";

const ROW = 3;
const COL = 3;
const WINNING_COUNT = 3;
const SIZE = 20;

const EmptyCell = styled.td`
    height: ${SIZE}vmin;
    width: ${SIZE}vmin;
    font-size: calc(${SIZE}vmin - 20px);
    line-height: calc(${SIZE}vmin - 20px);
    cursor: pointer;
    text-align: center;
`;

const Player1Cell = styled(EmptyCell)`
    &:after {
        content: "⭕️";
    }
`;

const Player2Cell = styled(EmptyCell)`
    &:after {
        content: "❌";
    }
`;

const Cell: FunctionComponent<{
    status: CellStatus;
    onClick: () => void;
}> = ({ status, onClick }) => {
    if (status === CellStatus.Blank) return <EmptyCell onClick={onClick} />

    return status === CellStatus.Player1
        ? <Player1Cell />
        : <Player2Cell />;
};

export interface IBoardRef {
    placeChess: (x: number, y: number) => void;
}

export interface IBoardProps {
    onStatusChange: (status: GameStatus) => void;
}

const Table = styled.table`
    border-collapse: collapse;

    td + td,
    th + th { border-left: 2vmin solid #fff; }
    tr + tr { border-top: 2vmin solid #fff; }
`;


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
    )), [bitmap, placeChess, enable]);

    useImperativeHandle(ref, (): IBoardRef => ({
        /** Place a chess by the position of (x, y) */
        placeChess: (x: number, y: number) => placeChess(x, y),
    }), [placeChess]);

    useLayoutEffect(() => {
        if (gameStatus === GameStatus.OnGoing) return;
        onStatusChange(gameStatus);
    }, [gameStatus, onStatusChange]);

    return (
        <Table ref={boardRef}>
            <tbody>
                {board}
            </tbody>
        </Table>
    );
});

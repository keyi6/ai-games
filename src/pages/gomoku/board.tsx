import React, {
    forwardRef, useCallback, useEffect, useImperativeHandle,
    useLayoutEffect, useMemo, useRef
} from "react"
import { GameStatus, CellStatus } from "../../interfaces/game.interfaces";
import { useBoardGame } from "../../hooks/useBoardGame";
import { MARGIN_L, MARGIN_U, click2Coordinates, draw, init } from "./canvasUtils";

const ROW = 15;
const COL = 15;
const WINNING_COUNT = 5;

export interface IBoardRef {
    placeChess: (x: number, y: number) => void;
    restart: () => void;
}

export interface IBoardProps {
    onStatusChange: (status: GameStatus) => void;
    onPlayerPlaced: (board: CellStatus[][]) => void;
}


export const Board = forwardRef(({
    onStatusChange,
    onPlayerPlaced,
}: IBoardProps, ref) => {
    const {
        bitmap, placeChess, gameStatus, player, restart, seq
    } = useBoardGame(ROW, COL, WINNING_COUNT, true);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const enable = useMemo<boolean>(
        () => gameStatus === GameStatus.OnGoing,
        [gameStatus]
    );

    useImperativeHandle(ref, (): IBoardRef => ({
        /** Place a chess by the position of (x, y) */
        placeChess: (x: number, y: number) => placeChess(x, y),
        restart: () => restart(),
    }), [placeChess, restart]);

    useLayoutEffect(() => {
        if (gameStatus === GameStatus.OnGoing) return;
        onStatusChange(gameStatus);
    }, [gameStatus, onStatusChange]);

    useEffect(() => {
        if (player || gameStatus !== GameStatus.OnGoing) return;
        onPlayerPlaced(bitmap);
    }, [player, bitmap]);

    useEffect(() => {
        init(canvasRef.current);
    }, []);

    const onClick = useCallback((e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const { x, y } = click2Coordinates(e);
        console.log(`coord: ${x}, ${y}. bitmap status: ${bitmap[x][y]}`);

        if (bitmap[x][y] === CellStatus.Blank) {
            draw(canvasRef.current, x, y, seq);
            placeChess(x, y);
        }
    }, [seq, bitmap]);

    return (
        <div>
            <canvas ref={canvasRef}
                onClick={onClick}
                style={{
                    position: 'absolute',
                    top: MARGIN_U,
                    left: MARGIN_L
                }}
            />

        </div>
    );
});

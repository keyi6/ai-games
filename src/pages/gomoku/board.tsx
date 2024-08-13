import React, {
    forwardRef, useCallback, useEffect, useImperativeHandle,
    useLayoutEffect, useMemo, useRef,
    useState
} from "react"
import { GameStatus, CellStatus } from "../../interfaces/game.interfaces";
import { useBoardGame } from "../../hooks/useBoardGame";
import { client2Coordinate, coordinate2client, draw, init, RATE } from "./canvasUtils";
import styled from "styled-components";

const ROW = 15;
const COL = 15;
const WINNING_COUNT = 5;

export interface IBoardRef {
    placeChess: (x: number, y: number) => void;
    restart: () => void;
    setHighlighPos: (x: number, y: number) => void;
}

export interface IBoardProps {
    onStatusChange: (status: GameStatus) => void;
    onPlayerPlaced: (board: CellStatus[][]) => void;
}

const Preview = styled.span`
    height: ${RATE - 1}px;
    width: ${RATE - 1}px;
    opacity: 0.2;
    background-color: #fff;
    border-radius: 50%;
    display: inline-block;
    position: fixed;
    pointer-events: none;
`;

const Highlight = styled.span`
    height: ${RATE - 5}px;
    width: ${RATE - 5}px;
    border: 2px solid #dadada;
    border-radius: 50%;
    display: inline-block;
    position: fixed;
    pointer-events: none;
    outline: none;
    border-color: #9ecaed;
    box-shadow: 0 0 10px #9ecaed;
`;

export const Board = forwardRef(({
    onStatusChange,
    onPlayerPlaced,
}: IBoardProps, ref) => {
    const {
        bitmap, placeChess, gameStatus, player, restart, seq
    } = useBoardGame(ROW, COL, WINNING_COUNT, true);

    const [highlightPos, setHighlightPos] = useState<{ x: number; y: number; } | null>();

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const enable = useMemo<boolean>(
        () => gameStatus === GameStatus.OnGoing,
        [gameStatus]
    );

    useImperativeHandle(ref, (): IBoardRef => ({
        /** Place a chess by the position of (x, y) */
        placeChess: (x: number, y: number) => {
            draw(canvasRef.current, x, y, seq);
            placeChess(x, y);
        },
        restart: () => {
            restart();
            init(canvasRef.current);
            setPreviewPos(null);
            setHighlightPos(null);
        },
        setHighlighPos: (x, y) => {
            const { x: x1, y: y1 } = coordinate2client(x, y);
            setHighlightPos({ x: x1 - RATE / 2, y: y1 - RATE / 2 });
        },
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
        if (!enable) return;

        const { x, y } = client2Coordinate(e);

        if (bitmap[x][y] === CellStatus.Blank) {
            draw(canvasRef.current, x, y, seq);
            placeChess(x, y);
        }
    }, [seq, bitmap]);

    const [previewPos, setPreviewPos] = useState<{ x: number; y: number; } | null>();

    const showPreview = useCallback((e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const { x: x1, y: y1 } = client2Coordinate(e);
        const { x: x2, y: y2 } = coordinate2client(x1, y1);
        setPreviewPos({ x: x2 - RATE / 2, y: y2 - RATE / 2 });
    }, []);

    return (
        <div>
            <canvas ref={canvasRef}
                onClick={onClick}
                onMouseMove={showPreview}
            />
            { previewPos && <Preview style={{ top: previewPos.y, left: previewPos.x }} /> }
            { highlightPos && <Highlight style={{ top: highlightPos.y, left: highlightPos.x }} /> }
        </div>
    );
});

import React, { useCallback, useRef } from "react";
import { Board, IBoardRef } from "./board";
import { GameStatus } from "../../interfaces/game.interfaces";

export const TicTacToePage = () => {
    const ref = useRef<IBoardRef>(null);

    const onStatusChange = useCallback((status: GameStatus) => {
        if (status === GameStatus.OnGoing) return;
        alert(`winner is ${status}`);
    }, []);

    return (
        <Board onStatusChange={onStatusChange} ref={ref} />
    );
};

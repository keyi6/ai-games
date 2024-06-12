import React, { useCallback, useRef } from "react";
import { Board, IBoardRef } from "./board";
import { GameStatus } from "../../interfaces/game.interfaces";
import { Page } from "../../components/page";

export const TicTacToePage = () => {
    const ref = useRef<IBoardRef>(null);

    const onStatusChange = useCallback((status: GameStatus) => {
        if (status === GameStatus.OnGoing) return;
        alert(`winner is ${status}`);
    }, []);

    return (
        <Page>
            <Board onStatusChange={onStatusChange} ref={ref} />
        </Page>
    );
};

import React, { useRef } from "react";
import { Board, IBoardRef } from "./board";

export const TicTacToePage = () => {
    const ref = useRef<IBoardRef>(null);
    return (
        <Board ref={ref} />
    );
};

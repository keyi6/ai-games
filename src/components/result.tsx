import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import sample from "lodash/sample";
import styled from "styled-components";
import { GameStatus } from "../interfaces/game.interfaces";

const COLOR_LIST = ['#606470', '#3c79ce', '#4CAF50'];

export const ResultWrapper = styled.div`
    position: absolute;
    text-decoration: none;
    text-transform: uppercase;
    top: 0;
    left: 0;
    color: #333;
    background-color: #fff;
    opacity: 0.8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 10rem;
    height: 100vh;
    width: 100vw;
    z-index: 999;

    
`;

export interface IResultRef {
    show: (status: GameStatus) => void;
    hide: () => void;
}

export const Result = forwardRef<IResultRef>((_, ref) => {
    const [active, setActive] = useState<boolean>(false);
    const [status, setStatus] = useState<GameStatus>(GameStatus.OnGoing);
    const text = useMemo(() => {
        if (status === GameStatus.Player1Won) return "You won";
        if (status === GameStatus.Player2Won) return "You lost";
        return "Tie";
    }, [status]);

    useImperativeHandle(ref, (): IResultRef => ({
        show: (status) => {
            setStatus(status);
            setActive(true);
        },

        hide: () => {
            setActive(false);
        },
    }));
    
    if (!active) return null;
    return (
        <ResultWrapper>
            {text}
        </ResultWrapper>
    );
});

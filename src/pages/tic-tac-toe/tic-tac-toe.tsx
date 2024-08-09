import React, { useCallback, useEffect, useRef } from "react";
import { Board, IBoardRef } from "./board";
import { CellStatus, GameStatus } from "../../interfaces/game.interfaces";
import { Page } from "../../components/page";
import { findBestMove } from "../../algorithms/minmax";
import { Button } from "../../components/button";
import styled from "styled-components";
import { IResultRef, Result } from "../../components/result";


const ActionBar = styled.section`
    position: fixed;
    bottom: 50px;
    z-index: 1000;
`;

export const TicTacToePage = () => {
    const boardRef = useRef<IBoardRef>(null);
    const resultRef = useRef<IResultRef>(null);

    useEffect(() => {
        resultRef.current?.hide();
    });

    const onStatusChange = useCallback((status: GameStatus) => {
        if (status === GameStatus.OnGoing) return;
        console.log(status);

        setTimeout(() => {
            resultRef.current?.show(status);
        }, 400);
    }, []);

    const onPlayerPlaced = useCallback((board: CellStatus[][]) => {
        const res = findBestMove(board);

        boardRef.current?.placeChess(res.x, res.y);
    }, []);


    const onClickRestart = useCallback(() => {
        boardRef.current?.restart();
        resultRef.current?.hide();
    }, []);

    return (
        <Page>
            <Result ref={resultRef} />
            <Board onPlayerPlaced={onPlayerPlaced} onStatusChange={onStatusChange} ref={boardRef} />

            <ActionBar>
                <Button onClick={onClickRestart}>Restart</Button>
            </ActionBar>
        </Page>
    );
};

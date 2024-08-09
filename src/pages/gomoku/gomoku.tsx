import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { CellStatus, GameStatus } from "../../interfaces/game.interfaces";
import { Page } from "../../components/page";
import { Button } from "../../components/button";
import { IResultRef, Result } from "../../components/result";
import { Board, IBoardRef } from "./board";
import { findBestMove } from "../../algorithms/negmax";


const ActionBar = styled.section`
    position: fixed;
    bottom: 50px;
    z-index: 1000;
`;


export const GomokuPage = () => {
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
        }, 200);
    }, []);

    const onPlayerPlaced = useCallback((board: CellStatus[][]) => {
        resultRef.current?.show("loading");

        const res = findBestMove(board);
        console.log(res);
        setTimeout(() => {
            boardRef.current?.placeChess(res.x, res.y);
            resultRef.current?.hide();
        }, 500);
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

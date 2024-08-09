import React from "react";


const HEIGHT = window.innerHeight;
const WIDTH = window.innerWidth;
const BASE = HEIGHT < WIDTH ? HEIGHT : WIDTH;
const BOARD_SIZE = BASE * 0.6;

export const MARGIN_U = ((HEIGHT - BOARD_SIZE) / 2).toString() + 'px';
export const MARGIN_L = ((WIDTH - BOARD_SIZE) / 2).toString() + 'px';

const RATE = Math.round(BOARD_SIZE / 15);
const OFFSET = Math.ceil((BOARD_SIZE - RATE * 14) * 0.5);
const RADIUS = RATE * 0.4;


export function init(canvas: HTMLCanvasElement | null) {
    if (!canvas) {
        console.error("Canvas is null");
        return;
    }

    canvas.width = BOARD_SIZE;
    canvas.height = BOARD_SIZE;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        console.error("Canvas context is null");
        return;
    }

    for (let i = 0; i < 15; i++) {
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 2;
        ctx.moveTo(OFFSET + i * RATE, OFFSET);
        ctx.lineTo(OFFSET + i * RATE, BOARD_SIZE - OFFSET);
        ctx.stroke();

        ctx.moveTo(OFFSET, i * RATE + OFFSET);
        ctx.lineTo(BOARD_SIZE - OFFSET, i * RATE + OFFSET);
        ctx.stroke();
    }
}

export function draw(canvas: HTMLCanvasElement | null, x: number, y: number, turn: number) {
    const ctx = canvas?.getContext('2d');
    if (!ctx) {
        console.error("Canvas context is null");
        return;
    }

    const x1 = x * RATE + OFFSET;
    const y1 = y * RATE + OFFSET;

    ctx.fillStyle = turn % 2 === 0 ? "#000" : "#fff";

    ctx.beginPath();
    ctx.arc(x1, y1, RADIUS, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = turn % 2 === 0 ? " #fff" : " #000";
    ctx.font="20px sans-serif";
    const text = `${turn + 1}`;
    const x2 = x1 - RADIUS - text.length * 10 + 23;
    const y2 = y1 + RADIUS - 10;
    ctx.fillText(text, x2, y2);
};


export function click2Coordinates(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const cx = e.clientX - OFFSET - (WIDTH - BOARD_SIZE) / 2;
    const cy = e.clientY - OFFSET - (HEIGHT - BOARD_SIZE) / 2;

    const x = Math.round(cx / RATE), y = Math.round(cy / RATE);
    return { x, y };
}
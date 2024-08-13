import React from "react";


const HEIGHT = window.innerHeight;
const WIDTH = window.innerWidth;
const BASE = HEIGHT < WIDTH ? HEIGHT : WIDTH;
const BOARD_SIZE = BASE * 0.6;

export const RATE = Math.round(BOARD_SIZE / 15);
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
    const x2 = x1 - text.length * 10 + 8;
    const y2 = y1 + 5;
    ctx.fillText(text, x2, y2);
};


export function client2Coordinate(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const cx = e.clientX - OFFSET - (window.innerWidth- BOARD_SIZE) / 2;
    const cy = e.clientY - OFFSET - (window.innerHeight- BOARD_SIZE) / 2;

    const x = Math.round(cx / RATE), y = Math.round(cy / RATE);
    return { x, y };
}

export function coordinate2client(cx: number, cy: number) {
    const x = cx * RATE + OFFSET + (window.innerWidth - BOARD_SIZE) / 2;
    const y = cy * RATE + OFFSET + (window.innerHeight - BOARD_SIZE) / 2;

    return { x, y };
}
/*
 Credit : https://codepen.io/stanko/pen/emYEpvP?editors=0110
 */
import type { ReactNode } from "react";

 

const random = (min: number, max: number): number => {
    return Math.round(Math.random() * (max - min)) + min;
};


const getStripHTML = (top: number, stripHeight: number) => {
    const duration = random(3, 6);
    const name = `glitch-${duration}`;


    return (
        <div
            className="strip"
            style={{
                '--glitch-x-1': `${random(-10, 10)}em`,
                '--glitch-hue-1': `${random(-50, 50)}deg`,
                '--glitch-x-2': `${random(-10, 10)}em`,
                '--glitch-hue-2': `${random(-50, 50)}deg`,
                backgroundPosition: `0 -${top}em`,
                height: `${stripHeight}em`,
                animationName: name,
                animationDuration: `${duration * 1000}ms`,
                animationDelay: `${random(0, 2)}s`,
            } as React.CSSProperties}
        />
    );
};

export const getGlitchHTML = (height: number): ReactNode[] => {
    let i = 0;
    const html: ReactNode[] = [];

    while (1) {
        const stripHeight = random(1, 4);

        if (i + stripHeight < height) {
            const strip = getStripHTML(i, stripHeight);
            html.push(strip);
        } else {
            // Last strip
            const strip = getStripHTML(i, height - i);
            html.push(strip);
            break;
        }

        i = i + stripHeight;
    }

    return html;
};

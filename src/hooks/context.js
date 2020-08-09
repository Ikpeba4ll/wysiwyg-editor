import React, { createContext, useState } from "react";

// Here are the things that can live in the fabric context.
// type FabContext = [
//     // The canvas
//     fabric.Canvas | null,
//     // The setter for the canvas
//     (c: fabric.Canvas) => void
// ];

// This is the context that components in need of canvas-access will use:
export const FabricContext = createContext({
    canvas: null,
    initCanvas: () => {}
});

/**
 * This context provider will be rendered as a wrapper component and will give the
 * canvas context to all of its children.
 */
export const FabricContextProvider = ({ children }) => {
    const [canvas, setCanvas] = useState();

    const initCanvas = c => {
        console.log("context", c);
        setCanvas(c);
    };

    return (
        <FabricContext.Provider value={{ canvas, initCanvas }}>
            {children}
        </FabricContext.Provider>
    );
};

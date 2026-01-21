import { useState, useRef, type ReactNode } from "react";

type Position = {
    x: number;
    y: number;
};

type DraggableElementProps = {
    initialPosition: Position;
    children: ReactNode;
};

const DraggableElement = ({ initialPosition, children }: DraggableElementProps) => {
    const [position, setPosition] = useState<Position>(initialPosition);

    const offsetRef = useRef<Position>({ x: 0, y: 0 });
    const draggingRef = useRef(false);

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        draggingRef.current = true;

        offsetRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!draggingRef.current) return;

        setPosition({
            x: e.clientX - offsetRef.current.x,
            y: e.clientY - offsetRef.current.y,
        });
    };

    const onMouseUp = () => {
        draggingRef.current = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    };

    return (
        <div
            onMouseDown={onMouseDown}
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                cursor: "grab",
                userSelect: "none",
            }}
        >
            {children}
        </div>
    );
};

export default DraggableElement;
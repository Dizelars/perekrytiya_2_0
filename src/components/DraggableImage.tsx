import { useState, useRef } from "react";

type Position = {
    x: number;
    y: number;
};

type DraggableImageProps = {
    src: string;
    initialPosition: Position;
};

const DraggableImage = ({ src, initialPosition }: DraggableImageProps) => {
    const [position, setPosition] = useState<Position>(initialPosition);
    const offsetRef = useRef<Position>({ x: 0, y: 0 });
    const draggingRef = useRef<boolean>(false);

    const onMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
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
        <img
            src={src}
            onMouseDown={onMouseDown}
            draggable={false}
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                opacity: 0.7,
                width: "700px",
                height: "auto",
                cursor: "grab",
                userSelect: "none",
            }}
        />
    );
};

export default DraggableImage;
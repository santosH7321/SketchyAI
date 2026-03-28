import { ToolType } from '@/lib/constants'
import { useEditorStore } from '@/store/useEditorState'
import { Point } from '@/types'
import { useCallback, useEffect, useRef } from 'react'

const ImageEditor = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const startPosRef = useRef<Point | null>(null);
    const isDrawingRef = useRef<boolean>(false);

    const {image, selectedTool, brushSize} = useEditorStore()

    const draw = useCallback(() => {
        if(!canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d")

        if(!ctx || !imgRef.current) return;

        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        ctx.drawImage(imgRef.current, 0, 0, )
        
    }, [])

    useEffect(() => {
        if(!image) return;

        const img = new Image();
        img.src = image;

        img.onload = () => {
            imgRef.current = img;

            canvasRef.current!.width = img.naturalWidth;
            canvasRef.current!.height = img.naturalHeight;

            // prepare intial mask
            maskCanvasRef.current = document.createElement("canvas");
            maskCanvasRef.current.width = img.width;
            maskCanvasRef.current.height = img.height;
            
            const maskCtx = maskCanvasRef.current.getContext('2d');

            if(maskCtx) {
                maskCtx.fillStyle = 'black';
                maskCtx.fillRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);

            }

            draw()
        };
    }, [image, draw]);

    const startDrawing = (e: React.PointerEvent) => {
        if(selectedTool === ToolType.MOVE) return;
        if(e.pointerType !== 'mouse') return;

        e.preventDefault();

        isDrawingRef.current = true;

        const pos = getPointerPos(e);
        startPosRef.current = pos;

        if(selectedTool === ToolType.BRUSH || selectedTool === ToolType.ERASER) {
            updateMask(pos, pos);
        }
    };

    const updateMask = (start: Point, end: Point) => {
        if(!maskCanvasRef.current) return;

        const ctx = maskCanvasRef.current.getContext('2d');
        if(!ctx) return;

        ctx.lineWidth = brushSize;
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        if(selectedTool === ToolType.ERASER) {
            ctx.strokeStyle = 'black'
            ctx.fillStyle = 'black'
        } else if(selectedTool === ToolType.BRUSH) {
            ctx.strokeStyle = 'white'
            ctx.fillStyle = 'white'
        }


        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    };

    const getPointerPos = ( e: React.PointerEvent) => {
        if(!canvasRef.current) return {x: 0, y: 0};

        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
        const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);

        return {x, y};
    };

    const drawMove = (e: React.PointerEvent) => {
        if(!isDrawingRef.current) return;
        const startPos = startPosRef.current;
        if(!startPos) return;

        e.preventDefault();

        const currentPos = getPointerPos(e);

        if(selectedTool === ToolType.BRUSH || selectedTool === ToolType.ERASER){
            updateMask(startPos, currentPos);
            startPosRef.current = currentPos;
        }
    };

    const endDrawing = () => {
        isDrawingRef.current = false;
    };


    return (
        <div className='w-full h-full flex-col items-center justify-center'>
            <canvas 
                onPointerDown={startDrawing}
                onPointerMove={drawMove}
                onPointerUp={endDrawing}
                ref={canvasRef}
                className='max-w-full max-h-full object-cover'
            ></canvas>

            <canvas
                ref={maskCanvasRef}
                className='max-w-full max-h-full'
            ></canvas>
        </div>
    )
}

export default ImageEditor
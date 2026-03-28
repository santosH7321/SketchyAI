import { ToolType } from '@/lib/constants'
import { useEditorStore } from '@/store/useEditorState'
import { useCallback, useEffect, useRef } from 'react'

const ImageEditor = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const {image, selectedTool} = useEditorStore()

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
            draw()
        };
    }, [image, draw]);

    const startDrawing = (e: React.PointerEvent) => {
        if(selectedTool === ToolType.MOVE) return;
        
    };

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <canvas 
                onPointerDown={startDrawing}
                ref={canvasRef}
                className='max-w-full max-h-full object-cover'
            ></canvas>
        </div>
    )
}

export default ImageEditor
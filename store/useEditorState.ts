import { create } from "zustand"
import { devtools } from "zustand/middleware"

type EditorState = {
    image: string | null;
    prompt: string;
    history: string[];
    historyIndex: number;
    setHistory: (history: string[]) => void;
    setHistoryIndex: (index: number) => void;
    setImage: (imageData: string) => void;
    setPrompt: (prompt: string) => void;
    generateEdit: () => Promise<void>;
}

export const useEditorStore = create<EditorState>()(
    devtools((set, get) => ({
        image: null,
        prompt: "",
        history: [],
        historyIndex: 0,
        setImage: (imageData: string) => set({ image: imageData, history: [imageData] }),
        setHistory: (history) => set({history}),
        setHistoryIndex: (index: number) => {
            const state = get();
            return set({
                historyIndex: index,
                image: state.history[index]
            });
        },
            
        generateEdit: async () => {
            const state = get();
            
            const response = await fetch("/api/edit-image", {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({imageBase64: state.image, prompt: state.prompt})
            })

            if(!response.ok){
                throw new Error("Failed to generate.")
            }

            const data = await response.json();

            const cloneHistory = [...state.history, data.result]

            set(() => ({ 
                image: data.result,
                history: cloneHistory,
                historyIndex: state.history.length,
            }))
        },
        setPrompt: (prompt: string) => set({ prompt }),
    })),
)
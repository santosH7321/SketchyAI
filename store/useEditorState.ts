import { FileUIPart } from "ai";
import { create } from "zustand"
import { devtools } from "zustand/middleware"

type EditorState = {
    image: string | null;
    prompt: string;
    history: string[];
    historyIndex: number;
    showHistory: boolean;
    setHistory: (history: string[]) => void;
    setHistoryIndex: (index: number) => void;
    toggleHistory: () => void;
    isLoading: boolean;
    userFiles: FileUIPart[],
    setUserFiles: (files: FileUIPart[]) => void;
    setLoading: (val: boolean) => void;
    undo: () => void;
    redo: () => void;
    setImage: (imageData: string) => void;
    setPrompt: (prompt: string) => void;
    generateEdit: () => Promise<void>;
    applyFilter: (prompt: string) => void;
}

export const useEditorStore = create<EditorState>()(
    devtools((set, get) => ({
        image: null,
        prompt: "",
        history: [],
        historyIndex: 0,
        showHistory: false,
        isLoading: false,
        userFiles: [],
        setUserFiles: (files: FileUIPart[]) => {
            set({userFiles: files})
        },
        setImage: (imageData: string) => set({ image: imageData, history: [imageData] }),
        setHistory: (history) => set({history}),
        setHistoryIndex: (index: number) => {
            const state = get();
            return set({
                historyIndex: index,
                image: state.history[index]
            });
        },

        undo: () => {
            const state = get();
            
            if(state.historyIndex > 0) {
                const newIndex = state.historyIndex - 1;
                set({
                    image: state.history[newIndex],
                    historyIndex: newIndex,
                });
            }
            
        },

        redo: () => {
            const state = get();

            if(state.historyIndex < state.history.length - 1){
                const newIndex = state.historyIndex + 1;

                set({
                    image: state.history[newIndex],
                    historyIndex: newIndex,
                });
            }
            
        },

        toggleHistory: () => {
            const state = get();
            if(state.history.length) {
                set({
                    showHistory: !state.showHistory,
                });
            }
        },
        setLoading: (val: boolean) => {
            set({
                isLoading: val,
            })
        },
        generateEdit: async () => {
            const state = get();
            set({isLoading: true})
            
            const response = await fetch("/api/edit-image", {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({
                    imageBase64: state.image, 
                    prompt: state.prompt,
                    userFiles: state.userFiles,
                })
            })

            if(!response.ok){
                set({isLoading: false})
                throw new Error("Failed to generate.")
            }

            const data = await response.json();

            const cloneHistory = [...state.history, data.result]

            set(() => ({ 
                image: data.result,
                history: cloneHistory,
                historyIndex: state.history.length,
                isLoading: false,
            }))
        },

    applyFilter: async (prompt: string) => {
        const state = get();

        const finalPrompt = `
            ${prompt}
            TECHNICAL CONSTRAINTS:
            1. STRICTLY PRESERVE COMPOSITION: Do not change the subject's pose, the camera angle, or the placement of objects.
            2. OUTPUT FORMAT: This is a style transfer. Keep the underlying structure of the image identical to the original, only changing the texture, lighting, and colors to match the requested style.
        `;

        set({ isLoading: true });

        const response = await fetch("/api/edit-image", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            imageBase64: state.image,
            prompt: finalPrompt,
            }),
        });

        if (!response.ok) {
            set({ isLoading: false });
            throw new Error("failed to generate.");
        }

        const data = await response.json();
        const clonedHistory = [...state.history, data.result];

        set(() => ({
            image: data.result,
            history: clonedHistory,
            historyIndex: state.history.length,
            isLoading: false,
        }));
    },

        setPrompt: (prompt: string) => set({ prompt }),
    })),
)
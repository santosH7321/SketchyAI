import { LeftSidebar } from "@/components/left-sidebar";
import { Navbar } from "@/components/navbar";
import { AIPromptInput } from "@/components/prompt-input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  const imageSelected = false;
  return (
    <div className="w-full h-dvh flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 flex min-h-0 overflow-hidden">
          <LeftSidebar />

          <main className="flex-1 flex flex-col min-w-0 bg-zinc-900/50 relative">
            <div className="flex-1 relative overflow-hidden w-full h-full">
              <div className="w-full h-full flex items-center justify-center p-6 md:p-10">
                {!imageSelected ? (
                  <div className="text-center space-y-6 max-w-sm z-10 ">
                    <div className="w-24 h-24 bg-zinc-900/50 rounded-3xl border border-zinc-800 flex items-center justify-center mx-auto shadow-2xl shadow-yellow-900/10">
                      <Image
                        src={"/logo.svg"}
                        width={500}
                        height={500}
                        alt="logo"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-100">
                        Start Creating
                      </h3>
                      <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
                        Upload an image to unlock the full potential of{" "}
                        <span className="text-yellow-500 font-medium">
                          Sketchy AI
                        </span>{" "}
                        is an AI tools.
                      </p>
                    </div>
                    <Button
                      className="w-full h-11 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold rounded-xl transition-all hover:scale-[1.02]"
                    >
                      Select Image
                    </Button>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    IMAGE EDITOR COMPONENT
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 bg-zinc-950 border-t border-zinc-800 p-4 lg:p-6 z-40">
                <AIPromptInput />
            </div>
          </main>
      </div>
    </div>
  )
}

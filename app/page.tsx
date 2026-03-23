import { LeftSidebar } from "@/components/left-sidebar";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="w-full h-dvh flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 flex min-h-0 overflow-hidden">
          <LeftSidebar />
      </div>
    </div>
  )
}

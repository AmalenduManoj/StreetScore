import LiveScore from "@/Components/LiveScore";
import Navbar from "@/Components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-screen h-screen bg-zinc-900 text-white">
      <Navbar />
      <LiveScore />
    </div>
  );
}

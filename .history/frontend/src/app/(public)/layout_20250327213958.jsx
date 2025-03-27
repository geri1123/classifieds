import { Geist } from "next/font/google";
import Navbar from "@/components/navbars/Navbar";  // Assuming you have a navbar component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function PublicLayout({ children }) {
  return (
    <div className="bg-gray-200">
        <Navbar /> {/* This is the navbar for public pages */}
        <main>{children}</main>
        </div>
   
  );
}
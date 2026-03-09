import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { UserProfileProvider } from "@/context/UserProfileContext";
import { Footer } from "@/components/Footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});

export const metadata = {
  title: "Career Intelligence Platform",
  description: "Generate highly personalized AI career roadmaps",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} font-sans flex flex-col min-h-screen antialiased`}
      >
        <AuthProvider>
          <UserProfileProvider>
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <Footer />
          </UserProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

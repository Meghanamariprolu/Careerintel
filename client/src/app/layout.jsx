import { Plus_Jakarta_Sans } from"next/font/google";
import"./globals.css";
import { AuthProvider } from"@/context/AuthContext";
import { UserProfileProvider } from"@/context/UserProfileContext";
import { Footer } from"@/components/Footer";
import { Toaster } from"sonner";
const plusJakartaSans = Plus_Jakarta_Sans({
  variable:"--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["200","300","400","500","600","700","800"],
});

export const metadata = {
  title: {
    default:"CareerIntel | AI Career Roadmap Generator",
    template:"%s | CareerIntel"
  },
  description:"Generate highly personalized AI career roadmaps, discover skill gaps, and accelerate your tech career with real-time market intelligence.",
  keywords: ["AI Career Coach","Career Roadmap","Tech Career Transition","Skill Gap Analysis","Resume AI"],
  authors: [{ name:"CareerIntel Team" }],
  creator:"CareerIntel",
  openGraph: {
    type:"website",
    locale:"en_US",
    url:"https://careerintel.io",
    title:"CareerIntel | AI Career Roadmap Generator",
    description:"Navigate your tech career with precision using AI-generated learning paths and market intelligence.",
    siteName:"CareerIntel",
  },
  twitter: {
    card:"summary_large_image",
    title:"CareerIntel | AI Career Roadmap Generator",
    description:"Navigate your tech career with precision using AI.",
    creator:"@careerintel",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} font-sans flex flex-col min-h-screen antialiased`}
      >
        <AuthProvider>
          <UserProfileProvider>
            <Toaster position="top-right" theme="dark" richColors />
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

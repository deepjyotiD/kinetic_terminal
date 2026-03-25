"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isLanding = pathname === "/";
  
  const [showSettings, setShowSettings] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [myUsername, setMyUsername] = useState("torvalds");

  const { isSignedIn } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem("kinetic_username");
    if (saved) {
      setMyUsername(saved);
      setUsernameInput(saved);
    }
  }, []);

  const saveSettings = () => {
    if (usernameInput.trim()) {
      localStorage.setItem("kinetic_username", usernameInput.trim());
      setMyUsername(usernameInput.trim());
    }
    setShowSettings(false);
  };

  const handleProfileClick = () => {
    router.push(`/profile/${myUsername}`);
  };

  const handleComingSoon = (feature: string) => {
    alert(`[SYSTEM] ${feature} module is currently offline. Available in v1.1.0-stable update.`);
  };

  return (
    <>
      <header className="fixed top-0 w-full z-40 flex justify-between items-center px-6 h-16 bg-surface/95 backdrop-blur-sm font-[family-name:var(--font-headline)] tracking-tight">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tighter text-primary"
          >
            Kinetic Terminal
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`transition-colors ${
                isLanding
                  ? "text-primary border-b-2 border-primary pb-1 font-bold"
                  : "text-on-surface/70 hover:text-on-surface"
              }`}
            >
              Dashboard
            </Link>
            <button
              onClick={() => handleComingSoon("Repositories View")}
              className="text-on-surface/70 hover:text-on-surface transition-colors"
            >
              Repositories
            </button>
            <button
              onClick={() => handleComingSoon("Analytics Engine")}
              className="text-on-surface/70 hover:text-on-surface transition-colors"
            >
              Analytics
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleComingSoon("Notifications")}
            className="p-2 text-on-surface/70 hover:bg-surface-container-high transition-all rounded-lg active:scale-95"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button 
            onClick={() => {
              setUsernameInput(myUsername);
              setShowSettings(true);
            }}
            className="p-2 text-on-surface/70 hover:bg-surface-container-high transition-all rounded-lg active:scale-95 flex items-center justify-center mr-2"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
          
          {isSignedIn ? (
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8 rounded-full border border-primary/20 hover:border-primary/50",
                  userButtonPopoverCard: "bg-surface-container-low border border-primary/20",
                  userButtonPopoverActionButtonText: "text-on-surface",
                }
              }} 
            />
          ) : (
            <SignInButton mode="modal">
              <button className="px-4 py-1.5 text-xs font-[family-name:var(--font-label)] font-bold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg transition-all active:scale-95">
                SIGN IN
              </button>
            </SignInButton>
          )}
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <div className="bg-surface-container-low border border-outline-variant/20 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">terminal</span>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-headline)]">System Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-[family-name:var(--font-label)] text-on-surface-variant uppercase tracking-widest mb-2">
                  My GitHub Username
                </label>
                <input 
                  type="text" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                  placeholder="e.g. torvalds"
                />
                <p className="text-xs text-on-surface-variant mt-2">
                  This username will be used when you click the Profile icon in the top right.
                </p>
              </div>
              
              <button 
                onClick={saveSettings}
                className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all"
              >
                SAVE CONFIGURATION
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

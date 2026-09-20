
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AudioWaveform,
  ChevronDown,
  UserRound,
  Mail,
  LogOut,
} from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userName = localStorage.getItem("userName") || "User";
  const userEmail =
    localStorage.getItem("userEmail") || "No email available";

  const userInitials = (() => {
    if (!userName) return "U";

    const cleanName = userName.includes("@")
      ? userName.split("@")[0]
      : userName;

    const parts = cleanName
      .trim()
      .split(/[\s._-]+/)
      .filter(Boolean);

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return cleanName.slice(0, 2).toUpperCase() || "U";
  })();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");

    navigate("/login");
  };

  const handleProfileToggle = () => {
    setIsProfileOpen((previous) => !previous);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/70 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <AudioWaveform className="w-5 h-5 text-white" />
          </div>

          <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Text-to-Speech
          </span>
        </div>

        {/* User Profile Area */}
        <div className="relative">
          <button
            type="button"
            onClick={handleProfileToggle}
            className="flex items-center gap-2 sm:gap-3 bg-slate-950/60 border border-slate-800 hover:border-slate-700 px-2.5 sm:px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
            aria-label="Open user profile"
            aria-expanded={isProfileOpen}
          >
            {/* User Initials */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white uppercase">
              {userInitials}
            </div>

            {/* User Name */}
            <span className="text-xs font-medium text-slate-300 hidden sm:inline-block max-w-[150px] truncate">
              {userName}
            </span>

            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-14 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/40 p-4 z-50">
              {/* Profile Heading */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white uppercase">
                  {userInitials}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {userName}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    Signed-in account
                  </p>
                </div>
              </div>

              {/* Full Name */}
              <div className="flex items-start gap-3 py-3 border-b border-slate-800">
                <UserRound className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    Full Name
                  </p>

                  <p className="text-sm text-slate-200 break-words mt-1">
                    {userName}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 py-3 border-b border-slate-800">
                <Mail className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    Email Address
                  </p>

                  <p className="text-sm text-slate-200 break-all mt-1">
                    {userEmail}
                  </p>
                </div>
              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full mt-3 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer flex items-center gap-2 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
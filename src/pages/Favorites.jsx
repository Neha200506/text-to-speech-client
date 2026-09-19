import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AudioWaveform,
  Search,
  Download,
  Heart,
  Calendar,
  Globe,
  Mic,
  ArrowLeft,
  X,
} from "lucide-react";
import {
  getFavorites,
  toggleFavoriteStatus,
} from "../services/speechStorage";
import AudioPlayer from "../components/AudioPlayer";

const Favorites = () => {
  const userEmail = localStorage.getItem("userEmail") || "";
  const storedName = localStorage.getItem("userName");
  const userName =
    storedName && storedName !== "neharedekar17" ? storedName : "Neha Redekar";
  const userInitials = (() => {
    if (!userName) return "NR";
    const cleanName = userName.includes("@") ? userName.split("@")[0] : userName;
    const parts = cleanName.trim().split(/[\s._-]+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return cleanName.slice(0, 2).toUpperCase() || "NR";
  })();

  const [searchQuery, setSearchQuery] = useState("");
  const [favoritesList, setFavoritesList] = useState([]);

  const reloadFavorites = () => {
    const list = getFavorites(userEmail);
    setFavoritesList(list);
  };

  useEffect(() => {
    reloadFavorites();
  }, [userEmail]);

  const handleRemoveFavorite = (id) => {
    toggleFavoriteStatus(id, userEmail);
    reloadFavorites();
  };

  const filteredList = favoritesList.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.text.toLowerCase().includes(query) ||
      item.language.toLowerCase().includes(query) ||
      item.voice.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Ambient background glow effects */}
      <div className="absolute top-10 -left-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/70 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <AudioWaveform className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Text-to-Speech
            </span>
          </Link>

          {/* Right Navigation & User Profile */}
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 px-3.5 py-1.5 rounded-full">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                {userInitials}
              </div>
              <span className="text-xs font-medium text-slate-300 hidden sm:inline-block">
                {userName}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        {/* Page Title & Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="sm:hidden text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <span>Favorite Speech</span>
              </h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Quickly access your saved and favorite speech.
            </p>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 shadow-xl shadow-purple-950/10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search favorites by text, language, or voice..."
              className="w-full pl-11 pr-10 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Favorites List or Empty State */}
        {filteredList.length > 0 ? (
          <div className="space-y-4">
            {filteredList.map((item) => {
              return (
                <div
                  key={item.id}
                  className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 shadow-xl shadow-purple-950/10 transition-all space-y-4"
                >
                  {/* Top Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      {/* Language Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-medium">
                        <Globe className="w-3.5 h-3.5" />
                        {item.language}
                      </span>

                      {/* Voice Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 font-medium">
                        <Mic className="w-3.5 h-3.5" />
                        {item.voice}
                      </span>
                    </div>

                    {/* Date/Time Stamp */}
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Text Preview */}
                  <div>
                    <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                      "{item.text}"
                    </p>
                  </div>

                  {/* Single-Playback Audio Player */}
                  {item.audio && (
                    <div className="pt-1">
                      <AudioPlayer id={item.id} audioUrl={item.audio} />
                    </div>
                  )}

                  {/* Controls / Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/40">
                    <div></div>

                    {/* Action Icons (Remove Favorite & Download) */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveFavorite(item.id)}
                        className="p-2.5 rounded-xl border border-pink-500/40 bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 transition-colors cursor-pointer"
                        title="Remove from favorites"
                      >
                        <Heart className="w-4 h-4 fill-pink-500" />
                      </button>

                      {item.audio ? (
                        <a
                          href={item.audio}
                          download="generated-speech.mp3"
                          className="px-4 py-2.5 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                        >
                          <Download className="w-4 h-4 text-purple-400" />
                          <span>Download</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-12 text-center shadow-xl shadow-purple-950/10 space-y-5 my-8">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mx-auto text-pink-500">
              <Heart className="w-8 h-8 fill-pink-500/20" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">
                No favorite speech items
              </h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                {searchQuery
                  ? "No favorite speech items found matching your search filter."
                  : "You haven't saved any speech clips to your favorites yet. Generate speech and tap the heart icon to save them here."}
              </p>
            </div>
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>Clear search filter</span>
              </button>
            ) : (
              <div className="pt-2">
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/25 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Dashboard</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;

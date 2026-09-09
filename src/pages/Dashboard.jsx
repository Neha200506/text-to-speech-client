import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AudioWaveform,
  Sparkles,
  Volume2,
  Play,
  Pause,
  Download,
  Heart,
  History,
  Globe,
  Mic,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const voiceOptions = {
  English: [
    { id: "en-female", name: "Female Voice" },
    { id: "en-male", name: "Male Voice" },
  ],

  Hindi: [
    { id: "hi-female", name: "Female Voice" },
    { id: "hi-male", name: "Male Voice" },
  ],

  Marathi: [
    { id: "mr-female", name: "Female Voice" },
    { id: "mr-male", name: "Male Voice" },
  ],

  German: [
    { id: "de-female", name: "Female Voice" },
    { id: "de-male", name: "Male Voice" },
  ],
};

const Dashboard = () => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("English");
  const [voice, setVoice] = useState(voiceOptions["English"][0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [volume, setVolume] = useState(80);

  // Character & word counts
  const charCount = text.length;
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const MAX_CHARS = 5000;

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setVoice(voiceOptions[selectedLang][0].id);
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    if (val.length > MAX_CHARS) {
      setValidationError(`Maximum limit of ${MAX_CHARS} characters exceeded.`);
    } else {
      setValidationError("");
    }
  };

  const handleGenerateSpeech = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setValidationError("Please enter some text to generate speech.");
      return;
    }
    if (text.length > MAX_CHARS) {
      setValidationError(
        `Text exceeds the maximum ${MAX_CHARS} character limit.`,
      );
      return;
    }

    setValidationError("");
    setIsGenerating(true);
    setIsPlaying(false);

    // Simulate generation UI delay for state interaction
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 1200);
  };

  const currentVoiceObj = voiceOptions[language]?.find((v) => v.id === voice);

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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <AudioWaveform className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Text-to-Speech
            </span>
          </div>

          {/* User Profile Area */}
          <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 px-3.5 py-1.5 rounded-full">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
              JD
            </div>
            <span className="text-xs font-medium text-slate-300 hidden sm:inline-block">
              John Doe
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        {/* Page Title & Section Navigation Cards */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Convert your written text into high-quality, natural AI voices.
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-purple-900/40 to-slate-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-5 shadow-lg flex items-center gap-4 cursor-pointer transition-all hover:border-purple-500/50">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">
                  Generate Speech
                </h3>
                <p className="text-xs text-purple-300/80 mt-0.5">
                  Create new audio clips
                </p>
              </div>
            </div>

            <Link
              to="/history"
              className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-md flex items-center gap-4 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-slate-400 group-hover:text-purple-400 flex items-center justify-center border border-slate-700/50 transition-colors">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">History</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  View recent generations
                </p>
              </div>
            </Link>

            <Link
              to="/favorites"
              className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-md flex items-center gap-4 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-slate-400 group-hover:text-pink-400 flex items-center justify-center border border-slate-700/50 transition-colors">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">
                  Favorites
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Saved audio clips
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Text Input Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-purple-950/20 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>Enter your text</span>
            </h2>
          </div>

          <div className="space-y-2">
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Type or paste your text here..."
              rows={6}
              className={`w-full p-4 bg-slate-950/70 border ${
                validationError
                  ? "border-red-500/70 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-800 focus:border-purple-500 focus:ring-purple-500"
              } rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all duration-200 text-sm leading-relaxed resize-y font-normal`}
            />

            {/* Counts & Validation Bar */}
            <div className="flex items-center justify-between text-xs px-1">
              <div>
                {validationError ? (
                  <span className="text-red-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {validationError}
                  </span>
                ) : (
                  <span className="text-slate-400 font-medium">
                    Word count:{" "}
                    <strong className="text-slate-200">{wordCount}</strong>
                  </span>
                )}
              </div>

              <div className="text-slate-400 font-medium">
                Character count:{" "}
                <span
                  className={
                    charCount > MAX_CHARS
                      ? "text-red-400 font-semibold"
                      : charCount > MAX_CHARS * 0.9
                        ? "text-amber-400 font-semibold"
                        : "text-slate-200"
                  }
                >
                  {charCount} / {MAX_CHARS}
                </span>
              </div>
            </div>
          </div>

          {/* Controls Bar: Language, Voice, Generate Speech */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 items-end">
            {/* Language Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>Language</span>
              </label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-full px-3.5 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
                <option value="German">German</option>
              </select>
            </div>

            {/* Voice Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-blue-400" />
                <span>Voice</span>
              </label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
              >
                {voiceOptions[language]?.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Speech Button */}
            <div>
              <button
                type="button"
                onClick={handleGenerateSpeech}
                disabled={isGenerating}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-60 text-white font-medium text-sm rounded-xl shadow-lg shadow-purple-600/25 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating Speech...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Generate Speech</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Generated Audio Card Section */}
        {isGenerated && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-purple-950/20 space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">
                    Generated Audio
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language} • {currentVoiceObj?.name}
                  </p>
                </div>
              </div>

              {/* Action buttons (Favorite & Download) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isFavorite
                      ? "bg-pink-500/10 border-pink-500/40 text-pink-500"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                  title={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorite ? "fill-pink-500" : ""}`}
                  />
                </button>

                <button
                  type="button"
                  className="px-4 py-2.5 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-purple-400" />
                  <span>Download Audio</span>
                </button>
              </div>
            </div>

            {/* Audio Controls UI */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
              {/* Play/Pause Button */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition-all cursor-pointer shrink-0"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                )}
              </button>

              {/* Progress Bar & Timestamps */}
              <div className="flex-1 w-full space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{isPlaying ? "0:18" : "0:00"}</span>
                  <span>0:45</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full relative cursor-pointer overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300"
                    style={{ width: isPlaying ? "40%" : "0%" }}
                  />
                </div>
              </div>

              {/* Volume Slider UI */}
              <div className="flex items-center gap-2 sm:pl-2 shrink-0">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-20 accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

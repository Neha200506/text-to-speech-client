import { useState, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import {
  playAudioItem,
  stopActiveAudio,
  subscribeAudioState,
  getActiveAudioId,
} from "../utils/audioManager";

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const AudioPlayer = ({ id, audioUrl, className = "" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Check if this audio is currently the active one
    const activeId = getActiveAudioId();
    if (activeId !== id) {
      setIsPlaying(false);
      setCurrentTime(0);
    }

    const unsubscribe = subscribeAudioState((data) => {
      if (data.id === id) {
        setIsPlaying(data.isPlaying);
        if (typeof data.currentTime === "number") {
          setCurrentTime(data.currentTime);
        }
        if (typeof data.duration === "number" && data.duration > 0) {
          setDuration(data.duration);
        }
      } else {
        // Another audio started or stopped -> reset this player to 0
        setIsPlaying(false);
        setCurrentTime(0);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  const handleTogglePlay = () => {
    if (!audioUrl) return;
    playAudioItem(id, audioUrl);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`bg-slate-950/70 border border-slate-800/90 rounded-xl p-3 flex items-center gap-3 shadow-inner ${className}`}
    >
      {/* Play / Pause Toggle Button */}
      <button
        type="button"
        onClick={handleTogglePlay}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
          isPlaying
            ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/40"
            : "bg-slate-900 hover:bg-slate-800 text-purple-400 border border-slate-800 hover:border-slate-700"
        }`}
        title={isPlaying ? "Stop audio" : "Play audio"}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      {/* Progress Bar & Timestamps */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-purple-400" />
            <span>{formatTime(currentTime)}</span>
          </span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Custom Progress Track */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800/80 relative">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-100"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;

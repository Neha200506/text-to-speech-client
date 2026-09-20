
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ArrowLeft,
} from "lucide-react";

import {
  getFavorites,
  toggleFavoriteStatus,
} from "../services/speechStorage";

import AudioPlayer from "../components/AudioPlayer";
import Header from "../components/Header";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getFavorites();

      setFavorites(data);
    } catch (error) {
      console.error("Favorites loading error:", error);

      setError(
        error.message || "Unable to load favorites."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchFavorites = async () => {
      try {
        const data = await getFavorites();

        if (isMounted) {
          setFavorites(data);
        }
      } catch (error) {
        console.error("Favorites loading error:", error);

        if (isMounted) {
          setError(
            error.message || "Unable to load favorites."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRemoveFavorite = async (id) => {
    try {
      await toggleFavoriteStatus(id);
      await loadFavorites();
    } catch (error) {
      console.error("Remove favorite error:", error);

      setError(
        error.message || "Unable to remove favorite."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Heart className="w-7 h-7 text-pink-400" />
              Favorites
            </h1>

            <p className="text-slate-400 text-sm mt-2">
              Your saved speech clips.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        {isLoading && (
          <div className="text-center py-12 text-slate-400">
            Loading favorites...
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {!isLoading && !error && favorites.length === 0 && (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
            <Heart className="w-12 h-12 mx-auto text-slate-600 mb-4" />

            <h2 className="text-lg font-semibold text-white">
              No favorites yet
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Mark generated speech as favorite to see it here.
            </p>
          </div>
        )}

        <div className="space-y-5">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs bg-purple-500/10 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full">
                      {item.language}
                    </span>

                    <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full">
                      {item.voice}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-3">
                    {item.date}
                  </p>

                  <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {item.text}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveFavorite(item.id)}
                  className="p-2.5 rounded-xl border border-pink-500/40 bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 transition-colors"
                  title="Remove from favorites"
                >
                  <Heart
                    className="w-4 h-4"
                    fill="currentColor"
                  />
                </button>
              </div>

              {item.audio && (
                <div className="mt-5 pt-4 border-t border-slate-800">
                  <AudioPlayer
                    id={item.id}
                    audioUrl={item.audio}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Favorites;
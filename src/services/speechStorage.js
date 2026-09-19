/**
 * SpeechStorage service for persisting generated speech items in localStorage
 * scoped by user email.
 */

const STORAGE_KEY = "tts_speech_history";

export const getHistory = (userEmail) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const items = JSON.parse(raw);
    if (!Array.isArray(items)) return [];
    if (!userEmail) return items;
    return items.filter(
      (item) => item.userEmail?.toLowerCase() === userEmail.toLowerCase(),
    );
  } catch (error) {
    console.error("Error reading speech history from localStorage:", error);
    return [];
  }
};

export const getFavorites = (userEmail) => {
  const history = getHistory(userEmail);
  return history.filter((item) => item.isFavorite);
};

export const saveSpeechItem = (newItem) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const formattedDate = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const itemToSave = {
      id: newItem.id || Date.now().toString(),
      userEmail: newItem.userEmail || localStorage.getItem("userEmail") || "default@user.com",
      text: newItem.text,
      language: newItem.language,
      voice: newItem.voice,
      audio: newItem.audio,
      date: newItem.date || formattedDate,
      createdAt: newItem.createdAt || Date.now(),
      isFavorite: !!newItem.isFavorite,
    };

    const updated = [itemToSave, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return itemToSave;
  } catch (error) {
    console.error("Error saving speech item to localStorage:", error);
    return null;
  }
};

export const toggleFavoriteStatus = (id, userEmail) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const items = JSON.parse(raw);
    let newFavState = false;
    const updated = items.map((item) => {
      if (item.id === id) {
        newFavState = !item.isFavorite;
        return { ...item, isFavorite: newFavState };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newFavState;
  } catch (error) {
    console.error("Error toggling favorite status:", error);
    return false;
  }
};

export const deleteSpeechItem = (id, userEmail) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const items = JSON.parse(raw);
    const updated = items.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error deleting speech item:", error);
  }
};

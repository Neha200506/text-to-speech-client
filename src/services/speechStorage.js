
/**
 * SpeechStorage service
 * Uses the backend API and Supabase for speech history.
 */

const API_BASE_URL = "http://localhost:5000/api/history";

// Get authentication headers
const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
};

// Convert backend data into frontend format
const formatSpeechItem = (item) => {
  return {
    id: item.id,
    userEmail: localStorage.getItem("userEmail") || "",
    text: item.text,
    language: item.language,
    voice: item.voice,
    audio: item.audio,
    date: item.date,
    createdAt: item.created_at,
    isFavorite: item.is_favorite,
  };
};

// Handle API errors
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong with the request."
    );
  }

  return data;
};

// Get all speech history
export const getHistory = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const result = await handleResponse(response);

    return (result.data || []).map(formatSpeechItem);
  } catch (error) {
    console.error("Error fetching speech history:", error);
    throw error;
  }
};

// Get favorite speech items
export const getFavorites = async () => {
  try {
    const history = await getHistory();

    return history.filter((item) => item.isFavorite);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};

// Save a new speech item
export const saveSpeechItem = async (newItem) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        text: newItem.text,
        language: newItem.language,
        voice: newItem.voice,
        audio: newItem.audio,
        date: newItem.date,
        isFavorite: !!newItem.isFavorite,
      }),
    });

    const result = await handleResponse(response);

    return result.data ? formatSpeechItem(result.data) : null;
  } catch (error) {
    console.error("Error saving speech item:", error);
    throw error;
  }
};

// Toggle favorite status
export const toggleFavoriteStatus = async (id) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/${id}/favorite`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );

    const result = await handleResponse(response);

    return result.data
      ? formatSpeechItem(result.data).isFavorite
      : false;
  } catch (error) {
    console.error("Error toggling favorite status:", error);
    throw error;
  }
};

// Delete speech history item
export const deleteSpeechItem = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    await handleResponse(response);

    return true;
  } catch (error) {
    console.error("Error deleting speech item:", error);
    throw error;
  }
};
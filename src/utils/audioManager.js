/**
 * Centralized Audio Manager to guarantee single-audio playback across the application.
 *
 * Rules Enforced:
 * 1. Only ONE audio plays at any time across History, Favorites, and Dashboard.
 * 2. Pausing the currently selected audio preserves its currentTime so clicking Play again resumes from where it was paused.
 * 3. Clicking a different audio immediately pauses & resets the previous audio to 0s, and starts the new audio from 0s.
 * 4. When an audio finishes naturally, its playback position resets to 0s and state updates correctly.
 */

let activeAudioInstance = null;
let activeAudioId = null;
let listeners = new Set();

const notifyListeners = (data) => {
  listeners.forEach((listener) => {
    try {
      listener(data);
    } catch (e) {
      console.error("Audio listener error:", e);
    }
  });
};

export const subscribeAudioState = (listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getActiveAudioId = () => activeAudioId;

export const stopActiveAudio = () => {
  if (activeAudioInstance) {
    const previousId = activeAudioId;
    try {
      activeAudioInstance.pause();
      activeAudioInstance.currentTime = 0;
    } catch (e) {
      console.error("Error stopping audio:", e);
    }
    activeAudioInstance = null;
    activeAudioId = null;

    notifyListeners({
      action: "stop",
      id: previousId,
      isPlaying: false,
      currentTime: 0,
    });
  }
};

export const playAudioItem = (id, audioUrl) => {
  if (!audioUrl) return;

  // 1. If user clicks the currently selected audio
  if (activeAudioId === id && activeAudioInstance) {
    if (!activeAudioInstance.paused) {
      // Audio is playing -> PAUSE IT (preserve currentTime!)
      activeAudioInstance.pause();
      notifyListeners({
        action: "pause",
        id,
        isPlaying: false,
        currentTime: activeAudioInstance.currentTime,
        duration: activeAudioInstance.duration || 0,
      });
    } else {
      // Audio is paused -> RESUME IT from where it was paused!
      activeAudioInstance
        .play()
        .then(() => {
          notifyListeners({
            action: "resume",
            id,
            isPlaying: true,
            currentTime: activeAudioInstance.currentTime,
            duration: activeAudioInstance.duration || 0,
          });
        })
        .catch((err) => {
          console.error("Audio resume error:", err);
          stopActiveAudio();
        });
    }
    return;
  }

  // 2. Switching to a DIFFERENT audio -> stop & reset previous audio to 0s
  stopActiveAudio();

  // 3. Create & play new Audio instance from beginning (0s)
  const audio = new Audio(audioUrl);
  activeAudioInstance = audio;
  activeAudioId = id;

  audio.currentTime = 0;

  audio.addEventListener("ended", () => {
    if (activeAudioInstance === audio) {
      audio.currentTime = 0;
      const finishedId = activeAudioId;
      activeAudioInstance = null;
      activeAudioId = null;

      notifyListeners({
        action: "ended",
        id: finishedId,
        isPlaying: false,
        currentTime: 0,
      });
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (activeAudioInstance === audio) {
      notifyListeners({
        action: "timeupdate",
        id,
        isPlaying: !audio.paused,
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
      });
    }
  });

  audio
    .play()
    .then(() => {
      notifyListeners({
        action: "play",
        id,
        isPlaying: true,
        currentTime: 0,
        duration: audio.duration || 0,
      });
    })
    .catch((err) => {
      console.error("Audio playback error:", err);
      stopActiveAudio();
    });
};


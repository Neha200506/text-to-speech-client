
 /**
 * Centralized Audio Manager
 *
 * Features:
 * 1. Only one audio plays at a time.
 * 2. Pause and resume from the same position.
 * 3. Switching audio resets the previous audio.
 * 4. Finished audio resets to 0 seconds.
 * 5. Forward and backward seeking is supported.
 */

let activeAudioInstance = null;
let activeAudioId = null;
let listeners = new Set();

const notifyListeners = (data) => {
  listeners.forEach((listener) => {
    try {
      listener(data);
    } catch (error) {
      console.error("Audio listener error:", error);
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

/**
 * Stop and reset the active audio.
 */
export const stopActiveAudio = () => {
  if (!activeAudioInstance) {
    return;
  }

  const previousId = activeAudioId;

  try {
    activeAudioInstance.pause();
    activeAudioInstance.currentTime = 0;
  } catch (error) {
    console.error("Error stopping audio:", error);
  }

  activeAudioInstance = null;
  activeAudioId = null;

  notifyListeners({
    action: "stop",
    id: previousId,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });
};

/**
 * Seek forward or backward in the active audio.
 */
export const seekActiveAudio = (id, time) => {
  if (!activeAudioInstance || activeAudioId !== id) {
    return;
  }

  if (!Number.isFinite(time)) {
    return;
  }

  const audio = activeAudioInstance;
  const duration = audio.duration;

  if (!Number.isFinite(duration) || duration <= 0) {
    return;
  }

  // Keep the time between 0 and the audio duration.
  const safeTime = Math.max(0, Math.min(time, duration));

  try {
    audio.currentTime = safeTime;

    notifyListeners({
      action: "seek",
      id,
      isPlaying: !audio.paused,
      currentTime: audio.currentTime,
      duration: duration,
    });
  } catch (error) {
    console.error("Error seeking audio:", error);
  }
};

/**
 * Play, pause, or resume an audio item.
 */
export const playAudioItem = (id, audioUrl) => {
  if (!audioUrl) {
    return;
  }

  // Clicking the currently active audio.
  if (activeAudioId === id && activeAudioInstance) {
    const audio = activeAudioInstance;

    if (!audio.paused) {
      // Pause without resetting the position.
      audio.pause();

      notifyListeners({
        action: "pause",
        id,
        isPlaying: false,
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
      });
    } else {
      // Resume from the paused position.
      audio
        .play()
        .then(() => {
          notifyListeners({
            action: "resume",
            id,
            isPlaying: true,
            currentTime: audio.currentTime,
            duration: audio.duration || 0,
          });
        })
        .catch((error) => {
          console.error("Audio resume error:", error);
          stopActiveAudio();
        });
    }

    return;
  }

  // Switch to a different audio.
  stopActiveAudio();

  // Create a new audio instance.
  const audio = new Audio(audioUrl);

  activeAudioInstance = audio;
  activeAudioId = id;

  audio.currentTime = 0;

  // Load audio duration.
  audio.addEventListener("loadedmetadata", () => {
    if (activeAudioInstance === audio) {
      notifyListeners({
        action: "loadedmetadata",
        id,
        isPlaying: !audio.paused,
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
      });
    }
  });

  // Update the playback position.
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

  // Reset after the audio finishes.
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
        duration: 0,
      });
    }
  });

  // Start playing.
  audio
    .play()
    .then(() => {
      notifyListeners({
        action: "play",
        id,
        isPlaying: true,
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
      });
    })
    .catch((error) => {
      console.error("Audio playback error:", error);
      stopActiveAudio();
    });
};
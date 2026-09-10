import { useEffect, useRef } from "react";
import { Mic } from "lucide-react";

/**
 * Reusable VoiceSelector component for selecting voice options based on chosen language.
 * Preserves Female/Male voice type selection across language switches.
 *
 * Supported Languages: English, Hindi, Marathi, German
 * Voice IDs:
 * - English: en-female, en-male
 * - Hindi:   hi-female, hi-male
 * - Marathi: mr-female, mr-male
 * - German:  de-female, de-male
 */

const VOICE_OPTIONS = {
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

const normalizeLanguage = (lang) => {
  if (!lang) return "English";
  const str = lang.toString().trim();
  const lower = str.toLowerCase();

  if (lower === "english" || lower === "en") return "English";
  if (lower === "hindi" || lower === "hi") return "Hindi";
  if (lower === "marathi" || lower === "mr") return "Marathi";
  if (lower === "german" || lower === "de") return "German";

  const keys = Object.keys(VOICE_OPTIONS);
  const found = keys.find((k) => k.toLowerCase() === lower);
  return found || "English";
};

const findMatchingVoice = (availableVoices, activeValue) => {
  if (!activeValue) return availableVoices[0];

  // 1. Direct ID match if selected voice belongs to the active language
  const exactMatch = availableVoices.find((v) => v.id === activeValue);
  if (exactMatch) return exactMatch;

  // 2. Preserve Female/Male voice selection when switching languages
  const isMale =
    activeValue.toLowerCase().includes("male") &&
    !activeValue.toLowerCase().includes("female");

  if (isMale) {
    const maleVoice = availableVoices.find(
      (v) =>
        v.id.toLowerCase().includes("male") &&
        !v.id.toLowerCase().includes("female"),
    );
    if (maleVoice) return maleVoice;
  } else {
    const femaleVoice = availableVoices.find((v) =>
      v.id.toLowerCase().includes("female"),
    );
    if (femaleVoice) return femaleVoice;
  }

  return availableVoices[0];
};

const VoiceSelector = ({
  language = "English",
  selectedVoice,
  voice,
  value,
  onChange,
  className = "",
  label = "Voice",
  disabled = false,
}) => {
  const currentLangKey = normalizeLanguage(language);
  const availableVoices =
    VOICE_OPTIONS[currentLangKey] || VOICE_OPTIONS["English"];

  const activeValue = selectedVoice || voice || value;
  const selectedVoiceObj = findMatchingVoice(availableVoices, activeValue);
  const currentValue = selectedVoiceObj?.id || "";

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    if (onChangeRef.current && selectedVoiceObj) {
      onChangeRef.current(
        selectedVoiceObj.id,
        selectedVoiceObj.name,
        selectedVoiceObj,
      );
    }
  }, [currentLangKey, currentValue, selectedVoiceObj]);

  const handleChange = (e) => {
    const selectedId = e.target.value;
    const foundObj =
      availableVoices.find((v) => v.id === selectedId) || selectedVoiceObj;
    if (onChangeRef.current) {
      onChangeRef.current(selectedId, foundObj?.name, foundObj, e);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5 text-blue-400" />
          <span>{label}</span>
        </label>
      )}
      <div className="relative">
        <select
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          className="w-full px-3.5 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed appearance-none pr-10"
        >
          {availableVoices.map((v) => (
            <option
              key={v.id}
              value={v.id}
              className="bg-slate-900 text-slate-100 py-1"
            >
              {v.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <svg
            className="w-4 h-4 fill-current"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default VoiceSelector;

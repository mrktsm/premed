import { useState, useEffect, useRef } from "react";
import { searchUniversities, type University } from "../data/universities";

interface UniversitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const UniversitySelector = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Enter your university name",
}: UniversitySelectorProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<University[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (inputValue.trim().length >= 2) {
      const results = searchUniversities(inputValue, 8);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleSuggestionClick = (university: University) => {
    setInputValue(university.name);
    onChange(university.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  const handleInputFocus = () => {
    if (inputValue.trim().length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        autoComplete="off"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-primary-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          {suggestions.map((university, index) => (
            <div
              key={`${university.name}-${university.state}`}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? "bg-primary-50 text-primary-900"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => handleSuggestionClick(university)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">
                  {university.name}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  {university.state} • {university.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {inputValue.trim().length >= 2 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-primary-200 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-center">
            No universities found. Try a different search term.
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversitySelector;

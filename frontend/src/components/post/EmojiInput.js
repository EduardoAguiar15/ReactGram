import { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";

const EmojiInput = ({
  value,
  onChange,
  placeholder,
  inputRef,
  inputClassName = "",
  wrapperClassName = "",
  buttonClassName = "",
  onEnter,
  pickerWidth = 400,
  pickerHeight = 300,
  pickerPositionClass = "",
}) => {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    onChange(value + emojiData.emoji);
    inputRef?.current?.focus();
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (!pickerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className={`relative ${wrapperClassName}`}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
        className={`pr-10 ${inputClassName}`}
      />

      <button
        aria-label="Selecionar emoji"
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`emoji-button absolute right-2 top-[42%] -translate-y-1/2 text-2xl bg-transparent ${buttonClassName}`}
      >
        😊
      </button>

      {open && (
        <div
          ref={pickerRef}
          className={`absolute z-50 ${pickerPositionClass}`}
        >
          <EmojiPicker
            emojiSize={18}
            onEmojiClick={handleEmojiClick}
            theme="dark"
            width={pickerWidth}
            height={pickerHeight}
            previewConfig={{ showPreview: false }}
            searchDisabled
          />
        </div>
      )}
    </div>
  );
};

export default EmojiInput;
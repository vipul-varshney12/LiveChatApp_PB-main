// Emoji.js
import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import "./myStyles.css"
const Emoji = ({ onEmojiSelect }) => {
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (emojiObject) => {
    onEmojiSelect(emojiObject.emoji);
    setShowPicker(false);
  };

  return (
    <div className="emoji-container">
      <button className="emoji-picker-button" onClick={() => setShowPicker(!showPicker)}>😊</button>
      {showPicker && (
        <div className="emoji-picker-wrapper">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default Emoji;
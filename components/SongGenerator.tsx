
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import Loader from './Loader'; // Keep Loader for button state
import { CanvasDestination } from '../types';


interface SongGeneratorProps {
  onSendToCanvas: (content: string, destination: CanvasDestination) => void;
   showGeminiInteraction: (
    modalTitle: string,
    geminiCall: () => Promise<string>,
    onSuccess: (result: string) => void,
    confirmBtnText?: string
  ) => Promise<void>;
}

const SongGenerator: React.FC<SongGeneratorProps> = ({ onSendToCanvas, showGeminiInteraction }) => {
  const [songThemeInput, setSongThemeInput] = useState('');
  const [songStyleInput, setSongStyleInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const handleGenerateFullSong = async () => {
    if (!songThemeInput.trim() || !songStyleInput.trim()) {
      alert("Please enter both theme/topic and musical style/mood.");
      return;
    }
    setIsLoading(true); 
    await showGeminiInteraction(
      "AI Song Draft Generator",
      () => geminiService.generateFullSong(songThemeInput, songStyleInput),
      (fullSong) => {
        onSendToCanvas(fullSong, 'draft');
      },
      "Copy Full Song to Main Draft"
    );
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="control-group">
        <label htmlFor="songThemeInput">Theme/Topic:</label>
        <input
          type="text"
          id="songThemeInput"
          placeholder="e.g., A train journey at dusk"
          value={songThemeInput}
          onChange={(e) => setSongThemeInput(e.target.value)}
          className="input-base-style" // Use global class
        />
      </div>
      <div className="control-group">
        <label htmlFor="songStyleInput">Musical Style/Mood:</label>
        <input
          type="text"
          id="songStyleInput"
          placeholder="e.g., Mellow Folk Ballad"
          value={songStyleInput}
          onChange={(e) => setSongStyleInput(e.target.value)}
          className="input-base-style" // Use global class
        />
      </div>
      <button 
        onClick={handleGenerateFullSong} 
        className="btn btn-primary mt-2 flex items-center justify-center min-w-[220px]" // Use global class, ensure button accommodates loader
        disabled={isLoading}
      >
        {isLoading ? <Loader /> : "Compose Full Song Draft ✨"}
      </button>
      {/* The full song output will be displayed in the modal */}
    </div>
  );
};

export default SongGenerator;

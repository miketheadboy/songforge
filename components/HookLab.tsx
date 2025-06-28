import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { CanvasDestination } from '../types';
import Loader from './Loader';

interface HookLabProps {
  showGeminiInteraction: (
    modalTitle: string,
    geminiCall: () => Promise<string>,
    onSuccess: (result: string) => void,
    confirmBtnText?: string
  ) => Promise<void>;
  onSendToCanvas: (content: string, destination: CanvasDestination) => void;
}

const HookLab: React.FC<HookLabProps> = ({ showGeminiInteraction, onSendToCanvas }) => {
  const [themeKeywordsInput, setThemeKeywordsInput] = useState('');
  const [desiredFeelingInput, setDesiredFeelingInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For button loading state

  const handleGenerateHooks = async () => {
    if (!themeKeywordsInput.trim()) {
      alert("Please enter some theme/keywords for your hook.");
      return;
    }
    if (!desiredFeelingInput.trim()) {
      alert("Please describe the desired feeling/vibe for your hook.");
      return;
    }
    setIsLoading(true);

    try {
      await showGeminiInteraction(
        "AI Hook Ideas",
        () => geminiService.generateHookIdeas(themeKeywordsInput.trim(), desiredFeelingInput.trim()),
        (generatedHooks) => {
          onSendToCanvas(generatedHooks, 'draft'); // The modal's confirm will trigger this
        },
        "Add Hooks to Draft"
      );
    } catch (error) {
        // Error is handled by showGeminiInteraction
        console.error("Error during hook generation:", error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    // Removed StyledSubsectionBox wrapper. Content now sits directly within the parent SectionBox.
    // The parent SectionBox in App.tsx ("Hook Lab: Craft Your Catchiest Lines") provides the title and card styling.
    <div className="space-y-6"> 
      <div className="control-group">
        <label htmlFor="hookThemeKeywords">Theme / Keywords:</label>
        <input
          type="text"
          id="hookThemeKeywords"
          placeholder="e.g., summer romance, city loneliness, breaking free"
          value={themeKeywordsInput}
          onChange={(e) => setThemeKeywordsInput(e.target.value)}
          className="input-base-style"
          aria-label="Theme or keywords for hook generation"
        />
      </div>

      <div className="control-group">
        <label htmlFor="hookDesiredFeeling">Desired Feeling / Vibe:</label>
        <input
          type="text"
          id="hookDesiredFeeling"
          placeholder="e.g., energetic & upbeat, melancholic & reflective, anthemic"
          value={desiredFeelingInput}
          onChange={(e) => setDesiredFeelingInput(e.target.value)}
          className="input-base-style"
          aria-label="Desired feeling or vibe for hook generation"
        />
      </div>

      <button 
        onClick={handleGenerateHooks} 
        className="btn btn-primary mt-3 flex items-center justify-center min-w-[200px]"
        disabled={isLoading}
      >
        {isLoading ? <Loader /> : 'Generate Hooks 🎣'}
      </button>
      <p className="text-sm mt-3 text-[var(--text-muted)] font-['Special_Elite',_cursive]">
        AI will suggest several distinct hook ideas based on your input. A hook is a short, memorable lyrical or conceptual phrase.
      </p>
    </div>
  );
};

export default HookLab;
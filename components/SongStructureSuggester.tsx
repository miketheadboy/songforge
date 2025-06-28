import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { CanvasDestination } from '../types';
import Loader from './Loader'; // Used for button loading state if not using modal for all loading

interface SongStructureSuggesterProps {
  onSendToCanvas: (content: string, destination: CanvasDestination) => void;
  showGeminiInteraction: (
    modalTitle: string,
    geminiCall: () => Promise<string>,
    onSuccess: (result: string) => void,
    confirmBtnText?: string
  ) => Promise<void>;
}

const StyledSubsectionBox: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="subsection-card">
        <h3 className="subsection-title">{title}</h3>
        {children}
    </div>
);

const SongStructureSuggester: React.FC<SongStructureSuggesterProps> = ({ onSendToCanvas, showGeminiInteraction }) => {
  const [ideaInput, setIdeaInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For button loading state before modal takes over

  const handleSuggestStructure = async () => {
    if (!ideaInput.trim()) {
      alert("Please enter a theme or idea for your song.");
      return;
    }
    setIsLoading(true); // Indicate loading on the button briefly
    
    await showGeminiInteraction(
      "AI Song Structure Suggestions",
      () => geminiService.suggestSongStructure(ideaInput.trim()),
      (suggestedStructures) => {
        // The suggestedStructures string is already formatted by Gemini service
        onSendToCanvas(suggestedStructures, 'draft');
      },
      "Add Structures to Draft"
    );
    setIsLoading(false); // Reset button loading state
  };

  return (
    <StyledSubsectionBox title="Architect of Sound">
      <div className="control-group">
        <label htmlFor="songIdeaInput">Enter song theme, lyrical snippet, or core idea:</label>
        <textarea
          id="songIdeaInput"
          placeholder="e.g., A journey through a futuristic city, finding love in unexpected places, the feeling of autumn nostalgia..."
          value={ideaInput}
          onChange={(e) => setIdeaInput(e.target.value)}
          className="textarea-base-style"
          rows={3}
          aria-label="Song theme or idea input"
        />
      </div>
      <button 
        onClick={handleSuggestStructure} 
        className="btn btn-primary mt-3 flex items-center justify-center min-w-[200px]"
        disabled={isLoading}
      >
        {isLoading ? <Loader /> : 'Suggest Structures 🏗️'}
      </button>
      {/* Output (suggested structures) will be shown in the modal handled by showGeminiInteraction */}
      <p className="text-sm mt-3 text-[var(--text-muted)] font-['Special_Elite',_cursive]">
        AI will offer a few common song structures based on your input. You can then add these to your draft.
      </p>
    </StyledSubsectionBox>
  );
};

export default SongStructureSuggester;
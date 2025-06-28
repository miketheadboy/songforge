
import React, { useState } from 'react';
import { CHORD_PROGRESSIONS_DATA, randomChoice, SINGLE_CHORD_EXAMPLES } from '../constants'; // Added SINGLE_CHORD_EXAMPLES
import { CanvasDestination } from '../types';
import { geminiService } from '../services/geminiService';
import Loader from './Loader';

interface MusicalToolkitProps {
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

const MusicalToolkit: React.FC<MusicalToolkitProps> = ({ onSendToCanvas, showGeminiInteraction }) => {
  const [selectedMoodKey, setSelectedMoodKey] = useState<string>('');
  const [originalChordsInput, setOriginalChordsInput] = useState('');
  const [isReharmonizingLoading, setIsReharmonizingLoading] = useState(false);
  const [randomSingleChord, setRandomSingleChord] = useState<string | null>(null);

  // New state for Melodic Sketchpad
  const [melodyKeywordsInput, setMelodyKeywordsInput] = useState('');
  const [isMelodyLoading, setIsMelodyLoading] = useState(false);


  const handleReharmonize = async () => {
    if (!originalChordsInput.trim()) {
      alert("Please enter original chords to reharmonize.");
      return;
    }
    setIsReharmonizingLoading(true);
    try {
      await showGeminiInteraction(
        "Chord Alchemist - AI Reharmonization",
        () => geminiService.reharmonizeChords(originalChordsInput),
        (reharmonizedChords) => {
          onSendToCanvas(reharmonizedChords, 'notes');
        },
        "Add Reharmonized Chords to Notes"
      );
    } catch (error) {
      console.error("Error during reharmonization:", error);
    } finally {
      setIsReharmonizingLoading(false);
    }
  };

  const selectRandomMood = () => {
    const allMoodKeys = Object.keys(CHORD_PROGRESSIONS_DATA);
    const randomKey = randomChoice(allMoodKeys);
    if (randomKey) {
        setSelectedMoodKey(randomKey);
    }
  };

  const sparkRandomChord = () => {
    const chord = randomChoice(SINGLE_CHORD_EXAMPLES);
    setRandomSingleChord(chord);
  };

  const handleSuggestMelodyIdeas = async () => {
    if (!melodyKeywordsInput.trim()) {
        alert("Please enter some keywords or describe a mood for your melody.");
        return;
    }
    setIsMelodyLoading(true);
    try {
        await showGeminiInteraction(
            "AI Melodic Ideas",
            () => geminiService.generateMelodyIdeas(melodyKeywordsInput.trim()),
            (generatedIdeas) => {
                onSendToCanvas(generatedIdeas, 'melodicIdeas');
            },
            "Add Melodic Ideas to Canvas"
        );
    } catch (error) {
        console.error("Error during melody idea generation:", error);
    } finally {
        setIsMelodyLoading(false);
    }
  };

  const currentProgressions = selectedMoodKey ? CHORD_PROGRESSIONS_DATA[selectedMoodKey]?.progressions : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Adjusted for 3 columns on large screens */}
      <StyledSubsectionBox title="Chord Corner">
        <div className="control-group">
          <label htmlFor="moodSelector">Select a Mood or Get a Random Vibe:</label>
          <div className="flex items-center gap-2">
            <select
              id="moodSelector"
              value={selectedMoodKey}
              onChange={(e) => setSelectedMoodKey(e.target.value)}
              className="select-base-style flex-grow"
            >
              <option value="">-- Choose a Vibe --</option>
              {Object.keys(CHORD_PROGRESSIONS_DATA).map(key => (
                <option key={key} value={key}>{CHORD_PROGRESSIONS_DATA[key].name}</option>
              ))}
            </select>
            <button
                onClick={selectRandomMood}
                className="btn btn-ghost p-2"
                title="Select Random Vibe"
            >
                🎲
            </button>
          </div>
        </div>
        <div className="output-display-area mt-3">
          {currentProgressions && currentProgressions.length > 0 
            ? currentProgressions.join('\n') 
            : "Select a mood or get a random vibe to see chord progressions..."}
        </div>
        {currentProgressions && currentProgressions.length > 0 && (
          <div className="mt-3">
            <button 
              onClick={() => onSendToCanvas(currentProgressions.join('\n'), 'notes')} 
              className="btn btn-sm btn-primary"
            >
              Add to Notes
            </button>
          </div>
        )}
        <div className="mt-5 pt-4 border-t border-[var(--border-color)]">
            <button onClick={sparkRandomChord} className="btn btn-ghost btn-sm">Spark a Chord ✨</button>
            {randomSingleChord && (
                <div 
                    className="rhyme-item-card inline-block ml-3 mt-2 cursor-pointer"
                    onClick={() => onSendToCanvas(randomSingleChord, 'notes')}
                    title={`Add "${randomSingleChord}" to notes`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSendToCanvas(randomSingleChord, 'notes')}
                >
                    {randomSingleChord}
                </div>
            )}
        </div>
      </StyledSubsectionBox>

      <StyledSubsectionBox title="The Chord Alchemist">
        <div className="control-group">
          <label htmlFor="originalChordsInput">Original Chords:</label>
          <input
            type="text"
            id="originalChordsInput"
            placeholder="e.g., C - G - Am - F"
            value={originalChordsInput}
            onChange={(e) => setOriginalChordsInput(e.target.value)}
            className="input-base-style"
          />
        </div>
        <button 
          onClick={handleReharmonize} 
          className="btn btn-primary mt-3 flex items-center justify-center min-w-[200px]"
          disabled={isReharmonizingLoading}
        >
          {isReharmonizingLoading ? <Loader /> : "Reharmonize ✨"}
        </button>
      </StyledSubsectionBox>

      {/* New Melodic Sketchpad Subsection */}
      <StyledSubsectionBox title="Melodic Sketchpad">
        <div className="control-group">
          <label htmlFor="melodyKeywordsInput">Keywords/Mood for Melody:</label>
          <input
            type="text"
            id="melodyKeywordsInput"
            placeholder="e.g., uplifting, simple, major key, arpeggiated"
            value={melodyKeywordsInput}
            onChange={(e) => setMelodyKeywordsInput(e.target.value)}
            className="input-base-style"
            aria-label="Keywords or mood for melody generation"
          />
        </div>
        <button
          onClick={handleSuggestMelodyIdeas}
          className="btn btn-secondary mt-3 flex items-center justify-center min-w-[200px]"
          disabled={isMelodyLoading}
        >
          {isMelodyLoading ? <Loader /> : "Suggest Melodic Ideas 🎶"}
        </button>
        <p className="text-sm mt-3 text-[var(--text-muted)] font-['Special_Elite',_cursive]">
            AI will describe melodic phrases based on your input (contour, rhythm, scale).
        </p>
      </StyledSubsectionBox>

    </div>
  );
};

export default MusicalToolkit;
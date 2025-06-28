
import React, { useState, useMemo } from 'react';
import { PROCESSED_PHRASES, getRandomChoices } from '../constants';
import { ProcessedPhrase, CanvasDestination } from '../types';
import { geminiService } from '../services/geminiService';
import Loader from './Loader';

interface LyricalWorkbenchProps {
  onSendToCanvas: (content: string, destination: CanvasDestination) => void;
  showGeminiInteraction: (
    modalTitle: string,
    geminiCall: () => Promise<string>,
    onSuccess: (result: string) => void,
    confirmBtnText?: string
  ) => Promise<void>;
}

const StyledSubsectionBox: React.FC<{ title: string, children: React.ReactNode, className?: string }> = ({ title, children, className }) => (
    <div className={`subsection-card ${className || ''}`}>
        <h3 className="subsection-title">{title}</h3>
        {children}
    </div>
);

const LyricalWorkbench: React.FC<LyricalWorkbenchProps> = ({ onSendToCanvas, showGeminiInteraction }) => {
  // --- State for Phrase Spark ---
  const [searchInput, setSearchInput] = useState('');
  const [refreshPhrasesKey, setRefreshPhrasesKey] = useState(0); // For triggering phrase shuffle

  const filteredPhrases = useMemo(() => {
    // Show a random selection if no search input, otherwise filter
    if (!searchInput) return getRandomChoices(PROCESSED_PHRASES, 25);
    return PROCESSED_PHRASES.filter(p => p.text.toLowerCase().includes(searchInput.toLowerCase())).slice(0, 20);
  }, [searchInput, refreshPhrasesKey]); // Added refreshPhrasesKey dependency

  const handleShufflePhrases = () => {
    if (searchInput === '') { // Only shuffle if search is empty
        setRefreshPhrasesKey(prevKey => prevKey + 1);
    }
  };

  // --- State for Word Lab (Rephrasing) ---
  const [detonatorInput, setDetonatorInput] = useState('');

  // --- State for Rhyme Navigator ---
  const [rhymeWordInput, setRhymeWordInput] = useState('');
  const [rhymes, setRhymes] = useState<string[]>([]);
  const [isRhymeLoading, setIsRhymeLoading] = useState(false);
  const [rhymeError, setRhymeError] = useState<string | null>(null);

  // --- State for Metaphor Mixer ---
  const [conceptInput, setConceptInput] = useState('');
  const [isMetaphorLoading, setIsMetaphorLoading] = useState(false); // Button loading state

  // --- Handlers for Word Lab ---
  const handleRephraseLine = async () => {
    if (!detonatorInput.trim()) {
      alert("Please enter a line to rephrase.");
      return;
    }
    await showGeminiInteraction(
      "Word Lab - AI Rephrasing",
      () => geminiService.rephraseLine(detonatorInput),
      (rephrasedLine) => {
        onSendToCanvas(rephrasedLine, 'draft'); 
      },
      "Add Rephrased Line to Draft"
    );
  };

  // --- Handlers for Rhyme Navigator ---
  const handleFindRhymes = async () => {
    if (!rhymeWordInput.trim()) {
      setRhymeError("Please enter a word to find rhymes for.");
      setRhymes([]);
      return;
    }
    setIsRhymeLoading(true);
    setRhymeError(null);
    setRhymes([]);
    try {
      const foundRhymes = await geminiService.findRhymes(rhymeWordInput.trim());
      setRhymes(foundRhymes);
      if (foundRhymes.length === 0) {
        setRhymeError(`No rhymes found for "${rhymeWordInput.trim()}". Try a different word or check spelling.`);
      }
    } catch (err) {
      console.error("Rhyme Finder API error:", err);
      setRhymeError(err instanceof Error ? err.message : "Failed to fetch rhymes. Please try again.");
      setRhymes([]);
    } finally {
      setIsRhymeLoading(false);
    }
  };

  const handleRhymeClick = (rhyme: string) => {
    onSendToCanvas(rhyme, 'draft');
  };

  // --- Handlers for Metaphor Mixer ---
  const handleGenerateMetaphors = async () => {
    if (!conceptInput.trim()) {
      alert("Please enter a concept, object, or feeling to generate metaphors for.");
      return;
    }
    setIsMetaphorLoading(true);
    
    await showGeminiInteraction(
      "Metaphor Mixer - AI Figurative Language",
      () => geminiService.generateMetaphors(conceptInput.trim()),
      (generatedMetaphors) => {
        onSendToCanvas(generatedMetaphors, 'notes');
      },
      "Add Metaphors to Notes"
    );
    setIsMetaphorLoading(false); 
  };
  
  return (
    <div className="space-y-6">
      <StyledSubsectionBox title="Phrase Spark">
        <div className="control-group">
          <label htmlFor="searchInputWorkbench">Search Phrases or Shuffle for Inspiration</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              id="searchInputWorkbench"
              placeholder="Spark a thought..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-base-style flex-grow"
            />
            <button 
              onClick={handleShufflePhrases} 
              disabled={searchInput !== ''}
              className="btn btn-ghost p-2"
              title="Shuffle Phrases"
            >
              🎲
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 max-h-60 overflow-y-auto pr-1">
          {filteredPhrases.map((phrase: ProcessedPhrase) => (
            <div
              key={phrase.text}
              className="phrase-card-small"
              onClick={() => onSendToCanvas(phrase.text, 'draft')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSendToCanvas(phrase.text, 'draft')}
              title={`Add "${phrase.text}" to draft`}
            >
              {phrase.text}
            </div>
          ))}
        </div>
      </StyledSubsectionBox>

      <StyledSubsectionBox title="Word Lab">
        <div className="control-group">
          <label htmlFor="detonatorInputWorkbench">Line to rephrase:</label>
          <input
            type="text"
            id="detonatorInputWorkbench"
            placeholder="e.g., The sun is bright"
            value={detonatorInput}
            onChange={(e) => setDetonatorInput(e.target.value)}
            className="input-base-style"
          />
        </div>
        <button onClick={handleRephraseLine} className="btn btn-tertiary mt-3">
          Rephrase Line ✨
        </button>
      </StyledSubsectionBox>

      <StyledSubsectionBox title="Rhyme Navigator">
        <div className="control-group">
          <label htmlFor="rhymeWordInputWorkbench">Word to find rhymes for:</label>
          <input
            type="text"
            id="rhymeWordInputWorkbench"
            placeholder="e.g., dream, time, light"
            value={rhymeWordInput}
            onChange={(e) => setRhymeWordInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFindRhymes()}
            className="input-base-style"
            aria-label="Word to find rhymes for"
          />
        </div>
        <button 
          onClick={handleFindRhymes} 
          className="btn btn-secondary mt-3 flex items-center justify-center min-w-[150px]" // Added min-width for consistency with loader
          disabled={isRhymeLoading}
          aria-live="polite"
        >
          {isRhymeLoading ? <Loader /> : 'Find Rhymes 🗣️'}
        </button>

        {isRhymeLoading && !rhymes.length && <div className="mt-2"><Loader /></div>}

        {rhymeError && (
          <div className="output-display-area mt-4 text-[var(--accent-error-red)]" role="alert">
            {rhymeError}
          </div>
        )}

        {!isRhymeLoading && !rhymeError && rhymes.length > 0 && (
          <div className="mt-4">
            <h4 className="font-artistic-subtitle text-lg text-[var(--text-secondary)] mb-2">
              Rhymes for "{rhymeWordInput.trim()}":
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1">
              {rhymes.map((rhyme, index) => (
                <div
                  key={`${rhyme}-${index}`}
                  className="rhyme-item-card"
                  onClick={() => handleRhymeClick(rhyme)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleRhymeClick(rhyme)}
                  role="button"
                  tabIndex={0}
                  title={`Add "${rhyme}" to draft`}
                >
                  {rhyme}
                </div>
              ))}
            </div>
          </div>
        )}
      </StyledSubsectionBox>

      <StyledSubsectionBox title="Metaphor Mixer">
        <div className="control-group">
          <label htmlFor="conceptInputWorkbench">Enter a concept, object, or feeling:</label>
          <input
            type="text"
            id="conceptInputWorkbench"
            placeholder="e.g., hope, a city, silence, memory"
            value={conceptInput}
            onChange={(e) => setConceptInput(e.target.value)}
            className="input-base-style"
            aria-label="Concept for metaphor generation"
          />
        </div>
        <button 
          onClick={handleGenerateMetaphors} 
          className="btn btn-primary mt-3 flex items-center justify-center min-w-[200px]"
          disabled={isMetaphorLoading}
        >
          {isMetaphorLoading ? <Loader /> : 'Conjure Metaphors 🔮'}
        </button>
      </StyledSubsectionBox>
    </div>
  );
};

export default LyricalWorkbench;

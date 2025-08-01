
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

  // --- State for Rhyming Line Generator ---
  const [rhymingLineInput, setRhymingLineInput] = useState('');
  const [rhymingLines, setRhymingLines] = useState<string[]>([]);
  const [isRhymingLineLoading, setIsRhymingLineLoading] = useState(false);
  const [rhymingLineError, setRhymingLineError] = useState<string | null>(null);

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

  // --- Handlers for Rhyming Line Generator ---
  const handleFindRhymingLines = async () => {
    if (!rhymingLineInput.trim()) {
      setRhymingLineError("Please enter a line to find rhymes for.");
      setRhymingLines([]);
      return;
    }
    setIsRhymingLineLoading(true);
    setRhymingLineError(null);
    setRhymingLines([]);
    try {
      const foundLines = await geminiService.findRhymingLines(rhymingLineInput.trim());
      setRhymingLines(foundLines);
      if (foundLines.length === 0) {
        setRhymingLineError(`No rhyming lines found for "${rhymingLineInput.trim()}". Try a different line or check spelling.`);
      }
    } catch (err) {
      console.error("Rhyming Line Generator API error:", err);
      setRhymingLineError(err instanceof Error ? err.message : "Failed to fetch rhyming lines. Please try again.");
      setRhymingLines([]);
    } finally {
      setIsRhymingLineLoading(false);
    }
  };

  const handleLineClick = (line: string) => {
    onSendToCanvas(line, 'draft');
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

      <StyledSubsectionBox title="Rhyming Line Generator">
        <div className="control-group">
          <label htmlFor="rhymingLineInputWorkbench">Line to find rhymes for:</label>
          <textarea
            id="rhymingLineInputWorkbench"
            placeholder="e.g., The city sleeps below"
            value={rhymingLineInput}
            onChange={(e) => setRhymingLineInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleFindRhymingLines()}
            className="input-base-style min-h-[60px]"
            aria-label="Line to find rhymes for"
          />
        </div>
        <button 
          onClick={handleFindRhymingLines}
          className="btn btn-secondary mt-3 flex items-center justify-center min-w-[200px]"
          disabled={isRhymingLineLoading}
          aria-live="polite"
        >
          {isRhymingLineLoading ? <Loader /> : 'Generate Rhyming Lines ✍️'}
        </button>

        {isRhymingLineLoading && <div className="mt-2"><Loader /></div>}

        {rhymingLineError && (
          <div className="output-display-area mt-4 text-[var(--accent-error-red)]" role="alert">
            {rhymingLineError}
          </div>
        )}

        {!isRhymingLineLoading && !rhymingLineError && rhymingLines.length > 0 && (
          <div className="mt-4">
            <h4 className="font-artistic-subtitle text-lg text-[var(--text-secondary)] mb-2">
              Suggested lines that rhyme with "{rhymingLineInput.trim()}":
            </h4>
            <div className="space-y-2 max-h-72 overflow-y-auto p-1">
              {rhymingLines.map((line, index) => (
                <div
                  key={`${line}-${index}`}
                  className="rhyming-line-card"
                  onClick={() => handleLineClick(line)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleLineClick(line)}
                  role="button"
                  tabIndex={0}
                  title={`Add "${line}" to draft`}
                >
                  {line}
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

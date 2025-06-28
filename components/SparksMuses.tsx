
import React, { useState } from 'react';
import { 
    randomChoice, 
    getRandomChoices, 
    MUSE_PROMPTS, 
    ALBUM_TITLE_PARTS_DATA, 
    INSPIRATIONAL_QUOTES,
    LYRICAL_SEEDS 
} from '../constants';
import { AlbumTitleParts, CanvasDestination } from '../types';

interface SparksMusesProps {
  onSendToCanvas: (content: string, destination: CanvasDestination) => void;
}

const StyledSubsectionBox: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="subsection-card flex flex-col"> {/* Added flex flex-col for better height management if content overflows */}
        <h3 className="subsection-title">{title}</h3>
        {children}
    </div>
);

// New component for displaying multiple clickable inspiration items
const InspirationCard: React.FC<{text: string, onClick: () => void, title?: string}> = ({ text, onClick, title }) => (
    <div
      className="phrase-card-small text-sm" // Re-using and slightly adjusting phrase-card-small
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      title={title || `Add "${text.substring(0,30)}..." to canvas`} // More specific title
    >
      {text}
    </div>
);

const generateRandomAlbumTitle = (parts: AlbumTitleParts): string => {
    const pattern = Math.floor(Math.random() * 4); 
    const adj = randomChoice(parts.adjectives) || "Lost";
    const noun = randomChoice(parts.nouns) || "Soul";
    const connector = randomChoice(parts.connectors) || "of";
    const concept = randomChoice(parts.concepts) || "Time";
    const verb = randomChoice(parts.verbsGerund) || "Chasing";

    switch (pattern) {
        case 0: return `${adj} ${noun}`;
        case 1: return `${noun} ${connector} ${randomChoice(parts.nouns) || "Dreams"}`;
        case 2: return `${verb} ${concept}`;
        case 3: return `${adj} ${concept} ${noun}`;
        default: return `${adj} ${noun}`;
    }
};

const SparksMuses: React.FC<SparksMusesProps> = ({ onSendToCanvas }) => {
  const [musePrompts, setMusePrompts] = useState<string[]>([]);
  const [albumTitles, setAlbumTitles] = useState<string[]>([]);
  const [currentQuotes, setCurrentQuotes] = useState<string[]>([]);
  const [lyricalSeeds, setLyricalSeeds] = useState<string[]>([]);

  const summonMuse = () => {
    setMusePrompts(getRandomChoices(MUSE_PROMPTS, 3));
  };

  const generateAlbumTitles = () => {
    const titles: string[] = [];
    for (let i = 0; i < 3; i++) {
        titles.push(generateRandomAlbumTitle(ALBUM_TITLE_PARTS_DATA as AlbumTitleParts));
    }
    setAlbumTitles(titles);
  };

  const getInspirationalQuotes = () => {
    setCurrentQuotes(getRandomChoices(INSPIRATIONAL_QUOTES, 3));
  };

  const getLyricalSeeds = () => {
    setLyricalSeeds(getRandomChoices(LYRICAL_SEEDS, 3));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StyledSubsectionBox title="The Muse's Whisper">
        <p className="dylan-quote-style mb-3">Let fleeting thoughts and sudden visions guide your pen. What stories wait to be unfurled?</p>
        <button onClick={summonMuse} className="btn btn-secondary mt-auto mb-3 self-start">New Whispers 🌬️</button>
        {musePrompts.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {musePrompts.map((prompt, index) => (
              <InspirationCard key={`muse-${index}`} text={prompt} onClick={() => onSendToCanvas(prompt, 'notes')} title={`Add prompt: "${prompt.substring(0,30)}..." to notes`} />
            ))}
          </div>
        )}
      </StyledSubsectionBox>

      <StyledSubsectionBox title="Album Title Alley">
         <p className="dylan-quote-style mb-3">Every great work needs a name. What banner will your collection of songs fly under?</p>
        <button onClick={generateAlbumTitles} className="btn btn-primary mt-auto mb-3 self-start">Shuffle Titles 📜</button>
        {albumTitles.length > 0 && (
           <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {albumTitles.map((title, index) => (
              <InspirationCard key={`album-${index}`} text={title} onClick={() => onSendToCanvas(title, 'title')} title={`Set as project title: "${title}"`} />
            ))}
          </div>
        )}
      </StyledSubsectionBox>

      <StyledSubsectionBox title="Poet's Corner">
        <p className="dylan-quote-style mb-3">Words from the wise, the wild, and the weathered. Let their echoes resonate in your own craft.</p>
        <button onClick={getInspirationalQuotes} className="btn btn-tertiary mt-auto mb-3 self-start">Fresh Quotes 🎤</button>
        {currentQuotes.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {currentQuotes.map((quote, index) => (
              <InspirationCard key={`quote-${index}`} text={quote} onClick={() => onSendToCanvas(quote, 'notes')} title={`Add quote to notes: "${quote.substring(0,30)}..."`} />
            ))}
          </div>
        )}
      </StyledSubsectionBox>

      <StyledSubsectionBox title="Lyrical Seeds">
        <p className="dylan-quote-style mb-3">Tiny sparks to ignite your imagination. A single image, a fleeting feeling, a whisper of a line.</p>
        <button onClick={getLyricalSeeds} className="btn btn-primary mt-auto mb-3 self-start">New Seeds 🌱</button>
        {lyricalSeeds.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {lyricalSeeds.map((seed, index) => (
              <InspirationCard key={`seed-${index}`} text={seed} onClick={() => onSendToCanvas(seed, 'draft')} title={`Add seed to draft: "${seed}"`} />
            ))}
          </div>
        )}
      </StyledSubsectionBox>
    </div>
  );
};

export default SparksMuses;

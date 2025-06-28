
import React, { useState, useEffect } from 'react';
import { SONG_LESSONS, randomChoice } from '../constants';
import { CanvasDestination } from '../types';

interface LearnFromMastersProps {
  onSendToCanvas: (content: string, destination: CanvasDestination) => void;
}

// Updated interface to include analysisHint
interface SongLesson {
  songTitle: string;
  artist: string;
  takeaway: string;
  analysisHint?: string; // New optional field
  genreTags?: string[];
}

const LearnFromMasters: React.FC<LearnFromMastersProps> = ({ onSendToCanvas }) => {
  const [currentLesson, setCurrentLesson] = useState<SongLesson | null>(null);

  const showNewLesson = () => {
    const lesson = randomChoice(SONG_LESSONS as SongLesson[]); // Cast to ensure type compatibility
    setCurrentLesson(lesson);
  };

  useEffect(() => {
    showNewLesson();
  }, []);

  if (!currentLesson) {
    return (
      <div className="subsection-card">
        <h3 className="subsection-title">Sonic Blueprints</h3>
        <p>Loading lessons...</p>
      </div>
    );
  }

  return (
    <div className="subsection-card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="subsection-title flex-grow">Lesson: {currentLesson.songTitle}</h3>
        <button onClick={showNewLesson} className="btn btn-secondary btn-sm ml-4 whitespace-nowrap">
          Show Another Lesson 📚
        </button>
      </div>
      
      <div className="space-y-3">
        <div 
          className="lesson-detail-card"
          onClick={() => onSendToCanvas(currentLesson.songTitle, 'title')}
          role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSendToCanvas(currentLesson.songTitle, 'title')}
          title={`Set as Project Title: "${currentLesson.songTitle}"`}
        >
          <strong className="font-artistic-text uppercase text-[var(--text-secondary)] block mb-1">Song:</strong>
          {currentLesson.songTitle}
        </div>

        <div 
          className="lesson-detail-card"
          onClick={() => onSendToCanvas(currentLesson.artist, 'notes')}
          role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSendToCanvas(currentLesson.artist, 'notes')}
          title={`Add Artist to Notes: "${currentLesson.artist}"`}
        >
          <strong className="font-artistic-text uppercase text-[var(--text-secondary)] block mb-1">Artist:</strong>
          {currentLesson.artist}
        </div>
        
        <div 
          className="lesson-detail-card"
        //   onClick={() => onSendToCanvas(currentLesson.takeaway, 'notes')} // Takeaway and hint are now combined below
        //   role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSendToCanvas(currentLesson.takeaway, 'notes')}
          title={`Add Takeaway & Analysis to Notes`}
        >
          <strong 
            className="font-artistic-text uppercase text-[var(--text-secondary)] block mb-1 cursor-pointer"
            onClick={() => onSendToCanvas(currentLesson.takeaway, 'notes')}
          >
            Key Takeaway:
          </strong>
          <p 
            className="font-serif-editorial text-sm leading-relaxed mb-2 cursor-pointer" // Adjusted text size from text-base to text-sm
            onClick={() => onSendToCanvas(currentLesson.takeaway, 'notes')}
          >
            {currentLesson.takeaway}
          </p>
          {currentLesson.analysisHint && (
            <div 
              className="lesson-analysis-hint cursor-pointer" // Make this clickable too
              onClick={() => onSendToCanvas(`Quick Analysis for "${currentLesson.songTitle}": ${currentLesson.analysisHint}`, 'notes')}
            >
              <strong className="block text-xs uppercase text-[var(--text-muted)] mb-1">Quick Analysis:</strong>
              {currentLesson.analysisHint}
            </div>
          )}
        </div>

        {currentLesson.genreTags && currentLesson.genreTags.length > 0 && (
          <div>
            <strong className="font-artistic-text uppercase text-xs text-[var(--text-muted)] block mt-3 mb-1">Tags:</strong>
            <div className="flex flex-wrap gap-2">
              {currentLesson.genreTags.map(tag => (
                <span key={tag} className="text-xs bg-[var(--bg-tertiary)] px-2 py-1 rounded-sm text-[var(--text-secondary)] font-artistic-text">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnFromMasters;


import React, { useState, useEffect } from 'react';
import { SongProject } from '../types';

interface SongCanvasProps {
  project: SongProject;
  onProjectChange: (project: SongProject) => void;
  onSaveProject: () => void;
  onLoadProject: () => void;
  onClearProject: () => void;
  statusMessage: string;
}

const SongCanvas: React.FC<SongCanvasProps> = ({
  project,
  onProjectChange,
  onSaveProject,
  onLoadProject,
  onClearProject,
  statusMessage
}) => {
  const [localProject, setLocalProject] = useState<SongProject>(project);

  useEffect(() => {
    setLocalProject(project);
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedProject = { ...localProject, [name]: value };
    setLocalProject(updatedProject);
    onProjectChange(updatedProject); 
  };
  
  const exportSongDraft = () => {
    const title = localProject.title || "Untitled_Song";
    const draftContent = `Title: ${localProject.title}\nKey/Tempo: ${localProject.keyTempo}\nMood/Theme: ${localProject.moodTheme}\n\n--- Notes ---\n${localProject.notes}\n\n--- Melodic Ideas ---\n${localProject.melodicIdeas}\n\n--- Song Draft ---\n${localProject.draft}`;
    const blob = new Blob([draftContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/[^a-z0-9_.-]/gi, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };


  return (
    // Added a wrapper class for specific global styling if needed
    <div className="song-canvas-wrapper"> 
        <h2 className="song-canvas-main-title">The Songwriter's Canvas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="control-group">
          <label htmlFor="songWorkingTitle">Working Title:</label>
          <input type="text" id="songWorkingTitle" name="title" value={localProject.title} onChange={handleChange} className="input-base-style" />
        </div>
        <div className="control-group">
          <label htmlFor="songKeyTempo">Key / Tempo:</label>
          <input type="text" id="songKeyTempo" name="keyTempo" value={localProject.keyTempo} onChange={handleChange} className="input-base-style" />
        </div>
        <div className="control-group">
          <label htmlFor="songMoodTheme">Mood / Theme:</label>
          <input type="text" id="songMoodTheme" name="moodTheme" value={localProject.moodTheme} onChange={handleChange} className="input-base-style" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="control-group">
          <label htmlFor="ideaCatcherTextArea">Quick Notes / Scratchpad:</label>
          <textarea id="ideaCatcherTextArea" name="notes" rows={4} value={localProject.notes} onChange={handleChange} className="textarea-base-style"></textarea>
        </div>
        <div className="control-group">
          <label htmlFor="melodicIdeasTextArea">Melodic Ideas / Contour Notes:</label>
          <textarea id="melodicIdeasTextArea" name="melodicIdeas" rows={4} value={localProject.melodicIdeas} onChange={handleChange} className="textarea-base-style"></textarea>
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="songCanvasTextArea">Song Draft & Lyrics:</label>
        <textarea id="songCanvasTextArea" name="draft" rows={18} value={localProject.draft} onChange={handleChange} className="textarea-base-style lined-paper-textarea"></textarea>
      </div>

      <div className="mt-6 flex flex-wrap gap-3"> {/* Increased margin-top and gap */}
        <button onClick={onSaveProject} className="btn btn-primary">Save Project</button>
        <button onClick={onLoadProject} className="btn btn-secondary">Load Project</button>
        <button onClick={exportSongDraft} className="btn btn-tertiary">Export Draft</button>
        <button onClick={onClearProject} className="btn btn-ghost ml-auto">Clear Saved Project</button> {/* Ghost button for less prominent action, pushed right */}
      </div>
      <p className="text-sm mt-4 text-[var(--text-muted)] font-['Special_Elite',_cursive]">{statusMessage}</p>
      {/* Removed style jsx global tag as styles are now centralized */}
    </div>
  );
};

export default SongCanvas;
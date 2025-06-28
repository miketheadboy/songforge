
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SectionBox from './components/SectionBox';
import SparksMuses from './components/SparksMuses';
import LyricalWorkbench from './components/LyricalWorkbench'; // UPDATED: New consolidated component
import MusicalToolkit from './components/MusicalToolkit';
import SongGenerator from './components/SongGenerator';
import SongCanvas from './components/SongCanvas';
import SongStructureSuggester from './components/SongStructureSuggester';
import ArtisticBreak from './components/ArtisticBreak'; 
import Modal from './components/Modal';
import Loader from './components/Loader';
import LearnFromMasters from './components/LearnFromMasters'; 
import SocraticMentor from './components/SocraticMentor'; 
import HookLab from './components/HookLab'; 
import { Theme, SongProject, CanvasDestination, GeminiModalConfig, ConfirmationModalConfig } from './types';
import { INITIAL_SONG_PROJECT } from './constants';

// Updated GeminiModalConfig to include allLines and selectedModalLines for UI interaction
// and originalGeminiCall for the refresh functionality
interface EnhancedGeminiModalConfig extends GeminiModalConfig {
  allLines: string[];
  selectedModalLines: string[];
  originalGeminiCall?: () => Promise<string>; // For refreshing suggestions
}

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [songProject, setSongProject] = useState<SongProject>(INITIAL_SONG_PROJECT);
  const [projectStatusMessage, setProjectStatusMessage] = useState<string>('');

  const [geminiModalConfig, setGeminiModalConfig] = useState<EnhancedGeminiModalConfig>({
    isOpen: false,
    title: "",
    isLoading: false,
    responseText: "",
    allLines: [],
    selectedModalLines: [],
    originalGeminiCall: undefined, // Initialize
    onConfirmAction: undefined,
    confirmButtonText: ""
  });
  const [confirmationModalConfig, setConfirmationModalConfig] = useState<ConfirmationModalConfig>({
    isOpen: false, title: "", message: "", onConfirm: () => {}
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('songforge_theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.dataset.theme = savedTheme;
    } else {
      document.documentElement.dataset.theme = 'dark'; 
    }
    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem('songforge_theme', newTheme);
  };

  const handleProjectChange = (updatedProject: SongProject) => {
    setSongProject(updatedProject);
  };
  
  const saveProject = () => {
    localStorage.setItem('songforge_project', JSON.stringify(songProject));
    setProjectStatusMessage(`Project "${songProject.title || 'Untitled Sketch'}" saved at ${new Date().toLocaleTimeString()}`);
  };

  const loadProject = () => {
    const saved = localStorage.getItem('songforge_project');
    if (saved) {
      const loadedProject = JSON.parse(saved) as SongProject;
      setSongProject(loadedProject);
      setProjectStatusMessage(`Project "${loadedProject.title || 'Untitled Sketch'}" loaded.`);
    } else {
      setSongProject(INITIAL_SONG_PROJECT); 
      setProjectStatusMessage('No saved project. Your canvas awaits its first mark.');
    }
  };
  
  const clearSavedProject = () => {
    setConfirmationModalConfig({
        isOpen: true,
        title: "Clear Saved Project & Canvas",
        message: "Are you sure? This will erase the currently saved project data from your browser's memory and clear the current canvas. This action cannot be undone.",
        onConfirm: () => {
            localStorage.removeItem('songforge_project');
            setSongProject(INITIAL_SONG_PROJECT); 
            setProjectStatusMessage('Project cleared. The canvas is fresh and ready.');
            setConfirmationModalConfig(prev => ({ ...prev, isOpen: false }));
        }
    });
  };

  const handleSendToCanvas = useCallback((content: string, destination: CanvasDestination) => {
    setSongProject(prev => {
      const updatedProject = { ...prev };

      switch (destination) {
        case 'title':
          updatedProject.title = content;
          break;
        case 'keyTempo':
          updatedProject.keyTempo = content;
          break;
        case 'moodTheme':
          updatedProject.moodTheme = content;
          break;
        case 'notes':
          updatedProject.notes = (prev.notes ? prev.notes + '\n\n---\n\n' : '') + content;
          break;
        case 'draft':
          updatedProject.draft = (prev.draft ? prev.draft + '\n\n' : '') + content;
          break;
        case 'melodicIdeas':
          updatedProject.melodicIdeas = (prev.melodicIdeas ? prev.melodicIdeas + '\n\n' : '') + content;
          break;
        default:
          // Optional: handle unexpected destination by logging or doing nothing
          // console.warn(`Unhandled canvas destination: ${destination}`);
          return prev; // No change for unhandled cases
      }
      return updatedProject;
    });
    setProjectStatusMessage(`"${content.substring(0, 30)}..." added to ${destination}.`);
  }, []);

  const handleToggleModalLine = (line: string) => {
    setGeminiModalConfig(prev => {
        const newSelectedLines = prev.selectedModalLines.includes(line)
            ? prev.selectedModalLines.filter(l => l !== line)
            : [...prev.selectedModalLines, line];
        return {...prev, selectedModalLines: newSelectedLines};
    });
  };

  const showGeminiInteraction = useCallback(async (
    modalTitle: string,
    geminiCall: () => Promise<string>,
    onSuccess: (result: string) => void,
    confirmBtnText: string = "Send to Canvas"
  ) => {
    setGeminiModalConfig({
      isOpen: true,
      title: modalTitle,
      isLoading: true,
      responseText: "",
      allLines: [],
      selectedModalLines: [],
      originalGeminiCall: geminiCall, // Store the original call for refresh
      onConfirmAction: undefined, // Will be set on success
      confirmButtonText: "" // Will be set on success
    });
    try {
      const result = await geminiCall();
      const lines = result.split('\n').filter(line => line.trim() !== '');
      setGeminiModalConfig(prev => ({ // Keep originalGeminiCall from the opening set
        ...prev, 
        isLoading: false,
        responseText: result,
        allLines: lines,
        selectedModalLines: [],
        onConfirmAction: () => {
            const currentConfig = geminiModalConfigRef.current; // Use ref for latest selected lines
            const contentToSend = currentConfig.selectedModalLines.length > 0 ? currentConfig.selectedModalLines.join('\n') : result;
            onSuccess(contentToSend);
            setGeminiModalConfig(p => ({...p, isOpen: false, selectedModalLines: [], allLines: []})); 
        },
        confirmButtonText: confirmBtnText,
      }));
    } catch (error) {
      console.error("Gemini API error:", error);
      setGeminiModalConfig(prev => ({ // Keep originalGeminiCall
        ...prev,
        isLoading: false,
        responseText: `Echo from the void (Error): ${error instanceof Error ? error.message : String(error)}`,
        allLines: [`Echo from the void (Error): ${error instanceof Error ? error.message : String(error)}`],
        selectedModalLines: []
      }));
    }
  }, []);

  // Ref to hold the latest geminiModalConfig for use in onConfirmAction closure
  const geminiModalConfigRef = React.useRef(geminiModalConfig);
  useEffect(() => {
    geminiModalConfigRef.current = geminiModalConfig;
  }, [geminiModalConfig]);


  const handleRefreshModalSuggestions = async () => {
    if (!geminiModalConfig.originalGeminiCall) return;

    const originalCall = geminiModalConfig.originalGeminiCall;
    
    setGeminiModalConfig(prev => ({
      ...prev,
      isLoading: true,
      responseText: "",
      allLines: [],
      selectedModalLines: [],
      // Keep onConfirmAction and confirmButtonText if needed, or clear them
    }));

    try {
      const result = await originalCall();
      const lines = result.split('\n').filter(line => line.trim() !== '');
      setGeminiModalConfig(prev => ({
        ...prev,
        isLoading: false,
        responseText: result,
        allLines: lines,
        selectedModalLines: [],
        // originalGeminiCall remains the same for further refreshes
        // onConfirmAction and confirmButtonText should ideally be preserved from the initial setup
        // or re-established if they depend on the new content, though typically they don't.
      }));
    } catch (error) {
      console.error("Gemini API error during refresh:", error);
      setGeminiModalConfig(prev => ({
        ...prev,
        isLoading: false,
        responseText: `Echo from the void (Error on refresh): ${error instanceof Error ? error.message : String(error)}`,
        allLines: [`Echo from the void (Error on refresh): ${error instanceof Error ? error.message : String(error)}`],
        selectedModalLines: [],
      }));
    }
  };


  return (
    <div className="min-h-screen"> 
      <Header theme={theme} onToggleTheme={toggleTheme} />
      
      <main className="main-content-area">
        <section className="foundational-intro-box">
          <h1 className="foundational-intro-title">What is a Song? Why Write?</h1>
          <p className="foundational-intro-text">
            A song is a miniature universe. It’s a feeling captured in rhythm, a story painted with sound, a fleeting moment held fast by melody and word. 
            From whispered lullabies to roaring anthems, songs are the heartbeat of human experience, echoing our joys, sorrows, dreams, and rebellions.
          </p>
          <p className="foundational-intro-text">
            Why write songs? To give voice to the unspoken. To connect with others on a level deeper than everyday conversation. To distill the chaos of life into something beautiful, understandable, or cathartic. 
            It's a craft, a puzzle, an act of courage, and a profound form of self-expression.
          </p>
          <p className="foundational-intro-text">
            Songs are companions. They mark our milestones, comfort us in solitude, fuel our movements, and become the soundtracks to our lives. They are magic, made by everyone, for everyone.
          </p>
        </section>

        <section className="intro-section-box" id="intro-section"> 
            <h2 className="font-covered-by-your-grace text-4xl mb-4 text-[var(--accent-earthy-orange)]">
              SongForge: Your Atelier for Sound & Story.
            </h2>
            <p className="leading-relaxed font-serif-editorial text-lg text-[var(--text-secondary)] mb-6">
                SongForge is your digital atelier, your ink-stained journal, your echo chamber for nascent melodies. 
                A space where ideas collide, harmonies emerge, and songs find their soul. 
                Let AI be your muse for rhyme and reason, your guide through chordal landscapes, your spark from the ephemeral.
            </p>
            <div className="mt-5 text-sm">
                <h4 className="font-artistic-text uppercase tracking-wider text-md font-semibold text-[var(--text-primary)] mb-1">The Songwriter's Path:</h4>
                <ul className="list-none ml-2 mt-2 space-y-2 text-[var(--text-secondary)] font-serif-editorial">
                    <li className="pl-4 border-l-2 border-dashed border-[var(--border-color)] pb-1">Begin Anywhere: A title, a chord, an image, a fleeting phrase. Perfection is the adversary of creation. Capture the raw.</li>
                    <li className="pl-4 border-l-2 border-dashed border-[var(--border-color)] pb-1">Collect & Curate: Use the tools, fill the "Scratchpad," sculpt in the "Song Canvas." Gather your fragments like a lyrical magpie.</li>
                    <li className="pl-4 border-l-2 border-dashed border-[var(--border-color)]">Iterate & Illuminate: The first draft is but a sketch. AI labs offer new hues. Rewrite. Refine. Reveal the song within.</li>
                </ul>
            </div>
        </section>

        <ArtisticBreak />

        <SectionBox title="Conceptual Crucible: A Socratic Dialogue" titleClassName="title-color-cyan" initiallyExpanded wrapperClassName="section-box-wrapper" id="conceptual-crucible">
          <SocraticMentor onSendToCanvas={handleSendToCanvas} showGeminiInteraction={showGeminiInteraction} />
        </SectionBox>

        <ArtisticBreak />

        <SectionBox title="Creative Sparks & Muses" titleClassName="title-color-yellow" initiallyExpanded wrapperClassName="section-box-wrapper" id="sparks-muses">
          <SparksMuses onSendToCanvas={handleSendToCanvas} />
        </SectionBox>

        <ArtisticBreak />

        <SectionBox title="Lyrical Workbench" titleClassName="title-color-cyan" wrapperClassName="section-box-wrapper" id="lyrical-workbench">
          <LyricalWorkbench onSendToCanvas={handleSendToCanvas} showGeminiInteraction={showGeminiInteraction} />
        </SectionBox>
        
        <ArtisticBreak />

        <SectionBox title="Hook Lab: Craft Your Catchiest Lines" titleClassName="title-color-yellow" wrapperClassName="section-box-wrapper" id="hook-lab">
          <HookLab onSendToCanvas={handleSendToCanvas} showGeminiInteraction={showGeminiInteraction} />
        </SectionBox>

        <ArtisticBreak />

        <SectionBox title="Musical Toolkit" titleClassName="title-color-earthy-orange" wrapperClassName="section-box-wrapper" id="musical-toolkit">
          <MusicalToolkit onSendToCanvas={handleSendToCanvas} showGeminiInteraction={showGeminiInteraction} />
        </SectionBox>

        <SectionBox title="AI Song Structure Suggester" titleClassName="title-color-earthy-orange" wrapperClassName="section-box-wrapper" id="song-structure-suggester">
          <SongStructureSuggester onSendToCanvas={handleSendToCanvas} showGeminiInteraction={showGeminiInteraction} />
        </SectionBox>

        <ArtisticBreak />

        <SectionBox title="AI Song Draft Generator" titleClassName="title-color-cyan" wrapperClassName="section-box-wrapper" id="ai-draft-generator">
          <SongGenerator onSendToCanvas={handleSendToCanvas} showGeminiInteraction={showGeminiInteraction} />
        </SectionBox>

        <ArtisticBreak />
        
        <SectionBox title="Sonic Blueprints: Lessons from Legends" titleClassName="title-color-yellow" wrapperClassName="section-box-wrapper" id="lessons-from-legends">
          <LearnFromMasters onSendToCanvas={handleSendToCanvas} />
        </SectionBox>
        
        <div id="song-canvas-section"> {/* Added ID for navigation */}
          <SongCanvas 
              project={songProject} 
              onProjectChange={handleProjectChange}
              onSaveProject={saveProject}
              onLoadProject={loadProject}
              onClearProject={clearSavedProject}
              statusMessage={projectStatusMessage}
          />
        </div>

      </main>

      <Modal
        isOpen={geminiModalConfig.isOpen}
        onClose={() => setGeminiModalConfig(prev => ({ ...prev, isOpen: false, selectedModalLines: [], allLines: [] }))}
        title={geminiModalConfig.title}
        titleClassName="modal-header-title title-color-earthy-orange"
        contentClassName="modal-content-area" 
        closeButtonClassName="modal-close-button-style" 
      >
        {geminiModalConfig.isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="output-display-area min-h-[150px] max-h-[60vh] overflow-y-auto p-4 bg-[var(--bg-primary)] border-[var(--border-stronger)]">
              {geminiModalConfig.allLines.length > 1 ? (
                geminiModalConfig.allLines.map((line, index) => (
                  <div
                    key={index}
                    className={`modal-selectable-line ${geminiModalConfig.selectedModalLines.includes(line) ? 'selected' : ''}`}
                    onClick={() => handleToggleModalLine(line)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleToggleModalLine(line)}
                    role="button"
                    tabIndex={0}
                  >
                    {line}
                  </div>
                ))
              ) : (
                geminiModalConfig.responseText // Display raw response if not multiple lines or only one line
              )}
            </div>
            <div className="mt-6 flex justify-between items-center"> {/* Footer for buttons */}
              <div> {/* Left side for refresh button */}
                {geminiModalConfig.originalGeminiCall && !geminiModalConfig.isLoading && !geminiModalConfig.responseText.toLowerCase().startsWith('echo from the void (error):') && (
                  <button
                    onClick={handleRefreshModalSuggestions}
                    className="btn btn-ghost"
                    title="Get new suggestions"
                  >
                    Refresh Suggestions 🔄
                  </button>
                )}
              </div>
              <div> {/* Right side for confirm button */}
                {geminiModalConfig.onConfirmAction && geminiModalConfig.responseText && !geminiModalConfig.responseText.toLowerCase().startsWith('echo from the void (error):') && (
                  <button 
                      onClick={geminiModalConfig.onConfirmAction} 
                      className="btn btn-primary" 
                  >
                    {geminiModalConfig.confirmButtonText || "Use This"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </Modal>

      <Modal
        isOpen={confirmationModalConfig.isOpen}
        onClose={() => setConfirmationModalConfig(prev => ({ ...prev, isOpen: false }))}
        title={confirmationModalConfig.title}
        titleClassName="modal-header-title title-color-yellow" 
        contentClassName="modal-content-area" 
        closeButtonClassName="modal-close-button-style" 
      >
        <p className="mb-6 text-[var(--text-primary)] font-serif-editorial text-base">{confirmationModalConfig.message}</p>
        <div className="flex justify-end gap-3">
            <button 
                onClick={() => setConfirmationModalConfig(prev => ({ ...prev, isOpen: false }))} 
                className="btn btn-ghost" 
            >
                Cancel
            </button>
            <button 
                onClick={confirmationModalConfig.onConfirm} 
                className="btn btn-danger"
            >
                Yes, Clear It
            </button>
        </div>
      </Modal>

    </div>
  );
};

export default App;

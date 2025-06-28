import React, { useState, useEffect } from 'react';
import { SOCRATIC_QUESTIONS, randomChoice } from '../constants';
import { SocraticQuestion, SocraticChoice, CanvasDestination } from '../types';
import { geminiService } from '../services/geminiService'; // Import geminiService
import Loader from './Loader'; // For potential future button loading state

interface SocraticMentorProps {
  onSendToCanvas: (content: string, destination: CanvasDestination) => void;
  showGeminiInteraction: ( // Added prop
    modalTitle: string,
    geminiCall: () => Promise<string>,
    onSuccess: (result: string) => void,
    confirmBtnText?: string
  ) => Promise<void>;
}

const SocraticMentor: React.FC<SocraticMentorProps> = ({ onSendToCanvas, showGeminiInteraction }) => {
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [conceptSummaryNotes, setConceptSummaryNotes] = useState<string[]>([]);
  const [isDialogueComplete, setIsDialogueComplete] = useState(false);
  const [isGeneratingSparks, setIsGeneratingSparks] = useState(false); // For button loading

  const startDialogue = () => {
    setCurrentQuestionId(1); // Assuming first question has ID 1
    setConceptSummaryNotes([]);
    setIsDialogueComplete(false);
  };

  useEffect(() => {
    startDialogue(); // Start dialogue on mount
  }, []);

  const handleAnswer = (choice: SocraticChoice) => {
    if (choice.conceptNote) {
      setConceptSummaryNotes(prev => [...prev, choice.conceptNote!]);
    }

    if (choice.nextQuestionId) {
      setCurrentQuestionId(choice.nextQuestionId);
      setIsDialogueComplete(false);
    } else {
      setIsDialogueComplete(true);
      setCurrentQuestionId(null); // No more questions
    }
  };

  const currentQuestion = SOCRATIC_QUESTIONS.find(q => q.id === currentQuestionId);

  const handleSendSummaryToNotes = () => {
    if (conceptSummaryNotes.length > 0) {
      const summaryText = "Socratic Dialogue Concept Notes:\n- " + conceptSummaryNotes.join("\n- ");
      onSendToCanvas(summaryText, 'notes');
    }
  };

  const handleGenerateSparks = async () => {
    if (conceptSummaryNotes.length === 0) {
      alert("Please complete the dialogue or have some concept notes before generating sparks.");
      return;
    }
    setIsGeneratingSparks(true);
    const joinedSummaryNotes = conceptSummaryNotes.join("\n- ");
    
    await showGeminiInteraction(
      "AI Song Sparks from Your Concept",
      () => geminiService.generateConceptualSparks(joinedSummaryNotes),
      (generatedSparks) => {
        onSendToCanvas(generatedSparks, 'draft');
      },
      "Add Sparks to Draft"
    );
    setIsGeneratingSparks(false);
  };


  return (
    <div className="subsection-card space-y-6">
      <div>
        <h3 className="subsection-title">Conceptual Crucible</h3>
        <p className="text-sm text-[var(--text-muted)] font-serif-editorial mb-4">
          Unearth the core of your song. Answer these questions to build a foundational concept.
        </p>
      </div>

      {currentQuestion && !isDialogueComplete && (
        <div className="p-4 border border-[var(--border-input)] rounded-md bg-[var(--bg-primary-inset)]">
          <p className="text-lg font-serif-editorial mb-4 text-[var(--text-primary)]">{currentQuestion.text}</p>
          <div className="space-y-2">
            {currentQuestion.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(choice)}
                className="btn btn-ghost w-full text-left justify-start"
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {isDialogueComplete && (
        <div className="p-4 border border-[var(--border-input)] rounded-md bg-[var(--bg-primary-inset)]">
          <p className="text-lg font-serif-editorial mb-2 text-[var(--accent-yellow)]">Dialogue Complete!</p>
          <p className="text-sm text-[var(--text-secondary)]">You've explored your initial concept. You can now send your summary to notes or generate AI-powered song sparks below.</p>
        </div>
      )}

      {conceptSummaryNotes.length > 0 && (
        <div>
          <h4 className="font-artistic-subtitle text-lg text-[var(--text-secondary)] mb-2">Concept Summary:</h4>
          <div className="output-display-area min-h-[100px]">
            <ul className="list-disc list-inside space-y-1">
              {conceptSummaryNotes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-3 mt-4">
        <button onClick={startDialogue} className="btn btn-secondary">
          Restart Dialogue 🗣️
        </button>
        {conceptSummaryNotes.length > 0 && (
          <button onClick={handleSendSummaryToNotes} className="btn btn-primary">
            Send Summary to Notes 📝
          </button>
        )}
        {isDialogueComplete && conceptSummaryNotes.length > 0 && (
          <button 
            onClick={handleGenerateSparks} 
            className="btn btn-tertiary flex items-center justify-center min-w-[200px]"
            disabled={isGeneratingSparks}
          >
            {isGeneratingSparks ? <Loader /> : "Generate Song Sparks ✨"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SocraticMentor;

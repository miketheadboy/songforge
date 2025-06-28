
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  titleClassName?: string;
  contentClassName?: string; // For styling the main content box
  closeButtonClassName?: string; // For styling the close button
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  titleClassName = "title-color-earthy-orange", // UPDATED: Changed from text-[var(--accent-magenta)]
  contentClassName = "modal-content-area", // Default class from global CSS
  closeButtonClassName = "modal-close-button-style" // Default class from global CSS
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[1000] bg-black/80 flex items-center justify-center p-4 overflow-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={contentClassName}>
        <button
          onClick={onClose}
          className={closeButtonClassName}
          aria-label="Close modal"
        >
          &times;
        </button>
        <h3 id="modal-title" className={`text-2xl mb-4 font-['Rock_Salt',_cursive] ${titleClassName}`}>
          {title}
        </h3>
        <div className="text-[var(--text-primary)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
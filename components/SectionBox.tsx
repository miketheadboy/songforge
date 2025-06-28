
import React, { useState } from 'react';

interface SectionBoxProps {
  title: string;
  id?: string; // Added id prop
  titleClassName?: string;
  children: React.ReactNode;
  initiallyExpanded?: boolean;
  wrapperClassName?: string; 
}

const SectionBox: React.FC<SectionBoxProps> = ({ id, title, titleClassName = "text-[var(--text-primary)]", children, initiallyExpanded = false, wrapperClassName = "section-box-wrapper" }) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const sectionContentId = `section-content-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <section className={wrapperClassName} id={id}> {/* Applied id prop here */}
      <div
        className="collapsible-header flex justify-between items-center py-2 cursor-pointer" // Added flex, justify-between, items-center
        onClick={toggleExpansion}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleExpansion()}
        aria-expanded={isExpanded}
        aria-controls={sectionContentId}
      >
        <h2 className={`main-section-title ${titleClassName}`}>
          {title}
        </h2>
        <span 
          className={`section-toggle-icon transition-transform duration-300 ease-in-out ${isExpanded ? 'expanded' : ''}`}
        >
          ▼
        </span>
      </div>
      <div
        id={sectionContentId}
        className={`collapsible-content ${isExpanded ? 'expanded' : ''}`}
      >
        {/* Content receives padding from CSS when expanded */}
        {children}
      </div>
    </section>
  );
};

export default SectionBox;
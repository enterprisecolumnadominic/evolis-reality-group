import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import AgentProfileCard from "../Team/AgentProfileCard";
import { Employee_Profile } from "../Data/Employee_Profile";
import "./AgentModal.css";

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Employee_Profile | null;
}

const AgentModal: React.FC<AgentModalProps> = ({ isOpen, onClose, agent }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen || !agent) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="agent-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close Modal"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <AgentProfileCard agent={agent} />
      </div>
    </div>
  );
};

export default AgentModal;

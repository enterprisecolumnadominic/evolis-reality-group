import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import ModalBase from "./ModalBase";
import "./SuccessModal.css";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  isEmbedded?: boolean; // 🎯 New prop: If true, don't wrap in ModalBase
}

const SuccessContent: React.FC<{
  title: string;
  message: string;
  onClose: () => void;
}> = ({ title, message, onClose }) => (
  <div className="modal-success-state py-4 text-center">
    <FontAwesomeIcon icon={faCheckCircle} className="success-check mb-3" />
    <h2 className="mb-3">{title}</h2>
    <p className="px-3">{message}</p>
    <button className="btn btn-success mt-4 px-5" onClick={onClose}>
      Close
    </button>
  </div>
);

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  isEmbedded = false,
}) => {
  // If embedded in another modal (like Inquiry), just return the content
  if (isEmbedded) {
    return <SuccessContent title={title} message={message} onClose={onClose} />;
  }

  // Otherwise, wrap it in the base shell for stand-alone use (PreQualify)
  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <SuccessContent title={title} message={message} onClose={onClose} />
    </ModalBase>
  );
};

export default SuccessModal;

import React from "react";
import { Employee_Profile } from "../Data/Employee_Profile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faStar,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedin,
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import "./AgentProfileCard.css";

interface AgentProfileCardProps {
  agent: Employee_Profile;
}

const AgentProfileCard: React.FC<AgentProfileCardProps> = ({ agent }) => {
  // 🎯 Clean approach for Social Links
  const socialPlatforms = [
    {
      key: "linkedin",
      icon: faLinkedin,
      url: agent.socials?.linkedin,
      colorClass: "li",
    },
    {
      key: "facebook",
      icon: faFacebook,
      url: agent.socials?.facebook,
      colorClass: "fb",
    },
    {
      key: "twitter",
      icon: faTwitter,
      url: agent.socials?.twitter,
      colorClass: "tw",
    },
    {
      key: "instagram",
      icon: faInstagram,
      url: agent.socials?.instagram,
      colorClass: "ig",
    },
    {
      key: "youtube",
      icon: faYoutube,
      url: agent.socials?.youtube,
      colorClass: "yt",
    },
  ];

  return (
    <div className="agent-profile-card">
      {/* Upper Section: Photo & Contact Info */}
      <div className="agent-main-layout">
        <div className="agent-photo-container">
          <img
            src={
              agent.profilePhoto || "https://placehold.co/300x400?text=No+Photo"
            }
            alt={`Profile of ${agent.name}`}
            className="agent-photo"
          />
        </div>

        <div className="agent-text-content">
          <div className="agent-title-info">
            <h2>{agent.name || (agent as any).Name}</h2>
            <p className="agent-title">{agent.title}</p>
            <div className="agent-contact">
              <p>
                <FontAwesomeIcon icon={faPhone} /> {agent.phone}
              </p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} /> {agent.email}
              </p>
            </div>
          </div>
          <div className="agent-description-block">
            <p className="agent-description-text">{agent.description}</p>
          </div>
        </div>
      </div>

      {/* Middle Section: Specialties & Languages */}
      <div className="agent-details-container">
        {agent.specialties?.length > 0 && (
          <div className="agent-specialties-section">
            <h3>
              <FontAwesomeIcon icon={faStar} /> Specialties
            </h3>
            <ul className="specialties-grid">
              {agent.specialties.map((s, index) => (
                <li key={`spec-${index}`}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {agent.languages?.length > 0 && (
          <div className="agent-languages-section">
            <h3>
              <FontAwesomeIcon icon={faGlobe} /> Languages
            </h3>
            <ul className="languages-row">
              {agent.languages.map((l, index) => (
                <li key={`lang-${index}`}>{l}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Section: Social Media */}
      <div className="agent-socials">
        {socialPlatforms.map(
          (platform) =>
            platform.url && (
              <a
                key={platform.key}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                /* 🎯 Applying the brand class here */
                className={`social-icon ${platform.colorClass}`}
                aria-label={`Visit ${agent.name}'s ${platform.key}`}
              >
                <FontAwesomeIcon icon={platform.icon} />
              </a>
            ),
        )}
      </div>
    </div>
  );
};

export default AgentProfileCard;

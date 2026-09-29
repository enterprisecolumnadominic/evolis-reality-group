import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { MediaItem } from "../../../../Data/Available_Properties";
import "./PropertyDetailGallery.css";

interface PropertyDetailGalleryProps {
  mediaItems: MediaItem[];
  imageIndex: number;
  propertyName: string;
  switchImage: (direction: "prev" | "next") => void;
  handleThumbnailClick: (index: number) => void;
}

const PropertyDetailGallery: React.FC<PropertyDetailGalleryProps> = ({
  mediaItems,
  imageIndex,
  propertyName,
  switchImage,
  handleThumbnailClick,
}) => {
  const activeMedia = mediaItems.filter(
    (item) => item.url || item.videoDetails?.videoUrl,
  );
  const currentMedia = activeMedia[imageIndex];

  return (
    <div className="details-image-gallery">
      <div className="thumbnail-gallery">
        {activeMedia.map((item, index) => (
          <div
            key={index}
            className={`thumbnail-item ${index === imageIndex ? "active" : ""}`}
            onClick={() => handleThumbnailClick(index)}
          >
            {item.videoDetails?.videoUrl ? (
              <div className="video-thumb-placeholder">
                <span className="video-badge">VIDEO</span>
                <div className="video-icon-wrapper">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/10090/10090287.png"
                    className="video-icon-img"
                    alt="Play Video"
                  />
                </div>
              </div>
            ) : (
              <img
                src={item.url || "https://placehold.co/600x400"}
                className="thumbnail-image"
                alt={`Thumb ${index}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="main-image-container">
        {currentMedia?.videoDetails?.videoUrl ? (
          <div className="video-wrapper">
            <iframe
              src={currentMedia.videoDetails.videoUrl}
              title="Property Video"
              className="main-video-player"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <img
            src={currentMedia?.url || "https://placehold.co/1200x800"}
            alt={propertyName}
            className="main-image"
          />
        )}

        {activeMedia.length > 1 && (
          <>
            <button
              className="nav-arrow prev"
              onClick={() => switchImage("prev")}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button
              className="nav-arrow next"
              onClick={() => switchImage("next")}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailGallery;

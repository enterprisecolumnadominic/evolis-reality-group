import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Available_Properties,
  MediaItem,
} from "../../Data/Available_Properties";
import { getPropertyByGuid } from "../../helpers/services/PropertyService";

const AUTO_SWITCH_INTERVAL = 5000;

export const usePropertyDetails = (id: string | undefined) => {
  const [property, setProperty] = useState<Available_Properties | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  // 🎯 FIX 1: Use useMemo so validMedia reference stays the same unless property changes
  // This prevents the "infinite loop" of timer resets
  const validMedia = useMemo(() => {
    return (property?.mediaItems || []).filter(
      (item): item is MediaItem => !!(item.url || item.videoDetails?.videoUrl),
    );
  }, [property?.mediaItems]);

  const switchImage = useCallback(
    (direction: "next" | "prev") => {
      const total = validMedia.length;
      if (total === 0) return;
      setImageIndex((prev) =>
        direction === "next" ? (prev + 1) % total : (prev - 1 + total) % total,
      );
    },
    [validMedia.length], // Only recreates if the count changes
  );

  const handleThumbnailClick = (index: number) => {
    setImageIndex(index);
  };

  // 🎯 Fetch Data
  useEffect(() => {
    if (!id || id === "undefined") return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPropertyByGuid(id);
        setProperty(data);
        setImageIndex(0);
        window.scrollTo(0, 0);
      } catch (err: any) {
        setError(err.message || "Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🎯 FIX 2: Timer Logic with Video Detection
  useEffect(() => {
    // 1. Don't rotate if there's only one item
    if (validMedia.length <= 1) return;

    // 2. Pause auto-switch if user is on a video slide
    const currentItem = validMedia[imageIndex];
    const isVideo = !!currentItem?.videoDetails?.videoUrl;
    if (isVideo) return;

    const interval = setInterval(() => {
      switchImage("next");
    }, AUTO_SWITCH_INTERVAL);

    return () => clearInterval(interval);
  }, [switchImage, validMedia, imageIndex]); // Now stable thanks to useMemo

  return {
    property,
    loading,
    error,
    imageIndex,
    mediaItems: validMedia,
    switchImage,
    handleThumbnailClick,
  };
};

import { useState, useEffect } from "react";
import { getAllContent } from "../../helpers/services/ContentService";
import { ContentPost_Data } from "../../Data/ContentPost_Data";

export const useContentData = (type?: "Blog" | "Event", page: number = 1) => {
  const [posts, setPosts] = useState<ContentPost_Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Pass the 'page' parameter to the service
        const response = await getAllContent(page, 12, true, type);

        const rawData = response?.items || [];
        setTotalPages(response?.totalPages || 1);

        const normalized = rawData.map((post: any) => ({
          ...post,
          id: post.guid || post.id,
          isActive: post.isEnabled ?? post.isActive ?? true,
          imageUrl: post.imageUrl || post.ImageUrl,
          publishedDate: post.publishedDate || post.PublishedDate,
        }));

        setPosts(normalized);
      } catch (err: any) {
        setError(err.message || "Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [type, page]);

  return { posts, loading, error, totalPages };
};

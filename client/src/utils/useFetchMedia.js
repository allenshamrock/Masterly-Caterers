import React, { useState, useEffect } from "react";

const useFetchMedia = () => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:5555/gallery");
        if (!response.ok) {
          throw new Error("Failed to fetch gallaries");
        }
        const data = await response.json();
        setMedia(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return { media,setMedia, isLoading, error };
};

export default useFetchMedia;

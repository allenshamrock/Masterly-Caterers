import { useEffect, useState } from "react";

//This blogId parameter allows for the specific id of a blog to fetch.if blog id is null or undefined it fetches all blogs
const useFetchBlogs = (blogId = null) => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const url = blogId
          ? `https://masterly-caterers.onrender.com/blogs/${blogId}`
          : "https://masterly-caterers.onrender.com/blogs";
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(blogId ? [data] : data); //Setting a single blog  post  wrapped in an array,otherwise set all blogs
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [blogId]); // Re-mounts when the blogId changes

  return { blogs, setBlogs, isLoading, error };
};
export default useFetchBlogs;

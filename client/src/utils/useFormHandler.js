import { useState } from "react";

const useFormHandler = (initialState, user, toast) => {
  const [input, setInput] = useState(initialState);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    setInput((prevState) => ({
      ...prevState,
      type: selectedFile,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.title.trim() || !input.content.trim()) {
      setError("Please fill in all required fields (Title, Content, and File)");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("title", input.title);
    formData.append("content", input.content);
    formData.append("link", input.link);
    formData.append("user_id", user.id);
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://masterly-caterers.onrender.com/blogs",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        setError(
          errorMessage.error || "An error occurred. Please try again later."
        );
      } else {
        setSuccess("Post created successfully!");
        setInput({
          title: "",
          content: "",
          link: "",
          user_id: user.id,
          type: null,
        });
        setFile(null);
        showToast();
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = () => {
    toast({
      title: "Post Created!",
      description: "Post created successfully!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  };

  return {
    input,
    file,
    isLoading,
    error,
    success,
    handleChange,
    handleFileChange,
    handleSubmit,
  };
};

export default useFormHandler;

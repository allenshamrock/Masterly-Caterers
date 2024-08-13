import React, { useState} from "react";
import { useSelector } from "react-redux";
import { selectUserData,selectCurrentIsRole} from "../features/auth/Authslice";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
  useDisclosure,
  ModalFooter,
} from "@chakra-ui/react";
import { FaImages } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
const Blog = () => {
  const user = useSelector(selectUserData);
  const role = useSelector(selectCurrentIsRole)
  console.log("current user role", role)
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState(null);
  const [input, setInput] = useState({
    title: "",
    content: "",
    link: "",
    user_id: user.id,
    type: null, // Initialize type as null
  });
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

    // Update the input state with the selected file
    setInput((prevState) => ({
      ...prevState,
      type: selectedFile,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    if (!input.title.trim() || !input.content.trim()) {
      setError("Please fill in all required fields (Title, Content, and File)");
      console.log("Validation failed");
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
    console.log("FormData:", formData);

    try {
      const response = await fetch("http://127.0.0.1:5555/blogs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        console.log("Error response:", errorMessage);
        setError(
          errorMessage.error || "An error occurred. Please try again later."
        );
      } else {
        console.log("Success response");
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
      console.error("Error posting data:", error);
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
  return (
    <div className="h-screen w-full">
      <div className="mx-2 my-2 relative ">
        <img
          src="/blogHero.jpeg"
          alt="Blog hero"
          className="object-cover object-center w-full h-auto md:h-[500px] relative "
        />
        {role === "admin" && (
          <>
            <button
              className="absolute bottom-0 right-0 p-2 md:p-4  rounded-full bg-gold border font-bold flex justify-center align-middle text-black hover:bg-grey m-4 "
              onClick={onOpen}
            >
              <IoAdd fontSize={"1.5rem"} />
              Create a Post
            </button>
            <Modal
              isOpen={isOpen}
              onClose={onClose}
              isCentered
              size={"2xl"}
              motionPreset="slideInBottom"
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader></ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <form className="block w-full" onSubmit={handleSubmit}>
                    <h1 className="font-bold text-2xl text-slate-900">
                      Create a Post
                    </h1>
                    <h3 className="font-bold">Text</h3>
                    <input
                      name="title"
                      value={input.title}
                      className="rounded-xl border-2 border-slate-400 my-3 w-full p-3"
                      type="text"
                      placeholder="Title"
                      onChange={handleChange}
                    />
                    <Textarea
                      name="content"
                      value={input.content}
                      className="w-full rounded-md p-3 border-2 border-slate-400"
                      onChange={handleChange}
                      placeholder="Body"
                    />
                    <hr />
                    <h3 className="font-bold">Image</h3>
                    <div className="flex p-4 border-dotted border-2 border-slate-800 my-3 justify-center align-middle rounded-md h-fit">
                      <label className="drop-area">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                        <p className="w-fit flex p-2">
                          Drag and drop an image/video
                          <FaImages />
                        </p>
                        {file && (
                          <div>
                            <h3>Preview:</h3>
                            {file.type.startsWith("image/") ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                style={{ maxWidth: "100%", maxHeight: "200px" }}
                              />
                            ) : (
                              <video
                                controls
                                style={{ maxWidth: "100%", maxHeight: "200px" }}
                              >
                                <source
                                  src={URL.createObjectURL(file)}
                                  type={file.type}
                                />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                        )}
                      </label>
                    </div>
                    <hr />
                    <h3 className="font-bold">Link</h3>
                    <input
                      name="link"
                      value={input.link}
                      onChange={handleChange}
                      className="rounded-xl border-2 border-slate-400 my-3 w-full p-3"
                      type="url"
                      placeholder="Link URL"
                    />
                    <div className="flex justify-between w-full">
                      <button
                        type="button"
                        onClick={onClose}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        disabled={isLoading}
                      >
                        {isLoading ? "Posting..." : "Post"}
                      </button>
                    </div>
                  </form>
                </ModalBody>
                <ModalFooter />
              </ModalContent>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;

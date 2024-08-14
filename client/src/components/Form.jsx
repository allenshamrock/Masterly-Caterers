import React from "react";
import { Textarea } from "@chakra-ui/react";
import { FaImages } from "react-icons/fa";

const Form = ({
  input,
  file,
  handleChange,
  handleFileChange,
  handleSubmit,
  isLoading,
  onClose,
}) => {
  return (
    <form className="block w-full" onSubmit={handleSubmit}>
      <h1 className="font-bold text-2xl text-slate-900">Create a Post</h1>
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
            accept="image/*,video/*"
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
                  <source src={URL.createObjectURL(file)} type={file.type} />
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
  );
};

export default Form;

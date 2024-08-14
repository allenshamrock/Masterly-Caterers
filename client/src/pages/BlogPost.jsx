import React from "react";
import { useParams } from "react-router-dom";
import useFetchBlogs from "../utils/useFetchBlogs";
import {
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa";
import { selectCurrentIsRole } from "../features/auth/Authslice";
import { useSelector } from "react-redux";
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const BlogPost = () => {
  const navigate = useNavigate();

  // Get blogId from route parameters
  const { blogId } = useParams();

  // Fetch the blog using the blogId
  const { blogs, setBlogs, isLoading, error } = useFetchBlogs(blogId);

  // Get the current user role
  const role = useSelector(selectCurrentIsRole);
  const toast = useToast();
  const deleteBlog = async (blogId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log(response);

      if (!response.ok) {
        throw new Error("Failed to delete blog post");
      }

      // Update the state to reflect the deleted blog
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
      toast({
        title: "Post Deleted",
        description: "The blog post has been deleted successfully.",
        status: "success",
        duration: 5000,
        position: "top-center",
        isClosable: true,
      });
      navigate(`/blogs`);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) return <div>Loading....</div>;
  if (error) return <div>Error: {error}</div>;

  // Only render a single blog, as we are fetching by ID
  const blog = blogs[0];
  const handleClick = () => {
    navigate(`/blogs`);
  };

  return (
    <div className="h-auto w-full">
      <div className="mx-2 my-2 relative">
        <img
          src="/blogHero.jpeg"
          alt="Blog hero"
          className="object-cover object-center w-full h-auto md:h-[500px] relative "
        />
        <button onClick={handleClick}>
          <IoArrowBackCircle className="absolute  text-gold text-3xl  top-1 left-1 md:top-4 md:left-4" />
        </button>

        <div className="grid grid-cols-1 gap-4 mt-4">
          {blog && ( // Check if the blog exists
            <Card maxW="full" className="mx-auto ">
              <div className="flex flex-col  md:flex-row items-stretch">
                <div className="md:w-1/2">
                  <Heading size="md">{blog.title}</Heading>
                  <Image
                    src={blog.image_url}
                    alt={blog.title}
                    className="w-full h-40 md:h-full object-cover"
                    borderRadius="lg"
                  />
                </div>
                <div className="md:w-1/2 flex flex-col justify-between">
                  <CardBody>
                    <Text color="blue.600" fontSize="2xl">
                      {blog.subtitle}
                    </Text>
                    <Text mt={2}>{blog.content}</Text>
                  </CardBody>
                  <CardFooter className="flex justify-between items-center">
                    <Text className="font-semibold">
                      Published at:{" "}
                      <span>
                        {new Date(blog.publish_date).toLocaleDateString()}
                      </span>
                    </Text>

                    {role === "admin" && (
                      <button
                        onClick={() => deleteBlog(blog.id)}
                        className="cursor-pointer rounded-md p-2 bg-red-600 text-md text-black flex gap-1 items-center"
                      >
                        Remove <FaTrashAlt />
                      </button>
                    )}
                  </CardFooter>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;

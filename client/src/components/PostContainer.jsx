import React from "react";
import useFetchBlogs from "../utils/useFetchBlogs";
import { selectCurrentIsRole } from "../features/auth/Authslice";
import {
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";


const PostContainer = () => {
  const { blogs, setBlogs, isLoading, error } = useFetchBlogs();
  const role = useSelector(selectCurrentIsRole);
  const toast = useToast()

const deleteBlog = async (blogId) => {
  try {
    const response = await fetch(`http://127.0.0.1:5555/blogs/${blogId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error( "Failed to delete blog post");
    }

    // Update the state to reflect the deleted blog
    setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
    toast({
      title: "Post Deleted",
      description: "The blog post has been deleted successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
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

  if (isLoading) {
    return (
      <div className="flex items-center flex-col font-bold text-xl">
        {" "}
        Loading...
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center space-y-3">
      {blogs.map((blog, index) => (
        <Card maxW="sm" key={index} className="mx-auto">
          <CardBody>
            <Image
              src={blog.image_url}
              alt={blog.title}
              className="w-full h-40 object-cover"
              borderRadius="lg"
            />

            <Heading size="md">{blog.title}</Heading>
            <Text>{blog.content}</Text>
            <Text color="blue.600" fontSize="2xl"></Text>
          </CardBody>
          <Divider />
          <CardFooter className="flex justify-between items-center">
            <Text className="font-semibold ">
              Published at :
              <span className="">
                {" "}
                {new Date(blog.publish_date).toLocaleDateString()}
              </span>{" "}
            </Text>

            {role === "admin" && (
              <button onClick={()=>deleteBlog(blog.id)} className="cursor rounded-md p-2  bg-red-600 text-md  text-black flex gap-1 items-center">
                Remove{" "}
                <span>
                  <FaTrashAlt />
                </span>
              </button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PostContainer;

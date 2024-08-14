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
import { Link } from "react-router-dom";

const PostContainer = () => {
  const { blogs, isLoading, error } = useFetchBlogs();
  const role = useSelector(selectCurrentIsRole);

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
      {blogs && blogs.length > 0 ? (
        blogs.map((blog, index) => (
          <Card
            maxW="sm"
            key={index}
            as={Link}
            to={`/blogs/${blog.id}`}
            className="mx-auto"
          >
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
                <button
                  onClick={() => deleteBlog(blog.id)}
                  className="cursor rounded-md p-2  bg-red-600 text-md  text-black flex gap-1 items-center"
                >
                  Remove{" "}
                  <span>
                    <FaTrashAlt />
                  </span>
                </button>
              )}
            </CardFooter>
          </Card>
        ))
      ) : (
        <Text className="flex  items-center text-2xl font-semibold justify-center">
          No Blogs yet ....
        </Text>
      )}
    </div>
  );
};

export default PostContainer;

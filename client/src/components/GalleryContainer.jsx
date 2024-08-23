import React from "react";
import useFetchMedia from "../utils/useFetchMedia";
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
import { selectCurrentIsRole } from "../features/auth/Authslice";
import { useSelector } from "react-redux";

const GalleryContainer = () => {
  const { media, setMedia, isLoading, error } = useFetchMedia();
  const toast = useToast();
  const role = useSelector(selectCurrentIsRole);
  // console.log(role)

  if (isLoading) {
    return (
      <div className="flex items-center text-3xl font-bold">Loading...</div>
    );
  }

  const deleteMedia = async (galleryId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5555/gallery/${galleryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete media");
      }

      // Update the state to reflect the deleted media
      setMedia((prevMedia) =>
        prevMedia.filter((media) => media.id !== galleryId)
      );
      toast({
        title: "Media Deleted",
        description: "The media item has been deleted successfully.",
        status: "success",
        duration: 5000,
        position: "top-center",
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

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col justify-center items-center space-y-3">
      {media && media.length > 0 ? (
        media.map((media) => (
          <Card maxW="md" key={media.id} className="mx-auto">
            <CardBody>
              {media.type ? (
                media.type.includes("image/") ? (
                  <Image src={media.type} w={"70%"} h={"300px"} />
                ) : media.type.includes("video/") ? (
                  <video
                    controls
                    src={media.type}
                    style={{ width: "80%", height: "400px" }}
                  />
                ) : media.type.includes("audio/") ? (
                  <audio controls src={media.type} style={{ width: "100%" }} />
                ) : null
              ) : (
                <Text>No media available</Text>
              )}

              <Heading size="md">{media.title}</Heading>
              <Text>{media.content}</Text>
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-between items-center gap-2">
              <Text className="font-semibold ">
                Published at :
                <span>
                  {new Date(media.publish_date).toLocaleDateString()}
                </span>
              </Text>

              {role === "admin" && (
                <button
                  onClick={() => deleteMedia(media.id)}
                  className="cursor rounded-md p-2 bg-red-600 text-md text-black flex gap-1 items-center"
                >
                  <span>
                    <FaTrashAlt />
                  </span>
                </button>
              )}
            </CardFooter>
          </Card>
        ))
      ) : (
        <Text className="flex items-center text-2xl font-semibold justify-center">
          No media yet...
        </Text>
      )}
    </div>
  );
};

export default GalleryContainer;

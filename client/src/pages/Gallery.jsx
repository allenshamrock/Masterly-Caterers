// Gallery.js
import React from "react";
import { useSelector } from "react-redux";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { IoAdd } from "react-icons/io5";
import {
  selectCurrentIsRole,
  selectUserData,
} from "../features/auth/Authslice";
import Form from "../components/Form";
import useFormHandler from "../utils/useFormHandler";
import GalleryContainer from "../components/GalleryContainer";

const Gallery = () => {
  const role = useSelector(selectCurrentIsRole);
  const user = useSelector(selectUserData);
  console.log(user.id)
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const {
    input,
    file,
    isLoading,
    handleChange,
    handleFileChange,
    handleSubmit,
  } = useFormHandler(
    {
      title: "",
      content: "",
      link: "",
      user_id: user.id,
      type: null,
    },
    user,
    toast
  );

  return (
    <div className="h-auto w-full">
      <div className="mx-2 my-2 relative font-libre">
        <img
          src="/cooking.jpeg"
          alt="A GIF photo"
          className="object-cover object-center w-full h-auto md:h-[500px] relative"
        />

        {role === "admin" && (
          <>
            <button
              className="absolute top-0 right-0 p-2 md:p-4  rounded-full bg-gold border font-bold flex justify-center align-middle text-black hover:bg-grey m-4 "
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
                  <Form
                    input={input}
                    file={file}
                    handleChange={handleChange}
                    handleFileChange={handleFileChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    onClose={onClose}
                  />
                </ModalBody>
                <ModalFooter />
              </ModalContent>
            </Modal>
          </>
        )}
        <div className=" flex flex-col items-center  mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <GalleryContainer/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;

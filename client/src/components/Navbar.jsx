import React from "react";
import { NavLink } from "react-router-dom";
import "../../src/App.css";
import { CgMenuRightAlt } from "react-icons/cg";
import Login from "../components/authentication/Login";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Flex,
  useDisclosure,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
} from "@chakra-ui/react";
import { RiAccountCircleFill } from "react-icons/ri";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isLoginOpen,
    onOpen: onLoginOpen,
    onClose: onLoginClose,
  } = useDisclosure();
  const buttonRef = React.useRef();

  const handleAccountIconClick = () => {
    onClose();
    onLoginOpen()
  };

  return (
    <div className="font-libre text-black-600 flex justify-between  items-center bg-[#111] w-[100%] font-semibold py-[20px] overflow-hidden pr-[10px]">
      <Image src="/logo.png" className="text-4xl h-[60px] w-auto px-3" />

      <nav className="sm:gap-[12px] hidden md:flex md:gap-[30px] pr-[10px] ml-auto">
        <NavLink className="nav-links" to={"/"}>
          Home
        </NavLink>
        <NavLink className="nav-links" to={"/about"}>
          About
        </NavLink>
        <NavLink className="nav-links" to={"/services"}>
          Services
        </NavLink>
        <NavLink className="nav-links" to={"/contact"}>
          Contact us
        </NavLink>
        <NavLink className="nav-links" to={"/blogs"}>
          Blogs
        </NavLink>
        <NavLink className="nav-links" to={"/gallery"}>
          Gallery & Media
        </NavLink>
        <RiAccountCircleFill
          className="text-[#d4d4d4] text-2xl mb-2 cursor-pointer"
          onClick={handleAccountIconClick}
        />
      </nav>

      <Flex className="flex md:hidden pr-[4px]">
        <Box
          className="cursor-pointer rounded-s-lg"
          ref={buttonRef}
          onClick={onOpen}
        >
          <CgMenuRightAlt className="bg-[#fff8ac] rounded-md text-3xl md:hidden" />
        </Box>
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={buttonRef}
        >
          <DrawerOverlay />
          <DrawerContent bg={"#111"}>
            <DrawerCloseButton color={"#FFD700"} className="text-3xl mr-2" />
            <DrawerHeader></DrawerHeader>

            <DrawerBody className="flex flex-col gap-[20px]">
              <NavLink
                className={"nav-links drawer-link flex flex-row "}
                to={"/"}
                smooth="true"
                onClick={() => {
                  onClose();
                }}
              >
                Home
                <RiAccountCircleFill
                  className="text-[#d4d4d4] text-2xl mb-2 cursor-pointer ml-auto"
                  onClick={handleAccountIconClick}
                />
              </NavLink>
              <NavLink
                className={"nav-links drawer-link"}
                to={"/about"}
                smooth="true"
                onClick={() => {
                  onClose();
                }}
              >
                About
              </NavLink>
              <NavLink
                className={"nav-links drawer-link"}
                to={"/contact"}
                smooth="true"
                onClick={() => {
                  onClose();
                }}
              >
                Services
              </NavLink>
              <NavLink
                className={"nav-links drawer-link"}
                to={"/services"}
                smooth="true"
                onClick={() => {
                  onClose();
                }}
              >
                Contact us
              </NavLink>
              <NavLink
                className={"nav-links drawer-link"}
                to={"/blogs"}
                smooth="true"
                onClick={() => {
                  onClose();
                }}
              >
                Blogs
              </NavLink>
              <NavLink
                className={"nav-links drawer-link"}
                to={"/gallery"}
                smooth="true"
                onClick={() => {
                  onClose();
                }}
              >
                Gallery & Media
              </NavLink>
            </DrawerBody>

            <DrawerFooter className="block ">
              <Text color={"#d4d4d4"} fontSize={".8rem"} textAlign={"center"}>
                &copy;2024 masterlycaterers.All rights reserved.
              </Text>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Flex>

      <Modal isOpen={isLoginOpen} onClose={onLoginClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="bg-black"></ModalHeader>
          <ModalCloseButton className="text-[#FFD700]" />
          <ModalBody className="bg-black">
            <Login />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Navbar;

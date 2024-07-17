import React from "react";
import { NavLink } from "react-router-dom";
import "../../src/App.css";
import { CgMenuRightAlt } from "react-icons/cg";
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
} from "@chakra-ui/react";
const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const buttonRef = React.useRef();
  return (
    <div className="text-black-600   flex justify-between items-center bg-[#111] w-[100%] font-semibold py-[20px] overflow-hidden pr-[10px]">
      <Text className="bg-slate-100 h-[30px] px-3">Logo</Text>
      <nav className="sm:gap-[12px] hidden md:flex md:gap-[30px] pr-[10px] ml-auto">
        <NavLink className="nav-links" to={"/"}>
          Home
        </NavLink>
        <NavLink className="nav-links" to={"/About"}>
          About
        </NavLink>
        <NavLink className="nav-links" to={"/Services"}>
          Services
        </NavLink>
        <NavLink className="nav-links" to={"/Contact"}>
          Contact us
        </NavLink>
        <NavLink className="nav-links" to={"/AppGallery"}>
          Gallery & Media
        </NavLink>
      </nav>

      <Flex className="flex md:hidden  pr-[4px]">
        <Box
          className="cursor-pointer rounded-s-lg "
          ref={buttonRef}
          onClick={onOpen}
        >
          <CgMenuRightAlt className="bg-[#fff8ac] rounded-md text-3xl md:hidden " />
        </Box>
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={buttonRef}
        >
          <DrawerOverlay />
          <DrawerContent bg={"#111"}>
            <DrawerCloseButton color={"#FFD700"} className="text-3xl" />
            <DrawerHeader></DrawerHeader>

            <DrawerBody className="flex flex-col gap-[20px]">
              <NavLink
                className={"nav-links drawer-link"}
                to={"/"}
                smooth="true"
                onClick={() => {
                  onClose();
                }}
              >
                Home
              </NavLink>
              <NavLink
                className={"nav-links drawer-link"}
                to={"/About"}
                smooth="true"
                onClick={() => {
                  onClose();
                }}
              >
                About
              </NavLink>
              <NavLink
                className={"nav-links drawer-link"}
                to={"/Contact"}
                smooth="true"
                onClick={() => {
                  onClose();
                }}
              >
                Services
              </NavLink>
              <NavLink
                className={"nav-links drawer-link"}
                to={"/Services"}
                smooth="true"
                onClick={() => {
                  onClose();
                }}
              >
                Contact us
              </NavLink>
              <NavLink
                className={"nav-links drawer-link"}
                to={"/AppGallery"}
                smooth="true"
                onClick={() => {
                  onClose();
                }}
              >
                Gallery & Media
              </NavLink>
            </DrawerBody>
            <DrawerFooter>
              <Text color={"#d4d4d4"} fontSize={".8rem"} textAlign={"center"}>
                &copy;2024 masterlycaterers.All rights reserved.
              </Text>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Flex>
    </div>
  );
};

export default Navbar;

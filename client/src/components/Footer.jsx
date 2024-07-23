import { Text } from "@chakra-ui/react";
import React from "react";
import { FaInstagram } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[400px] mx-3 mb-2 bg-black">
      <div className="flex flex-col md:grid md:grid-cols-3 md:my-[50px] w-full gap-[100px] md:mx-8 mx-3 my-[60px]">
        <Text className="text-grey font-bold text-6xl flex flex-col items-center">
          Naran
          <span className="text-gold text-xl flex justify-center">Jackson</span>
        </Text>
        <div className="flex flex-col md:mt-4 w-full md:w-[400px]">
          <Text className="text-xl font-semibold text-grey uppercase flex justify-center md:justify-start">
            Contact
          </Text>
          <Text className="text-lg capitalize text-grey font-semibold justify-center md:justify-start flex flex-wrap md:flex-nowrap">
            general inquiries:
            <span className="text-grey lowercase font-semibold ml-1">
              naranjackson@gmail.com
            </span>
          </Text>
          <Text className="text-lg capitalize text-grey font-semibold justify-center md:justify-start flex flex-wrap md:flex-nowrap mt-2">
            telephone number:
            <span className="text-grey lowercase font-semibold ml-1">
              +2547 7202 479 80
            </span>
          </Text>
          <div className="mt-8 md:mt-6 flex flex-col justify-center items-center md:items-start md:justify-start">
            <Text className="uppercase font-semibold text-lg text-grey">
              socials
            </Text>
            <div className="flex flex-row gap-2 mt-2 text-white cursor-pointer text-2xl">
              <a
                href="https://www.instagram.com/naranjackson/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/naran.jackson"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://x.com/home"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaSquareXTwitter />
              </a>
              <a
                href="https://www.linkedin.com/feed/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col text-grey text-xs font-semibold capitalize mt-6 items-center md:items-start">
          <Link to={"/about"}>
            <Text>about</Text>
          </Link>
          <Link to={"/services"}>
            <Text>services</Text>
          </Link>
          <Link to={"/contact"}>
            <Text>contact us</Text>
          </Link>
          <Link to={"/blogs"}>
            <Text>blogs</Text>
          </Link>
          <Link to={"/gallery"}>
            <Text>gallery & media</Text>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;

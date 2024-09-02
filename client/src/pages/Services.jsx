import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import useBookingForm from "../utils/useBookingForm";
import QuoteForm from "../components/QuoteForm";
import { useSelector } from "react-redux";
import { selectUserData } from "../features/auth/Authslice";

function Services() {
  useEffect(() => {
    AOS.init({
      duration: 200,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const user = useSelector(selectUserData);
    // console.log(user.id)
  const { input, isLoading, handleChange, handleSubmit } = useBookingForm(
    {
      user_id: user.id,
      event_date: "",
      event_type: "",
      guest_count: "",
      special_requests: "",
    },
    toast,
    user
  );

  return (
    <div className="h-auto w-full ">
      <div className="mx-3 my-2 bg-black font-libre ">
        <img
          src="/services.jpeg"
          alt="services photo"
          className="object-cover h-auto md:h-[500px] object-center w-full relative"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 my-16">
          <div
            className="border-y-4 w-fit hover:border-gold rounded-md border-gray-600 p-2"
            data-aos="zoom-in"
          >
            <Image
              width={500}
              height={500}
              objectFit={"cover"}
              src="/upishi.jpeg"
              alt="booking"
            />
          </div>
          <div data-aos="fade-right">
            <h1 className="text-slate-200 font-semibold text-xl py-2">
              My Services
            </h1>
            <h1 className="lg:text-3xl text-slate-200  text-2xl">
              <span className="text-gold">Passionate,</span> Meticulous & <br />
              Experienced
              <span className="font-medium text-gold"> Chef</span>
            </h1>
            <Text className="lg:text-xl text-slate-200  py-2">
              Looking to elevate your next event with exceptional culinary
              experiences? Our team of professional chefs specializes in
              crafting personalized menus tailored to your unique tastes and
              dietary preferences. Whether it’s an intimate dinner party, a
              corporate event, or a grand celebration, we are committed to
              delivering unforgettable flavors and impeccable service. Please
              provide us with the details of your event, including the number of
              guests, preferred cuisine, and any special requests, and we'll
              promptly prepare a customized quote to suit your needs.
            </Text>
            <div className="flex items-center justify-center my-3">
              <button className="w-[150px] p-2 text-center bg-gold rounded-md animate-bounce">
                Request Quote
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 my-16 mx-3">
          <div
            data-aos="fade-right"
            className="flex items-center justify-center w-fit flex-col order-2 lg:order-1"
          >
            <Text className="lg:text-xl text-slate-200  py-2 ">
              Transform your next gathering into a culinary journey with our
              exceptional catering service. Our team of creative and skillful
              chefs brings passion and innovation to every dish, ensuring that
              each bite is a memorable experience. Whether you're hosting a
              small, intimate dinner or a large celebration, we offer
              customizable menus that cater to your specific tastes and dietary
              needs. From meticulously crafted appetizers to exquisite desserts,
              our attention to detail and dedication to quality will impress
              your guests and make your event unforgettable. Contact us today to
              book your culinary experience and let us take care of the rest!
            </Text>
            <div className="flex items-center justify-center my-3">
              <button
                className="w-[150px] p-2 text-center bg-gold rounded-md animate-bounce"
                onClick={onOpen}
              >
                Make a Booking
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
                    <QuoteForm
                      input={input}
                      handleChange={handleChange}
                      handleSubmit={handleSubmit}
                      isLoading={isLoading}
                      onClose={onClose}
                    />
                  </ModalBody>
                  <ModalFooter />
                </ModalContent>
              </Modal>
            </div>
          </div>
          <div
            className="border-y-4 w-fit hover:border-gold rounded-md border-gray-600 p-2 order-1 lg:order-2 my-4 "
            data-aos="zoom-in"
          >
            <Image
              width={500}
              height={500}
              objectFit={"cover"}
              src="/meda.jpeg"
              alt="booking"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;

import {Text } from "@chakra-ui/react";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Parallax, Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Home = () => {
  const swiperOptions = {
    effect: "cube",
    direction: "horizontal",
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    cubeEffect: {
      slideShadows: true,
    },
  };

  const slides = [
    {
      image: "/hero.jpeg",
    },
    {
      image: "/asian.jpeg",
    },
    {
      image: "/curry.jpeg",
    },
    {
      image: "/Curryvegan.jpeg",
    },
    {
      image: "/fries.jpeg",
    },
    {
      image: "/shrimp.jpeg",
    },
  ];
  return (
    <div className="h-full w-full">
      <div className="flex flex-row h-[400px] mx-3 my-2 bg-black">
        <div className="flex flex-col my-[120px] mx-8 space-y-5 space-x-2">
          <Text className="text-xl font-semibold text-grey">
            Always Chasing Flavours
          </Text>
          <Text className="text-6xl font-bold text-gold">
            Chef Naran Jackson
          </Text>
        </div>
        <Swiper
          style={{
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
          }}
          speed={4000}
          parallax={true}
          pagination={{
            clickable: true,
          }}
          navigation={false}
          {...swiperOptions}
          modules={[Parallax, Pagination, Navigation, Autoplay]}
          className="w-[600px] my-3 rounded-lg"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <img
                className="object-contain    w-[600px]"
                src={slide.image}
                alt="hero"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Home;

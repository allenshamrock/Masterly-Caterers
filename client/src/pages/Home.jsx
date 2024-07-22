import { Text } from "@chakra-ui/react";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Parallax, Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

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
    { image: "/hero.jpeg" },
    { image: "/asian.jpeg" },
    { image: "/curry.jpeg" },
    { image: "/Curryvegan.jpeg" },
    { image: "/fries.jpeg" },
    { image: "/shrimp.jpeg" },
  ];

  const profiles = [
    {
      image: "/about2.jpeg",
      text: "About Me",
      header: "About",
    },
    {
      image: "/recipe.jpeg",
      text: "Get inspired",
      header: "Recipes",
    },
    {
      image: "/gallery.jpeg",
      text: "Gallery",
      header: "Gallery & Media",
    },
    {
      image: "/blog.jpeg",
      text: "Blogs",
      header: "Books",
    },
    {
      image: "/fries.jpeg",
      text: "Quote",
      header: "Budget",
    },
    {
      image: "/shrimp.jpeg",
      header: "Follow Me",
      socials: [
        { instagram: "instagram", linkedin: "linkedin", facebook: "facebook" },
      ],
    },
  ];

  return (
    <div className="h-full w-full">
      <div className="flex flex-col md:flex-row h:auto md:h-[400px] mx-3 my-2 bg-black">
        <div className="flex flex-col md:my-[120px] md:mx-8 mx-3 my-2 space-y-5">
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
          pagination={{ clickable: true }}
          navigation={false}
          {...swiperOptions}
          modules={[Parallax, Pagination, Navigation, Autoplay]}
          className="w-full md:w-[600px] my-3 rounded-lg"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <img
                className="object-contain w-[600px]"
                src={slide.image}
                alt="hero"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="relative flex flex-col md:grid md:grid-cols-3 gap-0 mx-3 my-3">
        {profiles.map((profile, index) => (
          <div key={index} className="relative group">
            <img
              src={profile.image}
              alt={profile.text}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold opacity-100 transition-opacity duration-300 group-hover:opacity-0">
              <Text>{profile.header}</Text>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {profile.socials ? (
                <div className="flex gap-4">
                  {profile.socials[0].instagram && (
                    <button className="rounded-md  bg-gold p-1 w-[100px] no-underline">
                      <Link
                        href={`https://instagram.com/${profile.socials[0].instagram}`}
                      >
                        <Text className="text-black text-sm font-bold">
                          Instagram
                        </Text>
                      </Link>
                    </button>
                  )}
                  {profile.socials[0].linkedin && (
                    <button className="rounded-md  bg-gold p-1 w-[100px] no-underline">
                      <Link
                        href={`https://linkedin.com/in/${profile.socials[0].linkedin}`}
                      >
                        <Text className="text-black text-sm font-bold">
                          LinkedIn
                        </Text>
                      </Link>
                    </button>
                  )}
                  {profile.socials[0].facebook && (
                    <button className="rounded-md bg-gold p-1 w-[100px]">
                      <Link
                        href={`https://facebook.com/${profile.socials[0].facebook}`}
                      >
                        <Text className="text-black text-sm font-bold">
                          Facebook
                        </Text>
                      </Link>
                    </button>
                  )}
                </div>
              ) : (
                <button className="rounded-md bg-gold p-1 w-[100px]">
                  <Text className="text-black text-sm font-bold">
                    {profile.text}
                  </Text>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

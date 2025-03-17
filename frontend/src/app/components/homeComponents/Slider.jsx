"use client";
import React from "react";
import Image from "next/image"; // Import Next.js Image component
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FullWidthSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  const slides = [
    {
      src: "/images/MAIN.jpg",
      text: "Welcome to Our Amazing Site!",
      blurDataURL: "/images/MAIN.jpg",
    },
    {
      src: "/images/MAIN.jpg",
      text: "Explore Our Latest Features",
      blurDataURL: "/images/MAIN.jpg",
    },
    {
      src: "/images/OIP (5).jpg",
      text: "Join Our Community Today",
      blurDataURL: "/images/OIP (5).jpg",
    },
  ];

  return (
    <div className="w-full">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative w-full h-[500px]">
            <div className="image-container">
            <Image
    src={slide.src}
    alt={`Slide ${index + 1}`}
    layout="fill" // Ensures image fills the container
    objectFit="cover" // Ensures image covers the container without distortion
    quality={100}
    priority
    placeholder="blur"
    blurDataURL={slide.blurDataURL}
  />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-black bg-opacity-50">
              <h2 className="text-4xl font-bold mb-4">{slide.text}</h2>
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition">
                Click Me
              </button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FullWidthSlider;

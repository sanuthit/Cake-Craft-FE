import React from "react";

const AboutUs = () => {
  return (
    <div
      className="w-full h-screen bg-cover bg-center text-white flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url('https://images5.alphacoders.com/105/1056724.jpg')`,
      }}
    >
      <div className="bg-black bg-opacity-50 p-10 rounded-xl max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to CakeCraft</h1>
        <p className="text-lg">
        CakeCraft is the ultimate platform for aspiring bakers, home cooks, and cake enthusiasts who want to master the art of cake-making but need motivation and resources. Designed for cake lovers, CakeCraft offers a vibrant social media space to share, learn, and grow together.

Whether you’re into baking classic sponges, crafting intricate fondant designs, or experimenting with innovative flavors, CakeCraft transforms your cake-making journey into an inspiring and rewarding experience. Join a community of professional bakers and cake artists who share recipes, tutorials, and real-time tips, and showcase your creations through posts, videos, and stunning images.

CakeCraft makes it easy to connect and collaborate. Like, comment, and follow your favorite bakers, while tailored notifications keep you motivated. Behind the scenes, React.js and Java Spring Boot power a seamless, reliable platform that prioritizes your privacy and security.

CakeCraft is more than a platform it’s a movement. It’s where cake-making skills are shared, connections are made, and baking becomes a way of life. Whether you’re here to teach, learn, or simply be inspired, CakeCraft is your partner in unlocking your cake-making potential.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;

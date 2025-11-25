import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../userContext';
import LoadingTruck from '../Components/Loader';
import { getUserById } from '../Services/userServices';

const Welcome = () => {
  const [isRotated, setIsRotated] = useState(false);
  const [isSlidedArm, setIsArmSlided] = useState(false);
  const [isSlidedBracelet, setIsBraceletSlided] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const { user,setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);


  


  useEffect(() => {
    const rotateTimer = setTimeout(() => setIsRotated(true), 1000);
    const slideArmTimer = setTimeout(() => setIsArmSlided(true), 2000);
    const slideBraceletTimer = setTimeout(() => setIsBraceletSlided(true), 3000);
    const contentTimer = setTimeout(() => setIsContentVisible(true), 4000);

    return () => {
      clearTimeout(rotateTimer);
      clearTimeout(slideArmTimer);
      clearTimeout(slideBraceletTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("welcomeassets/background.webp")',
          filter: 'brightness(0.6)',
          zIndex: -1
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4">
        <div
          className={`
            transition-transform duration-1000 ease-in-out origin-top
            ${isRotated ? 'rotate-0' : 'rotate-180'}
          `}
        >
          <img
            src="download.webp"
            alt="Welcome sign"
            className="w-72 h-auto"
          />
        </div>
      </div>

      <div className="absolute sm:top-[20%] top-[15%] left-[36%] transform -translate-x-1/2 flex items-center justify-center">
        <div
          className={`
            transition-transform duration-1000 ease-in-out
            ${isSlidedArm ? 'translate-x-0' : '-translate-x-[100vw]'}
            z-10
          `}
        >
          <img
            src="welcomeassets/arm.webp"
            alt="Arm"
            className="w-[480px] h-auto max-w-none"
          />
        </div>

        <div
          className={`
            transition-transform duration-1000 ease-in-out
            ${isSlidedBracelet ? 'translate-x-[-150%] scale-[45%]' : 'translate-x-[100vw] scale-[750%]'}
            z-20 ml-[-75px]
          `}
        >
          <img
            src="welcomeassets/bracelet.webp"
            alt="Bracelet"
            className="w-32 h-auto max-w-none"
          />
        </div>
      </div>

      <div
        className={`relative pt-[60vh] mt-[20vh] pb-16 px-4 transition-opacity duration-1000 ${isContentVisible ? 'opacity-100' : 'opacity-0'
          }`}
      >
        <div className="max-w-4xl mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-[#4A3C31] mb-4">
            Welcome <span className="text-[#1A9D8F]">{user?.full_name}</span> to Bracelet Tunisia
          </h1>
          <p className="text-lg text-[#4A3C31] mb-6">
            At Bracelet Tunisia, we believe in more than just selling products — we create experiences and build lasting relationships with our customers.
          </p>

          <h2 className="text-2xl font-semibold text-[#4A3C31] mb-4">Our Commitment to You</h2>
          <ul className="list-disc list-inside mb-6 text-[#4A3C31]">
            <li className="mb-2">
              <strong>Quality Assurance:</strong> Each item in our collection is carefully selected and thoroughly tested to ensure it meets our high standards of quality and style.
            </li>
            <li className="mb-2">
              <strong>Innovative Selection:</strong> We continuously update our inventory to bring you the latest trends and timeless classics, ensuring you always find something that matches your unique style.
            </li>
            <li>
              <strong>Seamless Shopping Experience:</strong> Enjoy a user-friendly interface, secure transactions, and fast delivery — because your comfort is our priority.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-[#4A3C31] mb-4">Our Promise</h2>
          <p className="text-lg text-[#4A3C31] mb-6">
            We’re not just here to sell — we’re here to exceed your expectations. From the moment you browse our collection to long after your purchase arrives at your doorstep, we’re dedicated to ensuring your complete satisfaction.
          </p>

          <p className="text-lg text-[#4A3C31] mb-4">
            Experience the Bracelet Tunisia difference today. Welcome to a world where style meets substance — where every purchase tells a story.
          </p>

          <p className="text-xl font-bold text-[#1A9D8F] italic">
            Bracelet Tunisia – Elevate Your Style, Enrich Your Life
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

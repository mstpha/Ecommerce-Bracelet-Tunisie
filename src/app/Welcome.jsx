import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../userContext';
import Loader from './Loader';

const Welcome = () => {
  const [isRotated, setIsRotated] = useState(false);
  const [isSlidedArm, setIsArmSlided] = useState(false);
  const [isSlidedBracelet, setIsBraceletSlided] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const { user } = useContext(UserContext);
  const [loading,setLoading]=useState(true)
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
if (loading){
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="transform scale-150 sm:scale-200 md:scale-300 lg:scale-400">
          <Loader/>
        </div>
      </div>
    )
  }
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

      <div className={`relative pt-[60vh] mt-[20vh] pb-16 px-4 transition-opacity duration-1000 ${isContentVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-4xl mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-[#4A3C31] mb-4">Bienvenue <span className='text-[#1A9D8F]'>{user?.fullName}</span> chez Bracelet Tunisie</h1>
          <p className="text-lg text-[#4A3C31] mb-6">Chez Bracelet Tunisie, nous croyons en plus que simplement vendre des produits – nous créons des expériences et construisons des relations durables avec nos clients.</p>
          
          <h2 className="text-2xl font-semibold text-[#4A3C31] mb-4">Notre Engagement envers Vous</h2>
          <ul className="list-disc list-inside mb-6 text-[#4A3C31]">
            <li className="mb-2"><strong>Assurance Qualité :</strong> Chaque article de notre collection est soigneusement sélectionné et rigoureusement testé pour garantir qu'il répond à nos normes élevées de qualité et de style.</li>
            <li className="mb-2"><strong>Sélection Innovante :</strong> Nous mettons constamment à jour notre inventaire pour vous apporter les dernières tendances et les classiques intemporels, vous assurant de toujours trouver quelque chose qui correspond à votre style unique.</li>
            <li><strong>Expérience d'Achat Fluide :</strong> Profitez d'une interface conviviale, de transactions sécurisées et d'une livraison rapide – car votre confort est notre priorité.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-[#4A3C31] mb-4">Notre Promesse</h2>
          <p className="text-lg text-[#4A3C31] mb-6">Nous ne sommes pas là simplement pour vendre – nous sommes là pour dépasser vos attentes. Du moment où vous parcourez notre collection jusqu'à longtemps après l'arrivée de votre achat à votre porte, nous nous consacrons à assurer votre entière satisfaction.</p>
          
          <p className="text-lg text-[#4A3C31] mb-4">Découvrez la différence Bracelet Tunisie aujourd'hui. Bienvenue dans un monde où le style rencontre la substance, et où chaque achat raconte une histoire.</p>
          
          <p className="text-xl font-bold text-[#1A9D8F] italic">Bracelet Tunisie – Élevez Votre Style, Enrichissez Votre Vie</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
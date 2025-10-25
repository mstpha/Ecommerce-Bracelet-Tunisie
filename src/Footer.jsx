import React from 'react';
import { Mail, Facebook, Instagram, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#4A3C31] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Contactez-nous</h3>
            <div className="flex items-center mb-2">
              <Mail size={20} className="mr-2" />
              <a 
                href="mailto:Bracelet.tunis@gmail.com" 
                className="hover:underline"
              >
                Bracelet.tunis@gmail.com
              </a>
            </div>
            <div className="flex items-center">
              <Phone size={20} className="mr-2" />
              <span>Téléphone: 28 679 989</span>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-xl font-bold mb-2">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a 

                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors duration-300"
              >
                <Facebook size={24} />
              </a>
              <a 

                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors duration-300"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Bracelet Tunisie. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
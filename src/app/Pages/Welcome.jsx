import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { homeStructuredData } from '../Data/seoData';
import { homeSeo } from '../Data/seoPages';

const Welcome = () => {
  return (
    <>
      <Seo
        {...homeSeo}
        jsonLd={homeStructuredData()}
      />
      <section className="relative isolate flex-grow overflow-hidden bg-[#F5F2E9] px-4 py-10 sm:py-16">
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div
            className="home-background-pan absolute inset-0"
            style={{ backgroundImage: "url('/background.webp')" }}
          />
          <div className="absolute inset-0 bg-[#F5F2E9]/55" />
        </div>
        <section className="mx-auto max-w-4xl rounded-lg bg-white/90 p-8 shadow-lg sm:p-10">
          <h1 className="mb-4 text-3xl font-bold text-[#4A3C31]">
            Bracelets, bagues et accessoires en Tunisie
          </h1>
          <p className="mb-6 text-lg text-[#4A3C31]">
            Bienvenue chez Bracelet Tunisie.{' '}
            Découvrez une sélection de bracelets, colliers, casquettes, boucles d’oreilles et accessoires.
            Consultez les fiches et les images pour choisir les articles qui vous intéressent.
          </p>

          <h2 id="engagement" className="mb-4 text-2xl font-semibold text-[#4A3C31]">
            Une sélection à découvrir
          </h2>
          <p className="mb-6 text-lg text-[#4A3C31]">
            Chaque fiche présente le nom du produit, son prix et les informations disponibles au catalogue.
            Prenez le temps de parcourir les photos et les détails indiqués avant de préparer votre commande.
            Nous ne supposons pas de caractéristiques qui ne figurent pas sur la fiche.
          </p>

          <h2 id="livraison" className="mb-4 text-2xl font-semibold text-[#4A3C31]">
            Livraison et paiement
          </h2>
          <p className="mb-6 text-lg text-[#4A3C31]">
            La livraison est proposée dans toute la Tunisie. Le paiement s’effectue à la livraison et
            chaque commande est confirmée par téléphone.
          </p>

          <div className="mb-8 flex flex-wrap gap-4">
            <Link
              to="/boutique"
              className="inline-flex rounded-lg bg-[#1A9D8F] px-6 py-3 font-semibold text-white hover:bg-[#157A6E]"
            >
              Découvrir la boutique
            </Link>
            <Link to="/boutique/categorie/bracelets" className="px-3 py-3 text-[#4A3C31] underline">
              Bracelets
            </Link>
            <Link to="/boutique/categorie/colliers" className="px-3 py-3 text-[#4A3C31] underline">
              Colliers
            </Link>
            <Link to="/boutique/categorie/casquettes" className="px-3 py-3 text-[#4A3C31] underline">
              Casquettes
            </Link>
            <Link to="/boutique/categorie/boucles-d-oreilles" className="px-3 py-3 text-[#4A3C31] underline">
              Boucles d’oreilles
            </Link>
          </div>

          <p className="text-xl font-bold italic text-[#1A9D8F]">
            Bracelet Tunisie — découvrez votre prochaine sélection
          </p>
        </section>
      </section>
    </>
  );
};

export default Welcome;

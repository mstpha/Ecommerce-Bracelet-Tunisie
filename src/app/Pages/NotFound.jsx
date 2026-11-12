import { Link, useLocation } from 'react-router-dom';
import Seo from '../../components/Seo';

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <section className="container mx-auto min-h-screen px-4 py-16">
      <Seo
        title="Page introuvable | Bracelet Tunisie"
        description="La page demandée n’est pas disponible. Parcourez la boutique Bracelet Tunisie et découvrez nos bracelets et accessoires avec livraison en Tunisie."
        path={pathname}
        noindex
      />
      <h1 className="mb-4 text-3xl font-bold text-[#4A3C31]">Page introuvable</h1>
      <p className="mb-8 text-[#4A3C31]">Cette adresse ne correspond à aucune page de notre boutique.</p>
      <Link to="/boutique" className="rounded-lg bg-[#1A9D8F] px-6 py-3 font-semibold text-white hover:bg-[#157A6E]">
        Découvrir la boutique
      </Link>
    </section>
  );
}

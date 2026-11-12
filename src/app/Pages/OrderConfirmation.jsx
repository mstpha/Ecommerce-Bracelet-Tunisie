import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';

export default function OrderConfirmation() {
  return (
    <section className="container mx-auto min-h-screen px-4 py-16">
      <Seo
        title="Commande reçue | Bracelet Tunisie"
        description="Votre commande est enregistrée. Notre équipe vous contactera par téléphone pour la confirmer avant la livraison dans toute la Tunisie. Paiement à la livraison."
        path="/commande/confirmation"
        noindex
      />
      <h1 className="mb-4 text-3xl font-bold text-[#4A3C31]">Votre demande a bien été reçue</h1>
      <p className="mb-8 text-lg text-[#4A3C31]">
        Notre équipe vous contactera par téléphone pour confirmer votre commande. Le paiement s’effectue à la livraison.
      </p>
      <Link to="/boutique" className="rounded-lg bg-[#1A9D8F] px-6 py-3 font-semibold text-white hover:bg-[#157A6E]">
        Retour à la boutique
      </Link>
    </section>
  );
}

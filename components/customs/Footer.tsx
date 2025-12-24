import { Ambulance, Github, Heart, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-700 bg-gray-900/50 backdrop-blur mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Ambulance className="h-6 w-6 text-red-500" />
              <span className="text-lg font-bold text-white">
                SUAP Exercices
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Simulateur de cas de secours à personne dédié à l'entrainement des
              sapeurs-pompiers.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-white font-semibold">Liens rapides</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                Accueil
              </Link>
              <Link
                href="/historique"
                className="text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                Historique
              </Link>
              <Link
                href="/premium"
                className="text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                Premium
              </Link>
            </nav>
          </div>
          <div className="space-y-3">
            <h3 className="text-white font-semibold">Contact</h3>
            <div className="flex flex-col gap-2">
              {/* <a
                href="mailto:contact@lokkidevelopment.com"
                className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-2"
              >
                <Mail size={16} />
                contact@lokkidevelopment.com
              </a> */}
              <a
                href="https://github.com/Lokki68"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-2"
              >
                <Github size={16} />
                GitHub
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} LokkiDevelopment. Tous droits réservés.
            </p>
            <p className="text-gray-500 text-sm">
              <span>Fait avec </span>
              <Heart size={14} className="text-red-500 inline mx-1" />
              <span>pour les sapeurs-pompiers</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

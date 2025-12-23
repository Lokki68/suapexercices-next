"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown } from "lucide-react";

export default function PremiumPage() {
  const handleSubscribe = async (plan: string) => {
    console.log("Souscription au plan: ", plan);
    alert("Intégration Stripe a venir ...");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Crown className="text-yellow-500" size={40} />
            <span>Passez en Premium</span>
          </h1>
          <p className="text-gray-400">
            Débloquez toutes les fonctionnalités pour vos formations
          </p>
        </header>

        {/* Gratuit */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-gray-300 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl">Gratuit</CardTitle>
              <p>
                0€{" "}
                <span className="text-lg font-normal text-gray-400">
                  {" "}
                  / mois
                </span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1 shrink-0" />
                  <span>5 générations par mois</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1 shrink-0" />
                  <span>Tous les types d'interventions</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" disabled>
                Plan actuel
              </Button>
            </CardContent>
          </Card>

          {/* Premium */}
          <Card className="bg-linear-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/50 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                Recommandé
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Crown className="text-yellow-500" />
                Premium
              </CardTitle>
              <p>
                9,99€{" "}
                <span className="text-lg font-normal text-gray-400">
                  {" "}
                  / mois
                </span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1 shrink-0" />
                  <span>Générations illimitées</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1 shrink-0" />
                  <span>Tous les types d'interventions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1 shrink-0" />
                  <span>Contrainte personnalisées</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1 shrink-0" />
                  <span>Historique de scénarios</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1 shrink-0" />
                  <span>Export PDF des scénarios</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1 shrink-0" />
                  <span>Support prioritaire</span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSubscribe("premium")}
              >
                <Crown className="mr-2" />
                Devenir Prémium
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

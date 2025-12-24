"use client";

import { UserStatus } from "@/types";
import { Crown, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function UsageIndicator() {
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/user/status");
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error("Erreur: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading || !status) {
    return null;
  }

  const percentage = (status.generationsUsed / status.maxGenerations) * 100;

  return (
    <Card className="bg-gray-800/60 backdrop-blur border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {status.isPremium ? (
            <>
              <Crown className="text-yellow-500" />
              <span className="text-yellow-500">Compte Premium</span>
            </>
          ) : (
            <>
              <Zap className="text-gray-400" />
              <span className="text-gray-400">Compte Gratuit</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300 mr-1">Générations utilisées</span>
            <span className="text-gray-100 font-semibold">
              {status.generationsUsed} /
              {status.isPremium ? "∞" : status.maxGenerations}
            </span>
          </div>
        </div>

        {!status.isPremium && (
          <>
            {status.remainingGenerations <= 1 && (
              <p className="text-yellow-500 text-sm">
                ⚠️ Plus que {status.remainingGenerations} génération restante !
              </p>
            )}
            <Button
              className="w-full bg-linear-to-r from-yellow-500  to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-black font-semibold"
              onClick={() => (window.location.href = "/premium")}
            >
              <Crown className="mr-2" />
              Passer en Premium
            </Button>
          </>
        )}

        {status.isPremium && status.premiumUntil && (
          <p className="text-sm text-gray-400">
            Premium jusqu'au{" "}
            {new Date(status.premiumUntil).toLocaleDateString("fr-FR")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

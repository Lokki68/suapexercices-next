"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SavedScenario, Scenario } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HistoriquePage() {
  const router = useRouter();
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScenarios = async () => {
    try {
      const response = await fetch("/api/scenarios/list");

      if (response.status === 403) {
        alert("Fonctionnalité premium uniquement");
        router.push("/premium");
        return;
      }

      if (!response.ok) throw new Error("Erreur de chargement des scénarios");

      const data = await response.json();
      setScenarios(data);
    } catch (error) {
      console.error("Erreur: ", error);
      alert("Erreur lors du chargement des scénarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/scenarios/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur de suppression");

      setScenarios((prevScenarios) =>
        prevScenarios.filter((scenario) => scenario.id !== id)
      );
      alert("Scénario supprimé !");
    } catch (error) {
      console.error("Erreur: ", error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleView = (id: string) => {
    router.push(`/scenarios/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-8">
        <p className="text-gray-300">Chargement ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <section className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Clock className="text-red-500" />
          Historique des scénarios
        </h1>
        <p className="text-gray-400">
          Retrouvez tous vos scénarios sauvegardés
        </p>
      </section>

      {scenarios.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="py-12 text-center">
            <p className="text-gray-400 mb-4">
              Aucun scénario sauvegardé pour le moment
            </p>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => router.push("/")}
            >
              Générer un scénario
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh - 200px)]">
          <div className="space-y-4">
            {scenarios.map((saved) => (
              <Card
                key={saved.id}
                className="bg-gray-800/60 backdrop-blur border-gray-700 hover:border-gray-500/50 transition-colors"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-red-400">
                        {saved.title || `Scénario ${saved.type}`}
                      </CardTitle>
                      <p className="text-sm text-gray-400 mt-1">
                        {format(
                          new Date(saved.createdAt),
                          "dd MMMM yyyy à HH:mm",
                          { locale: fr }
                        )}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Type: {saved.type}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="bg-gray-700 border-gray-600"
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(saved.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(saved.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {saved.scenario.situation}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

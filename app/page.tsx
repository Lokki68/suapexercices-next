"use client";

import ErrorDisplay from "@/components/customs/ErrorDisplay";
import ScenarioActions from "@/components/customs/ScenarioActions";
import ScenarioDisplay from "@/components/customs/ScenarioDisplay";
import UsageIndicator from "@/components/customs/UsageIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useScenarioGenerator from "@/hooks/useScenarioGenerator";
import { UserStatus } from "@/types";
import { UserButton } from "@clerk/nextjs";
import { Ambulance, Info, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface InterventionType {
  value: string;
  label: string;
}

const interventionTypes: InterventionType[] = [
  { value: "malaise", label: "🧍‍♂️ Malaise" },
  { value: "traumatisme", label: "🤕 Traumatisme" },
  { value: "inconscience", label: "💤 Inconscience" },
  { value: "hemoragie", label: "🩸 Hémoragie" },
  { value: "detresse_respiratoire", label: "😮‍💨 Détresse respiratoire" },
  { value: "arret_cario_respiratoire", label: "❤️‍🔥 Arrêt Cardio Respiratoire" },
];

function InterventionSelectItems({ value, label }: InterventionType) {
  return <SelectItem value={value}>{label}</SelectItem>;
}

export default function Home() {
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [type, setType] = useState<string>("malaise");
  const [contraintes, setContraintes] = useState<string>("");
  const { scenario, loading, error, generateScenario } = useScenarioGenerator();

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/user/status");
      const data = await response.json();
      setUserStatus(data);
    } catch (error) {
      console.error("Erreur: ", error);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleGenerate = () => {
    generateScenario(type, contraintes);
  };

  return (
    <div className=" flex flex-col items-center p-8">
      <div className="max-w-5xl w-full space-y-8">
        <section className="text-center">
          <h1 className="flex items-center justify-center gap-2 text-4xl font-bold tracking-tight text-red-500 mb-2">
            <span>
              <Ambulance />
            </span>
            Générateur d'intervention
          </h1>
          <p>
            Simulateur de cas de secours à personne - dédié aux entraînement
            pompiers
          </p>
        </section>

        <section className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col md:flex-row items-start justify-center gap-4">
            <div className="w-[250px]">
              <Label className="text-gray-300">Type d'intervention</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 mt-1">
                  <SelectValue placeholder="Choisir un type d'intervention" />
                </SelectTrigger>
                <SelectContent>
                  {interventionTypes.map((intervention) => (
                    <InterventionSelectItems
                      key={intervention.value}
                      value={intervention.value}
                      label={intervention.label}
                    />
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[250px]">
              <Label className="text-gray-300">Contraintes particulières</Label>
              <Textarea
                className="bg-gray-800 gray-700 text-gray-100 mt-1"
                value={contraintes}
                onChange={(e) => setContraintes(e.target.value)}
                placeholder="Ex: environnement dangereux, présence d'animaux, etc."
              />
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-lg px-6 py-5 my-4"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Génération en cours ...
              </>
            ) : (
              "🧩 Générer une intervention"
            )}
          </Button>
        </section>

        {error && <ErrorDisplay error={error} />}

        {scenario && <ScenarioDisplay scenario={scenario} />}

        {scenario && (
          <ScenarioActions
            scenario={scenario}
            type={type}
            contraintes={contraintes}
            isPremium={userStatus?.isPremium || false}
            savedScenarioId={""}
            onSaved={() => console.log("Sauvergardé ")}
            onDeleted={() => console.log("Effacer ")}
          />
        )}
      </div>

      {!scenario && (
        <Card className="bg-gray-800/60 backdrop-blur border-gray-700 mt-auto">
          <CardContent>
            <p className="text-gray-300 flex gap-2 text-sm items-center">
              <span>
                <Info size={16} />
              </span>
              Séléctionner un type d'intervention, ajouter des contraintes
              particulières si besoin.
              <br />
              Cliquer sur générer une intervention
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { Scenario } from "@/types";
import { useState } from "react";

interface UseScenarioGeneratorResult {
  scenario: Scenario | null;
  loading: boolean;
  error: string | null;
  generateScenario: (
    typeIntervention: string,
    contrainte?: string
  ) => Promise<void>;
}

export default function useScenarioGenerator(): UseScenarioGeneratorResult {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateScenario = async (
    typeIntervention: string,
    contrainte?: string
  ) => {
    setLoading(true);
    setError(null);

    const prompt = `
    Tu es un formateur en secourisme du SDIS68.
    Crée un cas pratique d'entraînement pour des pompiers intervenant sur une situation de secours à personne.
    ${
      typeIntervention
        ? `Le type d'intervention est : ${typeIntervention}.`
        : ""
    }

    ${
      contrainte
        ? `Containtes particulières a prendre en compte : ${contrainte}`
        : ""
    }

    Fournis :
    - Une description réaliste (lieu, contexte, heure, etc.)
    - Un bilan initial : conscience (AVPU), FC, FR, TA, SpO2, température.
    - Une évolution des constantes sur 3 étapes (5, 10, 15 min).
    - Un objectif pédagogique clair.

    Réponds au format JSON suivant :
    {
      "situation": "Description complète du contexte d’intervention",
      "bilan_initial": {
        "conscience": "Alerte",
        "fc": 90,
        "fr": 18,
        "ta": "120/70",
        "spo2": "97%",
        "temp": "36.8°C"
      },
      "evolution": [
        {"minute": 5, "description": "La victime commence à transpirer...", "fc": 100, "spo2": "95%"},
        {"minute": 10, "description": "La victime devient confuse...", "fc": 110, "spo2": "92%"},
        {"minute": 15, "description": "La victime perd connaissance...", "fc": 120, "spo2": "89%"}
      ],
      "objectif_pedagogique": "Reconnaître et gérer un malaise hypoglycémique"
    }
    `;

    try {
      const response = await fetch("/api/generate-scenario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, temperature: 0.9 }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content?.trim();

      if (!content) throw new Error("Réponse invalide du serveur.");

      let parsedScenario: Scenario;

      try {
        parsedScenario = JSON.parse(content);
      } catch {
        const match = content.match(/\{[\s\S]*\}/);
        if (match) parsedScenario = JSON.parse(match[0]);
        else throw new Error("Impossible d'analyser la réponse du serveur.");
      }

      setScenario(parsedScenario);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue lors de la génération du scénario.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { scenario, loading, error, generateScenario };
}

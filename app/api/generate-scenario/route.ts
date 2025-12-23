import { checkUserLimit, incrementUserUsage } from "@/lib/userLimits";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const limitCheck = await checkUserLimit();

    if (!limitCheck.canGenerate) {
      return NextResponse.json(
        {
          error: "limite atteinte",
          message: limitCheck.isPremium
            ? "Vous avez atteint votre limite mensuelle"
            : `Limite gratuite atteinte (${limitCheck.maxGenerations} générations / mois ). Passez en Premium pour plus de générations!`,
          isPremium: limitCheck.isPremium,
          generationsUsed: limitCheck.generationsUsed,
          maxGenerations: limitCheck.maxGenerations,
        },
        { status: 429 }
      );
    }

    const { prompt, temperature = 0.9 } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Aucun prompt fourni" },
        { status: 400 }
      );
    }

    console.log(
      `Génération pour l'utilisateur : ${userId} (${limitCheck.remainingGenerations} restantes)`
    );

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: temperature,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur Groq:", errorText);

      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Scénario généré");

    const newUsage = await incrementUserUsage();
    console.log(
      `Utilisateur ${userId} utilisé ${newUsage} / ${limitCheck.maxGenerations}`
    );

    return NextResponse.json({
      ...data,
      userUsage: {
        generationsUsed: newUsage,
        maxGenerations: limitCheck.maxGenerations,
        isPremium: limitCheck.isPremium,
        remainingGenerations: limitCheck.maxGenerations - newUsage,
      },
    });
  } catch (err) {
    console.error("Erreur : ", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Erreur serveur interne",
      },
      { status: 500 }
    );
  }
}

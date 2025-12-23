import { saveScenario } from "@/lib/db/scenarios";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Utilisateur introuvable" },
      { status: 404 }
    );
  }

  const metadata = user?.publicMetadata;

  if (!metadata.isPremium) {
    return NextResponse.json(
      { error: "Fonctionnalité Premium uniquement" },
      { status: 400 }
    );
  }

  try {
    const { scenario, type, contraintes, title } = await request.json();

    if (!scenario) {
      return NextResponse.json({ error: "Scénario requis" }, { status: 400 });
    }

    const saved = await saveScenario(
      userId,
      scenario,
      type,
      contraintes,
      title
    );

    return NextResponse.json(saved);
  } catch (error) {
    console.error("Erreur suvegarde :", error);
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde" },
      { status: 500 }
    );
  }
}

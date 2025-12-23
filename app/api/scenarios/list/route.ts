import { getUserScenarios } from "@/lib/db/scenarios";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
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
    const scenarios = await getUserScenarios(userId);
    return NextResponse.json(scenarios);
  } catch (error) {
    console.error("Erreur récupération :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

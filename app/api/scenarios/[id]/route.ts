import { deleteScenario, getScenarioById } from "@/lib/db/scenarios";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const scenario = await getScenarioById(params.id, userId);

    if (!scenario) {
      return NextResponse.json(
        { error: "Scénario introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(scenario);
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const deleted = await deleteScenario(params.id, userId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Scénario introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

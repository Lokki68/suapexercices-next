import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Non Authentifié" }, { status: 401 });
  }

  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Utilisateur introuvable" },
      { status: 404 }
    );
  }

  const metadata = user.publicMetadata;

  const isPremium = metadata?.isPremium || false;
  const generationsUsed = metadata?.generationsUsed || 0;
  const maxGenerations = metadata?.isPremium ? 999999 : 5;

  return NextResponse.json({
    isPremium,
    generationsUsed,
    maxGenerations,
    remainingGenerations: maxGenerations - generationsUsed,
    premiumUntil: metadata?.premiumUntil,
  });
}

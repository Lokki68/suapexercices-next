import { UserMetadata } from "@/types";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

export const FREE_LIMITS = 5;
export const PREMIUM_LIMITS = 999999;

export async function checkUserLimit() {
  const client = await clerkClient();
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Non authentifié");
  }

  const user = await currentUser();

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  const metadata = user.publicMetadata;

  const isPremium = metadata?.isPremium || false;
  const generationsUsed = metadata?.generationsUsed || 0;
  const maxGenerations = isPremium ? PREMIUM_LIMITS : FREE_LIMITS;

  if (isPremium && metadata.premiumUntil) {
    const expirationDate = new Date(metadata.premiumUntil);
    if (expirationDate < new Date()) {
      await client.users.updateUser(userId, {
        publicMetadata: {
          ...metadata,
          isPremium: false,
        },
      });

      return {
        canGenerate: generationsUsed < FREE_LIMITS,
        generationsUsed,
        maxGenerations: FREE_LIMITS,
        isPremium: false,
      };
    }
  }

  const canGenerate = generationsUsed < maxGenerations;

  return {
    canGenerate,
    generationsUsed,
    maxGenerations,
    isPremium,
    remainingGenerations: maxGenerations - generationsUsed,
  };
}

export async function incrementUserUsage() {
  const client = await clerkClient();
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Non authentifié");
  }

  const user = await currentUser();

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }
  const metadata = user.publicMetadata;
  const generationsUsed = (metadata?.generationsUsed || 0) + 1;

  await client.users.updateUser(userId, {
    publicMetadata: {
      ...metadata,
      generationsUsed,
    },
  });

  return generationsUsed;
}

export async function resetMonthlyUsage(userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const metadata = user.publicMetadata;

  await client.users.updateUser(userId, {
    publicMetadata: {
      ...metadata,
      generationsUsed: 0,
    },
  });
}

export async function upgradeToPremium(userId: string, months: number = 1) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const metadata = user.publicMetadata;

  const premiumUntil = new Date();
  premiumUntil.setMonth(premiumUntil.getMonth() + months);

  await client.users.updateUser(userId, {
    publicMetadata: {
      ...metadata,
      isPremium: true,
      premiumUntil: premiumUntil.toISOString(),
      generationsUsed: 0,
    },
  });
}

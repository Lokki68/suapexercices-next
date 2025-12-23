import "@clerk/nextjs/server";

declare module "@clerk/nextjs/server" {
  interface UserPublicMetadata {
    isPremium?: boolean;
    generationsUsed?: number;
    maxGenerations?: number;
  }
}

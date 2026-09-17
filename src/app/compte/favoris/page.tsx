import { getAllStages } from "@/lib/stages";
import { FavoritesClient } from "@/components/account/favorites-client";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const allStages = await getAllStages();
  return <FavoritesClient allStages={allStages} />;
}

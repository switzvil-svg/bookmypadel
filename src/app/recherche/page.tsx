import { Metadata } from "next";
import { StickySearch } from "@/components/search/sticky-search";
import { SearchExperience } from "@/components/search/search-experience";
import { getAllStages } from "@/lib/stages";

export const metadata: Metadata = { title: "Résultats de recherche" };
export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { ville?: string; niveau?: string; date?: string };
}) {
  const stages = await getAllStages();
  return (
    <div>
      <StickySearch />
      <SearchExperience
        initialCity={searchParams.ville}
        initialLevel={searchParams.niveau}
        allStages={stages}
      />
    </div>
  );
}

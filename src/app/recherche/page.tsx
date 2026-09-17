import { Metadata } from "next";
import { StickySearch } from "@/components/search/sticky-search";
import { SearchExperience } from "@/components/search/search-experience";
import { stages } from "@/data/stages";

export const metadata: Metadata = { title: "Résultats de recherche" };

export default function SearchPage({
  searchParams,
}: {
  searchParams: { ville?: string; niveau?: string; date?: string };
}) {
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

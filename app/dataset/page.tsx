import { getSiteData } from "@/lib/site-data";
import { DatasetApp } from "./dataset-shell";

type DatasetPageProps = {
  searchParams?: Promise<{
    mode?: string | string[];
  }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DatasetPage({ searchParams }: DatasetPageProps) {
  const data = getSiteData();
  const params = await searchParams;
  const mode = firstParam(params?.mode);
  const initialViewMode = mode === "simple" || mode === "guided" ? mode : "full";
  const initialViewModeFromUrl = mode === "simple" || mode === "guided" || mode === "full";

  return (
    <DatasetApp
      data={data}
      initialViewMode={initialViewMode}
      initialViewModeFromUrl={initialViewModeFromUrl}
    />
  );
}

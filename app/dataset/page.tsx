import { getSiteData } from "@/lib/site-data";
import { DatasetApp } from "./dataset-shell";

export default function DatasetPage() {
  const data = getSiteData();
  return <DatasetApp data={data} />;
}

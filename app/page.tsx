import { getSiteData } from "@/lib/site-data";
import { ExplorerApp } from "./site-shell";

export default function HomePage() {
  const data = getSiteData();
  return <ExplorerApp data={data} />;
}

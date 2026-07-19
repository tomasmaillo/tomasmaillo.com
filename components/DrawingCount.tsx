import { unstable_cache } from "next/cache";

import { supabase } from "@/lib/supabase";

const getApprovedDrawingCount = unstable_cache(
  async () => {
    const { count, error } = await supabase
      .from("drawings")
      .select("id", { count: "exact", head: true })
      .eq("is_flagged", false)
      .eq("reviewed", true);

    if (error) throw error;

    return count ?? 0;
  },
  ["approved-drawing-count"],
  { revalidate: 900 },
);

export async function DrawingCount() {
  try {
    const count = await getApprovedDrawingCount();

    return (
      <span className="font-medium tabular-nums bg-card text-card-foreground px-1 py-1 rounded-md">
        {count.toLocaleString("en-GB")}
      </span>
    );
  } catch (error) {
    console.error("Error fetching the drawing count:", error);

    return (
      <span className="font-medium tabular-nums bg-card text-card-foreground px-1 py-1 rounded-md">
        78
      </span>
    );
  }
}

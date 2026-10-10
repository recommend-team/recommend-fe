import { servedAreaFor } from "@/lib/serviceAreas";

describe("servedAreaFor", () => {
  it.each([
    ["Admiralty Way", "Admiralty Way"],
    ["admiralty", "Admiralty Way"],
    ["No 12, Admiralty Way, Lekki", "Lekki"],
    ["Lekki Phase 1", "Lekki"],
    ["osapa", "Osapa London"],
    ["12 Osapa estate", "Osapa London"],
    ["Jakande", "Ikate & Jakande"],
    ["ikate and jakande", "Ikate & Jakande"],
  ])("serves %s", (typed, area) => {
    expect(servedAreaFor(typed)).toBe(area);
  });

  it.each(["Yaba", "Ikeja GRA", "Victoria Island", "way", "street", "ab", ""])(
    "does not claim %s",
    (typed) => {
      expect(servedAreaFor(typed)).toBeNull();
    }
  );
});

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** The home-screen icon on iPhones and iPads: the logo mark on the brand amber. */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const mark = await readFile(join(process.cwd(), "public", "logo-mark.svg"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFDC",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- not a page; Satori needs <img> */}
        <img src={`data:image/svg+xml;base64,${mark.toString("base64")}`} alt="" width={86} height={120} />
      </div>
    ),
    size
  );
}

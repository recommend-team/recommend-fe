import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * The card image shown when a link to the site is shared (WhatsApp, Instagram, X, LinkedIn).
 * Built at deploy time from the real logo and font, so it never drifts from the site.
 * Every page uses it unless a page adds its own opengraph-image.
 */

export const alt = "Recommend — anything you need, from vendors near you";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const AMBER = "#FFFFDC";
const GREEN = "#006837";
const ORANGE = "#EF5A22";

async function publicFile(path: string) {
  return readFile(join(process.cwd(), "public", path));
}

export default async function OpenGraphImage() {
  // Satori, which draws this, reads .woff but not .woff2.
  const [champ, logo] = await Promise.all([publicFile("fonts/Champ-Black.woff"), publicFile("logo-full.svg")]);
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: AMBER,
          borderBottom: `24px solid ${GREEN}`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- not a page; Satori needs <img> */}
        <img src={logoSrc} alt="" width={340} height={76} />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontFamily: "Champ",
            fontSize: 92,
            lineHeight: 1,
            color: "#1A1A1A",
            maxWidth: 980,
          }}
        >
          Anything you need, from&nbsp;
          <span style={{ color: ORANGE }}>vendors near you.</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 32, color: "#3d4451" }}>
          <div
            style={{
              display: "flex",
              padding: "10px 26px",
              borderRadius: 999,
              background: GREEN,
              color: "white",
              fontWeight: 700,
            }}
          >
            Lagos
          </div>
          Order by chatting · getrecommend.co
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Champ", data: champ, weight: 900, style: "normal" }] }
  );
}

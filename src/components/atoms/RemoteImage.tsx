import Image from "next/image";
import { OPTIMISED_IMAGE_HOSTS } from "@/lib/imageHosts";

/**
 * An image whose URL came out of the database.
 *
 * `next/image` **throws** on a host missing from `images.remotePatterns` — not a broken
 * thumbnail, a runtime error that takes the whole page down. Every product image, vendor
 * logo and banner is a URL a vendor supplied, so one bad row could stop an admin from
 * opening that vendor at all. That is too much blast radius for a picture.
 *
 * So: `next/image` and its optimisation for hosts we know, a plain `<img>` for anything
 * else. An unexpected host then costs an unoptimised image rather than the page.
 *
 * Use it for anything read from the API. Bundled assets under `/public` should keep using
 * `next/image` directly — their paths are known at build time and cannot surprise anyone.
 */
export function RemoteImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (isOptimisable(src)) {
    return fill ? (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
    ) : (
      <Image
        src={src}
        alt={alt}
        width={width ?? 0}
        height={height ?? 0}
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? "eager" : "lazy"}
      // `fill` on next/image means "cover the nearest positioned ancestor", so the
      // fallback has to reproduce that rather than collapse to intrinsic size.
      className={fill ? `absolute inset-0 h-full w-full ${className}` : className}
    />
  );
}

/** Local paths are always fine; remote ones must be on the shared allowlist. */
function isOptimisable(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    return (OPTIMISED_IMAGE_HOSTS as readonly string[]).includes(
      new URL(src).hostname,
    );
  } catch {
    // Not a parseable URL. `next/image` would throw on it; the fallback simply shows a
    // broken image, which is the failure the user can actually recover from.
    return false;
  }
}

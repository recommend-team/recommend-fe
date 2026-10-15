"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";


const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const COOKIE_SCRIPT_ID = process.env.NEXT_PUBLIC_COOKIE_SCRIPT_ID;


const UNTRACKED = ["/admin", "/reset-password", "/rider/signup/verify"];

export const isUntracked = (pathname: string) =>
  UNTRACKED.some((path) => pathname === path || pathname.startsWith(`${path}/`));

/**
 * One script, so the order is guaranteed: the consent defaults must exist before
 * Cookie-Script restores a returning visitor's choice, and both before any tag in GTM reads
 * them. `wait_for_update` holds the first hit briefly for that restore.
 */
export function bootstrap(gtmId: string | undefined, cookieScriptId: string | undefined) {
  let code = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
`;
  if (cookieScriptId) {
    code += `
(function(d){var c=d.createElement('script');c.charset='UTF-8';
c.src='https://cdn.cookie-script.com/s/'+${JSON.stringify(cookieScriptId)}+'.js';
d.head.appendChild(c);})(document);
`;
  }
  if (gtmId) {
    code += `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});
`;
  }
  return code;
}

export default function Analytics() {
  const pathname = usePathname() ?? "/";
  const untracked = isUntracked(pathname);


  useEffect(() => {
    if (!GA_ID) return;
    (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = untracked;
  }, [untracked]);

  if (untracked || (!GTM_ID && !COOKIE_SCRIPT_ID)) return null;

  return (
    <Script id="consent-and-analytics" strategy="afterInteractive">
      {bootstrap(GTM_ID, COOKIE_SCRIPT_ID)}
    </Script>
  );
}


export const CUSTOMER_APP_URL = process.env.NEXT_PUBLIC_CUSTOMER_APP_URL ?? '';

if (!CUSTOMER_APP_URL && process.env.NODE_ENV === 'production') {
  // Visible in the build log, where whoever is deploying will see it.
  console.warn(
    'NEXT_PUBLIC_CUSTOMER_APP_URL is not set — the "Start Ordering" buttons will render disabled.',
  );
}

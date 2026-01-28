const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    'NEXT_PUBLIC_API_URL is not defined. Please check your .env.local file.'
  );
}

export const API_BASE_URL = apiUrl;

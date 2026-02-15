import { createThirdwebClient } from 'thirdweb';

const CLIENT_ID = import.meta.env.VITE_PUBLIC_CLIENT_ID;

if (!CLIENT_ID) {
  throw new Error('Missing VITE_PUBLIC_CLIENT_ID environment variable');
}

export const client = createThirdwebClient({
  clientId: CLIENT_ID,
});

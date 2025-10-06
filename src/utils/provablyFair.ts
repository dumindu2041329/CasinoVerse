// Simple hash function for provably fair gaming
export const generateHash = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

export const generateClientSeed = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const generateServerSeed = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const generateRandomNumber = (
  clientSeed: string,
  serverSeed: string,
  nonce: number,
  min: number = 0,
  max: number = 100
): number => {
  const combined = `${clientSeed}-${serverSeed}-${nonce}`;
  const hash = generateHash(combined);
  const hashNum = parseInt(hash, 16);
  return min + (hashNum % (max - min + 1));
};

export const generateRandomFloat = (
  clientSeed: string,
  serverSeed: string,
  nonce: number
): number => {
  const combined = `${clientSeed}-${serverSeed}-${nonce}`;
  const hash = generateHash(combined);
  const hashNum = parseInt(hash, 16);
  return (hashNum % 10000) / 10000;
};

export const verifyResult = (
  clientSeed: string,
  serverSeed: string,
  nonce: number,
  expectedHash: string
): boolean => {
  const combined = `${clientSeed}-${serverSeed}-${nonce}`;
  const hash = generateHash(combined);
  return hash === expectedHash;
};

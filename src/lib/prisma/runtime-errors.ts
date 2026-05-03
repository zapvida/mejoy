export function getRuntimeErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

const DATASTORE_UNAVAILABLE_PATTERNS = [
  'denied access',
  "can't reach database",
  'prismaclientinitializationerror',
  'unable to require(',
  'the prisma engines do not seem to be compatible with your system',
  'code signature',
  'different team ids',
  'e_cannot_resolve_version',
  'p1000',
  'p1001',
  'p1010',
];

export function isDataStoreUnavailable(err: unknown): boolean {
  const msg = getRuntimeErrorMessage(err).toLowerCase();
  return DATASTORE_UNAVAILABLE_PATTERNS.some((pattern) => msg.includes(pattern));
}

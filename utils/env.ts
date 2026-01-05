// This utility helps to fail-fast in case an env variable is missing. 
// For example, EZRA_BASE_URL is missing then rather than undefined, the log should show
// missing env variable :  EZRA_BASE_URL etc. Also, it enforces, secure practices like credentials must be part of env variables
export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}


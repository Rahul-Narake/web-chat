// utils/auth.ts
export function getToken(name: string): string | null {
  const token = localStorage.getItem(name);
  if (token && token.length > 0) {
    return token;
  }
  return null;
}

export function isAuthenticated(): boolean {
  return getToken('token') !== null;
}

const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;

export function getCookieSession(key: string) {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${key}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1] ?? "") : null;
}

export function setCookieSession(key: string, value: string) {
  document.cookie = `${key}=${encodeURIComponent(value)}; max-age=${sessionMaxAgeSeconds}; path=/; SameSite=Lax`;
}

export function clearCookieSession(key: string) {
  document.cookie = `${key}=; max-age=0; path=/; SameSite=Lax`;
}

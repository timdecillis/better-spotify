// src/auth/token.ts
export function getAccessToken() {
  return localStorage.getItem("access_token");
}

// You can implement refresh logic if needed later

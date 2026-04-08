// src/core/api/authClient.js

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

export async function authFetch(
  url,
  { method = "GET", headers = {}, body, signal } = {}
) {

  const requestHeaders = {
    ...DEFAULT_HEADERS,
    ...(headers || {}),
  };

  const res = await fetch(url, {
    method,
    headers: requestHeaders,
    body,
    signal,
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {

    const error = new Error(
      data?.message || `Request failed (${res.status})`
    );

    error.code = data?.code || "AUTH_ERROR";
    error.status = res.status;
    error.url = url;

    throw error;
  }

  return data;
}
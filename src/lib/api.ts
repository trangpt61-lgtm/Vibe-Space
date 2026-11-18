const TOKEN_KEY = 'vibespace_session_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore storage restriction
  }
}

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers['x-vibe-token'] = token;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = 'Đã xảy ra lỗi khi kết nối máy chủ.';
    try {
      const errData = (await res.json()) as { error?: string };
      if (errData.error) message = errData.error;
    } catch {
      // ignore json parse error
    }
    throw new Error(message);
  }

  return (await res.json()) as T;
}

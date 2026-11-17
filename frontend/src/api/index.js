const API_BASE = "/api";

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && path !== "/auth/refresh") {
    const refreshed = await authApi.refresh();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      const retry = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        credentials: "include",
      });
      if (!retry.ok) throw new ApiError(retry.status, await retry.json());
      return retry.json();
    }
    throw new ApiError(401, { message: "Session expired" });
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Unknown error" }));
    throw new ApiError(res.status, body);
  }

  if (res.status === 204) return null;
  return res.json();
}

export class ApiError extends Error {
  constructor(status, body) {
    super(body.message || "Request failed");
    this.status = status;
    this.body = body;
  }
}

// ============================================================
// AUTH — POST /api/auth/*
// Refresh token приходит в HttpOnly cookie (Set-Cookie)
// Access token приходит в JSON body
// ============================================================

export const authApi = {
  // POST /api/auth/register
  // Body: { email, password, name }
  // Response: { accessToken, user: { id, email, name } }
  // + Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict; Path=/api/auth/refresh
  async register(email, password, name) {
    const data = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
    setAccessToken(data.accessToken);
    return data.user;
  },

  // POST /api/auth/login
  // Body: { email, password }
  // Response: { accessToken, user: { id, email, name } }
  // + Set-Cookie: refreshToken=...
  async login(email, password) {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(data.accessToken);
    return data.user;
  },

  // POST /api/auth/logout
  // Cookie: refreshToken (отправится автоматически)
  // Response: 204
  // + Clear-Cookie: refreshToken
  async logout() {
    await request("/auth/logout", { method: "POST" });
    setAccessToken(null);
  },

  // POST /api/auth/refresh
  // Cookie: refreshToken (отправится автоматически)
  // Response: { accessToken }
  // + Set-Cookie: новый refreshToken (ротация)
  async refresh() {
    try {
      const data = await request("/auth/refresh", { method: "POST" });
      setAccessToken(data.accessToken);
      return true;
    } catch {
      setAccessToken(null);
      return false;
    }
  },
};

// ============================================================
// USERS — GET /api/users/*
// Header: Authorization: Bearer <accessToken>
// ============================================================

export const usersApi = {
  // GET /api/users/me
  // Response: { id, email, name, createdAt }
  async me() {
    return request("/users/me");
  },
};

// ============================================================
// TASKS — /api/tasks/*
// Header: Authorization: Bearer <accessToken>
// Каждая задача привязана к текущему пользователю (user_id из токена)
// ============================================================

export const tasksApi = {
  // GET /api/tasks
  // Query: ?status=todo|in_progress|done (опционально)
  // Response: { tasks: [{ id, title, description, status, priority, createdAt, updatedAt }] }
  async getAll(status) {
    const query = status ? `?status=${status}` : "";
    return request(`/tasks${query}`);
  },

  // POST /api/tasks
  // Body: { title, description?, status?, priority? }
  // status по умолчанию: "todo"
  // priority: "low" | "medium" | "high", по умолчанию "medium"
  // Response: { task: { id, title, description, status, priority, createdAt, updatedAt } }
  async create(task) {
    return request("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
  },

  // PATCH /api/tasks/:id
  // Body: { title?, description?, status?, priority? }
  // Response: { task: { id, title, description, status, priority, createdAt, updatedAt } }
  async update(id, updates) {
    return request(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  // DELETE /api/tasks/:id
  // Response: 204
  async remove(id) {
    return request(`/tasks/${id}`, { method: "DELETE" });
  },
};

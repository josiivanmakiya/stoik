const BASE = "http://localhost:3002/v1"

export async function register({ firstName, lastName, email, password }) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName: `${firstName} ${lastName}`, email, password })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.details ? data.details.map(d => d.message).join(". ") : data.error || "Registration failed")
  return data
}

export async function login({ email, password }) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Login failed")
  return data
}

export function saveSession(token, user) {
  localStorage.setItem("stoik_token", token)
  localStorage.setItem("stoik_user", JSON.stringify(user))
}

export function getSession() {
  const token = localStorage.getItem("stoik_token")
  const user  = localStorage.getItem("stoik_user")
  if (!token || !user) return null
  return { token, user: JSON.parse(user) }
}

export function clearSession() {
  localStorage.removeItem("stoik_token")
  localStorage.removeItem("stoik_user")
}

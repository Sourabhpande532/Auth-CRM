export const url =
  "http://localhost:4000/api" || "https://auth-crm-indol.vercel.app/api";

// export async function fetchJSON(path, opts = {}) {
//   const token = localStorage.getItem("adminToken");
//   const res = await fetch(url + path, {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//     ...opts,
//   });
//   if (!res.ok) {
//     const error = await res.json().catch(() => ({ error: res.statusText }));
//     throw error;
//   }
//   return res.json();
// }

export async function fetchJSON(path, opts = {}, token) {
  const res = await fetch(url + path, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    ...opts,
  });
  if (res.status === 401) {
    localStorage.removeItem("adminToken");
    window.location.href = "/login";
    return;
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw error;
  }
  return res.json();
}
// export const url =
//   process.env.NODE_ENV === "production"
//     (?) "https://auth-crm-indol.vercel.app/api"
//     : "http://localhost:4000/api";

export function getApiOrigin() {
  const apiUrl = import.meta.env.VITE_API_URL || '/'
  // 使用 window.location.origin 作为相对路径的基准
  return new URL(apiUrl, window.location.origin).origin.replace(/\/$/, '')
}

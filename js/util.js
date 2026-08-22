export const PI = Math.PI;

export function clamp(n, a, b) {
  return Math.min(b, Math.max(a, n));
}

export function rnd(n, d) {
  const p = 10 ** d;
  return Math.round(n * p) / p;
}

export function $id(id) {
  return document.getElementById(id);
}

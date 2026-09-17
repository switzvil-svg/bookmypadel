// Split out from session.ts so the Edge middleware (which can't bundle
// node:crypto, pulled in transitively by db.ts) can read the cookie name
// without importing the DB layer.
export const SESSION_COOKIE = "bmp_session";
export const ADMIN_COOKIE = "bmp_admin";

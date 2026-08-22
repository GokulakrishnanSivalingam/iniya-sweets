const crypto = require("crypto");

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

function createAdminToken() {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000 })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function isValidPassword(password) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !password) return false;
  const actualBuffer = Buffer.from(String(password));
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

function isValidUsername(username) {
  const expected = process.env.ADMIN_USERNAME || "admin";
  return typeof username === "string" && username.trim() === expected;
}

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token || !getSecret()) {
    return res.status(401).json({ message: "Admin authentication required" });
  }

  const [payload, signature] = token.split(".");
  let claims;
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return res.status(401).json({ message: "Invalid admin session" });
  }

  const expectedSignature = sign(payload || "");
  const validSignature =
    signature &&
    signature.length === expectedSignature.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

  if (!validSignature || !claims.exp || claims.exp < Date.now()) {
    return res.status(401).json({ message: "Admin session expired" });
  }
  next();
}

module.exports = { createAdminToken, isValidPassword, isValidUsername, requireAdmin };

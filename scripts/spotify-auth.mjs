#!/usr/bin/env node
/**
 * One-time helper, run on your own computer: logs in to Spotify and prints a refresh token
 * for the GitHub Actions job that updates src/content/hobbies/music-stats.json.
 *
 * 1. In your Spotify developer app (developer.spotify.com/dashboard), add this Redirect URI exactly:
 *      http://127.0.0.1:8888/callback
 * 2. Run:  node scripts/spotify-auth.mjs
 *    It asks for the app's Client ID and Client Secret, then opens a Spotify login page.
 * 3. Click "Agree". The refresh token is printed in this terminal.
 * 4. Add three repository secrets on GitHub (Settings -> Secrets and variables -> Actions):
 *      SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
 *
 * The only permission requested is "user-top-read" (your top artists and tracks).
 * Revoke it any time at spotify.com/account/apps. Needs Node.js 18 or newer; no npm install.
 */
import http from "node:http";
import crypto from "node:crypto";
import { execFile } from "node:child_process";
import readline from "node:readline/promises";

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPE = "user-top-read";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const clientId = process.env.SPOTIFY_CLIENT_ID || (await rl.question("Spotify Client ID: ")).trim();
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || (await rl.question("Spotify Client Secret: ")).trim();
rl.close();
if (!clientId || !clientSecret) {
  console.error("Both the Client ID and Client Secret are needed (on your app's page in the Spotify developer dashboard).");
  process.exit(1);
}

const state = crypto.randomBytes(16).toString("hex");
const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({ response_type: "code", client_id: clientId, scope: SCOPE, redirect_uri: REDIRECT_URI, state });

const page = (title, body) =>
  `<!doctype html><meta charset="utf-8"><title>${title}</title>` +
  `<body style="font-family:system-ui;max-width:560px;margin:60px auto;line-height:1.5"><h2>${title}</h2><p>${body}</p>`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== "/callback") return res.writeHead(404).end();

  const fail = (msg) => {
    res.writeHead(400, { "content-type": "text/html" }).end(page("Something went wrong", msg));
    console.error(`\n${msg}`);
    server.close();
    process.exitCode = 1;
  };
  if (url.searchParams.get("error")) return fail(`Spotify returned: ${url.searchParams.get("error")}`);
  if (url.searchParams.get("state") !== state) return fail("The login response didn't match this request. Run the script again.");

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code: url.searchParams.get("code") ?? "", redirect_uri: REDIRECT_URI }),
  });
  const data = await tokenRes.json().catch(() => ({}));
  if (!tokenRes.ok || !data.refresh_token) {
    return fail(`Token exchange failed (${tokenRes.status}): ${data.error_description || data.error || "no refresh token returned"}. Check the Client Secret.`);
  }

  res.writeHead(200, { "content-type": "text/html" }).end(page("Done", "You can close this tab and go back to the terminal."));
  console.log("\nSuccess. Add these as GitHub repository secrets (Settings -> Secrets and variables -> Actions):\n");
  console.log(`  SPOTIFY_CLIENT_ID      ${clientId}`);
  console.log("  SPOTIFY_CLIENT_SECRET  (the secret you just entered)");
  console.log(`  SPOTIFY_REFRESH_TOKEN  ${data.refresh_token}\n`);
  console.log("Keep the refresh token private: paste it only into GitHub, not into chats or commits.");
  server.close();
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`\nOpen this link to log in to Spotify (trying to open it for you):\n\n  ${authUrl}\n`);
  const opener = process.platform === "darwin" ? "open" : process.platform === "win32" ? "explorer" : "xdg-open";
  execFile(opener, [authUrl], () => {});
});
server.on("error", (e) => {
  console.error(e.code === "EADDRINUSE" ? `Port ${PORT} is busy. Close whatever is using it and run again.` : e.message);
  process.exit(1);
});

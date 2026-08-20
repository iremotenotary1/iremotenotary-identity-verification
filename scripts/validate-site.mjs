import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const errors = [];

function read(relPath) {
  return readFileSync(join(ROOT, relPath), "utf8");
}

function fail(id, message) {
  errors.push({ id, message });
}

const REQUIRED_FILES = [
  "index.html",
  "privacy.html",
  "contact.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "favicon.svg",
  "styles.css",
  "netlify.toml",
  "readme.md",
  "scripts/validate-site.mjs",
];

for (const file of REQUIRED_FILES) {
  if (!existsSync(join(ROOT, file))) {
    fail("missing-file", `Required file missing: ${file}`);
  }
}

const index = read("index.html");
const privacy = read("privacy.html");
const readme = read("readme.md");
const repoText = [index, privacy, readme, read("contact.html"), read("robots.txt"), read("sitemap.xml")].join("\n");

const APPROVED_IFRAME_SRC =
  "https://feedwalls.online/app/titles_thumbnail.php?groupID=95969448&displayItems=15&skin=list&accent=%231a73e8&dark=auto&radius=8";
const APPROVED_IFRAME_SRC_HTML = APPROVED_IFRAME_SRC.replace(/&/g, "&amp;");

if (!index.includes("groupID=95969448")) {
  fail("feedwalls-group", "index.html must include FeedWalls groupID=95969448");
}

if (repoText.includes("95969452")) {
  fail("protected-group", "Protected FeedWalls group 95969452 must not appear in site files");
}

if (!/widget[^0-9]*153/i.test(readme) || !/widget[^0-9]*153/i.test(index)) {
  fail("feedwalls-widget", "Widget 153 must be documented in readme.md and index.html comment");
}

if (!index.includes(APPROVED_IFRAME_SRC_HTML)) {
  fail("iframe-src", `index.html iframe src must match approved configuration:\n${APPROVED_IFRAME_SRC}`);
}

if (/skin=card|compact=0/.test(index)) {
  fail("iframe-params", "index.html iframe must not use deprecated skin=card or compact=0 parameters");
}

if (!index.includes('href="https://www.iremotenotary.com/')) {
  fail("main-site-host", "index.html must link to https://www.iremotenotary.com/");
}

if (!index.includes("utm_campaign=identity_verification_center")) {
  fail("utm-campaign", "index.html must preserve utm_campaign=identity_verification_center tagging");
}

if (/localhost|127\.0\.0\.1|vercel\.app|netlify\.app\/deploy-preview|branch-deploy/i.test(repoText)) {
  fail("preview-urls", "Repository must not contain localhost or preview deployment URLs in public copy");
}

const staleFeedPublisherPatterns = [
  /Curated resources from iRemoteNotary, NIST, and the FTC/i,
  /from iRemoteNotary and authoritative organizations/i,
  /Inclusion does not imply endorsement by NIST, the FTC/i,
  /Links on this site may direct you to iRemoteNotary, NIST, the FTC/i,
];

for (const pattern of staleFeedPublisherPatterns) {
  if (pattern.test(repoText)) {
    fail("stale-publisher-attribution", `Stale feed publisher attribution matched: ${pattern}`);
  }
}

const requiredAttribution = [
  "Florida Department of State",
  "Florida Senate",
];
for (const phrase of requiredAttribution) {
  if (!index.includes(phrase)) {
    fail("source-attribution", `index.html must describe current sources including "${phrase}"`);
  }
}

if (!index.includes('href="/privacy"') || !index.includes('href="/contact"')) {
  fail("nav-links", "index.html homepage nav/footer must use /privacy and /contact");
}

if (index.includes('href="/privacy.html"') || index.includes('href="/contact.html"')) {
  fail("nav-links-html", "index.html homepage nav/footer must not use .html internal links");
}

if (!index.includes("feedwalls:height")) {
  fail("iframe-resize", "index.html must preserve FeedWalls resize listener");
}

if (!index.includes("https://feedwalls.online") || !index.includes("https://www.feedwalls.online")) {
  fail("iframe-origins", "index.html must preserve allowed FeedWalls origins");
}

if (errors.length) {
  console.error("Site validation failed:");
  for (const error of errors) {
    console.error(`- [${error.id}] ${error.message}`);
  }
  process.exit(1);
}

console.log("Site validation passed.");
console.log(`FeedWalls group: 95969448`);
console.log(`FeedWalls widget: 153`);
console.log(`Approved iframe: ${APPROVED_IFRAME_SRC}`);

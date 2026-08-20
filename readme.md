# iRemoteNotary Netlify Identity & Verification Center

Recommended site name: `iremotenotary-identity-verification`

Production property: `https://iremotenotary-identity-verification.netlify.app/`

Expected canonical URL: `https://iremotenotary-identity-verification.netlify.app/`

## FeedWalls configuration

- FeedWalls group: `95969448`
- Widget: `153`
- UTM campaign: `identity_verification_center`
- UTM medium: `feedwall`
- UTM source: `netlify`

Approved iframe embed (do not change group, widget assignment, or dashboard settings here):

```html
<iframe
  id="feedwalls-widget"
  src="https://feedwalls.online/app/titles_thumbnail.php?groupID=95969448&displayItems=15&skin=list&accent=%231a73e8&dark=auto&radius=8"
  title="Online Notary Identity and Verification Resources"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
  style="border:0;width:99%;height:400px"></iframe>
```

## Deploy to the existing Netlify property

1. Confirm you are deploying to the existing production site `iremotenotary-identity-verification` at `https://iremotenotary-identity-verification.netlify.app/`.
2. Do not create a new Netlify site or link a different repository unless explicitly instructed.
3. Run `node scripts/validate-site.mjs` and fix any failures before deploying.
4. Netlify → Sites → open the existing `iremotenotary-identity-verification` site → Deploy manually or drag the deployment-ready folder into Netlify Drop for that same site.
5. After deploy, verify the site URL, FeedWalls widget load, iframe resize behavior, and homepage copy.

If Netlify assigns a different final URL, replace the canonical URL in `index.html`, `privacy.html`, `contact.html`, `robots.txt`, and `sitemap.xml`.

## Local validation

```bash
node scripts/validate-site.mjs
```

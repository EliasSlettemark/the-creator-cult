# TikTok App Review Checklist

This guide documents everything you need before resubmitting **The Creator Cult** to TikTok for Developers. Follow each section in order so reviewers can validate the Login Kit integration without friction.

---

## 1. Configuration In The TikTok Developer Portal

1. **Platform selection**
   - Keep only the platforms you already operate publicly. If the Android and iOS apps are not live in their stores, uncheck them and remove their configuration blocks before resubmitting.
   - Confirm the remaining Web/Desktop configuration points to `https://www.thecreatorcult.io`.

2. **Redirect URI**
   - Set the redirect URI to `https://thecreatorcult.io/api/auth/callback`.
   - Ensure the same value is stored in `TIKTOK_REDIRECT_URI` in production. No trailing slashes or additional path segments.

3. **Branding**
   - Upload the final production icon (1024 × 1024, PNG).
   - Verify the app name is “The Creator Cult” (no references to “TikTok” or other platform names).

4. **Scopes**
   - Leave only the scopes used in production:
     - `user.info.basic`
     - `user.info.profile`
     - `user.info.stats`
   - Remove any extra scopes such as `video.list` from the portal configuration. Code has already been aligned.

---

## 2. Copy Blocks For The Submission

### Public Description (120 char limit)
> The Creator Cult helps TikTok Shop sellers stay accountable through coaching, leaderboards, and creator analytics.

### App Review “Products & Scopes” Narrative
Paste the following into the review form (update bold TODO fields before submitting):

```
Overview
- Platform: Web (https://www.thecreatorcult.io)
- TikTok product: Login Kit
- Requested scopes: user.info.basic, user.info.profile, user.info.stats

User flow
1. Member logs into The Creator Cult dashboard (coaching community for TikTok Shop sellers).
2. “Add account” launches the TikTok Login Kit consent screen.
3. After approval, `/api/auth/callback` stores tokens in Supabase and immediately fetches display_name, avatar_url, and stats.
4. Dashboard renders creator identity cards, streak metrics, and the monthly leaderboard powered by TikTok data.
5. Members may disconnect at any time; we delete tokens and profile data instantly.

Scope usage
- user.info.basic → surfaces the member’s display name and avatar across dashboard widgets.
- user.info.profile → keeps profile deep links and bios in sync so members can collaborate.
- user.info.stats → feeds the leaderboard cards that visualize follower, like, and video counts.

Reviewer access
- Whop login email: **REPLACE_WITH_REVIEWER_EMAIL**
- Whop password: **REPLACE_WITH_TEMP_PASSWORD**
- TikTok sandbox account: **REPLACE_WITH_SANDBOX_EMAIL** / **PASSWORD**
```

---

## 3. Website Review Readiness

Complete these updates **before** recording the demo video:

| Requirement | Status |
| --- | --- |
| Home page clearly explains TikTok integration and data use | ✅ Implemented |
| Privacy policy (`/privacy-policy.pdf`) and Terms (`/tos.pdf`) linked in the footer | ✅ Visible |
| Dedicated support email displayed (`support@thecreatorcult.io`) | ✅ Added |
| Contact instructions for data deletion / revocation | ✅ Included |
| TikTok branding guidelines respected (no TikTok marks) | ✅ Confirmed |

---

## 4. Demo Video Script

Shoot a single continuous take (~2–3 minutes). Use the sandbox TikTok account.

1. Start at `https://www.thecreatorcult.io` and scroll to show the integration copy.
2. Log in with the demo Whop account.
3. On the dashboard, click **Add account**.
4. Walk through the TikTok consent screen, highlighting the scopes.
5. After redirect, narrate the dashboard cards that populate:
   - Avatar and display name (user.info.basic)
   - Profile link or bio (user.info.profile)
   - Leaderboard stats and streak data (user.info.stats)
6. Click **Remove** on the account to demonstrate revocation and explain token deletion.
7. End on the support contact / website footer.

Export as `mp4`, under 50 MB, and upload in the App Review form.

---

## 5. Supporting Materials To Attach

- **Demo credentials PDF** (Whop + TikTok sandbox credentials, support email).
- **This checklist** (optional but recommended).
- **Any additional screenshots** of the leaderboard and integration settings (PNG/JPG).

---

## 6. Submission Day Checklist

1. Double-check environment variables (`TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `TIKTOK_REDIRECT_URI`) in production.
2. Run through the flow on production to ensure OAuth succeeds.
3. Upload the refreshed demo video and supporting docs.
4. Submit the app for review.
5. Monitor the TikTok Developer Portal and the associated email inbox daily. Respond to reviewer questions immediately.

Once approved, keep the integration healthy:
- Rotate sandbox/demo passwords quarterly.
- Monitor the refresh-token cron job for failures.
- Update the marketing site if the feature set changes.

Good luck on the next submission! Feel free to extend this document with internal notes as the product evolves.


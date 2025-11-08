import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Inter } from "next/font/google";
import styles from "../styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

const IndexPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>The Creator Cult | TikTok Leadership Dashboard</title>
        <meta
          name="description"
          content="The Creator Cult uses TikTok Login Kit to authenticate members, sync profile statistics, and power a competitive creator leaderboard."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <header className={styles.hero}>
          <span className={styles.badge}>Built with TikTok Login Kit</span>
          <h1 className={styles.title}>
            Track TikTok Shop growth with a gamified creator leaderboard.
          </h1>
          <p className={styles.subtitle}>
            The Creator Cult helps sellers stay accountable to daily posting
            goals. Members authenticate with TikTok Login Kit, sync performance
            metrics, and compete on weekly and monthly leaderboards inside our
            private coaching community.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/auth" className={styles.primaryCta}>
              Launch dashboard
            </Link>
            <a href="#integration" className={styles.secondaryCta}>
              See integration details
            </a>
          </div>
          <div className={styles.heroCard}>
            <div>
              <h2 className={styles.heroCardTitle}>TikTok-powered experience</h2>
              <p className={styles.sectionLead}>
                After OAuth, we store the member&apos;s access token and sync
                TikTok profile data to personalize the dashboard and rank each
                creator against community peers.
              </p>
        </div>
            <ul className={styles.metricList}>
              <li className={styles.metricItem}>
                <strong>Profile identity</strong>
                <span>
                  `user.info.basic` provides display name and avatar used across
                  the dashboard UI.
                </span>
              </li>
              <li className={styles.metricItem}>
                <strong>Public profile links</strong>
                <span>
                  `user.info.profile` keeps bios and TikTok deep links current so
                  members can discover each other.
                </span>
              </li>
              <li className={styles.metricItem}>
                <strong>Performance stats</strong>
                <span>
                  `user.info.stats` delivers follower, like, and video counts
                  that feed the monthly leaderboard.
                </span>
              </li>
            </ul>
          </div>
        </header>

        <section id="integration" className={styles.section}>
          <h2 className={styles.sectionTitle}>How the TikTok connection works</h2>
          <p className={styles.sectionLead}>
            Reviewers can sign in with the demo Whop account, click “Add account,”
            and walk through TikTok Login Kit in our sandbox environment. The flow
            demonstrates every scope requested in production.
          </p>
          <div className={styles.cardGrid}>
            <article className={styles.card}>
              <h3>Login Kit entry point</h3>
              <p>
                The dashboard prompts members to connect TikTok when they join a
                growth challenge. The button simply calls `/api/oauth`, generates a
                CSRF-protected TikTok authorization URL, and redirects the user.
              </p>
            </article>
            <article className={styles.card}>
              <h3>Callback + storage</h3>
              <p>
                `/api/auth/callback` exchanges the code for access and refresh
                tokens, verifies the state parameter, and stores profile details in
                Supabase for the owning Creator Cult member record.
              </p>
            </article>
            <article className={styles.card}>
              <h3>Leaderboard sync</h3>
              <p>
                API cron jobs refresh stats nightly. The dashboard highlights
                follower growth, posting streaks, and view milestones to motivate
                members to stay consistent.
              </p>
            </article>
            <article className={styles.card}>
              <h3>Permission scope restraint</h3>
              <p>
                We only request the scopes required to render the dashboard. No
                posting, moderation, or messages are accessed.
              </p>
            </article>
        </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Member journey</h2>
          <ol className={styles.stepList}>
            <li className={styles.step}>
              <p className={styles.stepTitle}>Join the Creator Cult</p>
              <p className={styles.stepCopy}>
                Reviewers receive demo credentials to bypass the paywall. Once
                inside, click “Add account” on the dashboard.
              </p>
            </li>
            <li className={styles.step}>
              <p className={styles.stepTitle}>Authorize TikTok Login Kit</p>
              <p className={styles.stepCopy}>
                TikTok prompts for consent. We display the requested scopes and
                explain how they inform coaching metrics before returning to the
                dashboard.
              </p>
            </li>
            <li className={styles.step}>
              <p className={styles.stepTitle}>Review leaderboard placement</p>
              <p className={styles.stepCopy}>
                Stats populate cards such as “Total views,” “Videos posted,” and
                streak data. Members compare progress with the community and unlock
                resources tailored to their tier.
              </p>
            </li>
            <li className={styles.step}>
              <p className={styles.stepTitle}>Manage and revoke access</p>
              <p className={styles.stepCopy}>
                The “Remove” button immediately deletes tokens and profile data
                from Supabase, revoking Creator Cult access and honoring member
                data rights.
              </p>
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Data handling summary</h2>
          <div className={styles.dataGrid}>
            <article className={styles.card}>
              <h3>Stored data</h3>
              <p>
                We retain TikTok open IDs, display names, avatars, and aggregate
                performance metrics (follower, like, and video counts). No private
                messages or contact information is requested.
              </p>
            </article>
            <article className={styles.card}>
              <h3>Retention policy</h3>
              <p>
                Tokens refresh nightly and are deleted if a member disconnects or
                is inactive for 90 days. We purge personal data when a cancellation
                request is submitted to support.
              </p>
            </article>
            <article className={styles.card}>
              <h3>User controls</h3>
              <p>
                Members can revoke TikTok access anytime from the dashboard or by
                emailing{" "}
                <a href="mailto:support@thecreatorcult.io">
                  support@thecreatorcult.io
                </a>
                . We respond within two business days.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Resources for reviewers</h2>
          <div className={styles.cardGrid}>
            <article className={styles.card}>
              <h3>Demo credentials</h3>
              <p>
                Include the Whop login and TikTok sandbox account in your TikTok
                submission so reviewers can access the gated dashboard.
              </p>
            </article>
            <article className={styles.card}>
              <h3>Support contact</h3>
              <p>
                Need help during review? Email{" "}
                <a href="mailto:compliance@thecreatorcult.io">
                  compliance@thecreatorcult.io
                </a>{" "}
                for a same-day response.
              </p>
            </article>
            <article className={styles.card}>
              <h3>Documentation packet</h3>
              <p>
                We maintain a TikTok reviewer guide that explains each scope,
                integration video storyboard, and cron job schedule.
              </p>
            </article>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>© {new Date().getFullYear()} The Creator Cult. All rights reserved.</span>
          <div className={styles.footerLinks}>
            <a href="https://www.thecreatorcult.io/tos.pdf" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>
            <a
              href="https://www.thecreatorcult.io/privacy-policy.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
              Privacy Policy
            </a>
            <a href="mailto:support@thecreatorcult.io">Contact Support</a>
        </div>
        </footer>
      </main>
    </>
  );
};

export default IndexPage;

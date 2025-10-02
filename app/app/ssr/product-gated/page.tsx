import { NextAppPage } from "@/types/app-dir";
import styles from "../../../../styles/Home.module.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const Page: NextAppPage = async () => {
  return (
    <>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.description}>
            <a href="/app/ssr" className={styles.card} target="_blank" rel="noopener noreferrer">
              <span>&lt;-</span> Go back
            </a>
            <p>
              Edit this page inside of <code className={styles.code}>app/app/ssr/page.tsx</code>
            </p>
          </div>

          <div className={styles.center}>
            <div className={styles.otherbox}>
              <h1 className={inter.className}>Access Granted 🚀</h1>
              <p className={inter.className}>
                Demo mode is active. This page renders without product checks.
              </p>
            </div>
          </div>
          <div className={styles.grid} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <a href="#" className={styles.card}>
              <h2 className={inter.className}>Customer Portal &rarr;</h2>
              <p className={inter.className}>Manage your billing and access.</p>
            </a>

            <a href="#" className={styles.card}>
              <h2 className={inter.className}>Leave a review &rarr;</h2>
              <p className={inter.className}>If you like this web app, leave a review!</p>
            </a>
          </div>
        </main>
      </div>
    </>
  );
};

export default Page;

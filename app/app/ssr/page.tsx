import { NextAppPage } from "@/types/app-dir";
import { Inter } from "next/font/google";
import Link from "next/link";
import styles from "../../../styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

const Page: NextAppPage = async () => {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <a href="/" className={styles.card} target="_blank" rel="noopener noreferrer">
          <span>&lt;-</span> Go back
        </a>
        <p>
          Edit this page inside of <code className={styles.code}>app/app/ssr/index.tsx</code>
        </p>
      </div>

      <div className={styles.center}>
        <div className={styles.otherbox}>
          <h1 className={inter.className} style={{ paddingLeft: "5px" }}>
            Welcome to <Link target="_blank" rel="noopener noreferrer" href="https://dash.whop.com">Whop!</Link>
          </h1>
          <p className={inter.className} style={{ paddingTop: "20px", paddingLeft: "5px" }}>
            Demo mode is active. This page renders without authentication.
          </p>
        </div>
      </div>
      <div>
        <div className={styles.grid} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Link href="/app/ssr/product-gated" className={styles.card}>
            <h2 className={inter.className}>Application (SSR) &rarr;</h2>
            <p className={inter.className}>This is an SSR gating example.</p>
          </Link>
          <Link href="/app/ssg/product-gated" className={styles.card}>
            <h2 className={inter.className}>Application (SSG) &rarr;</h2>
            <p className={inter.className}>This is an SSG gating example.</p>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Page;

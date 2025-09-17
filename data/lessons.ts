export type Module = {
  id: string;
  title: string;
  description: string;
  module: string;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  video: {
    thumbnail?: string;
    duration: number;
    url: string | null;
  } | null;
};

export function getModules(): Module[] {
  return lessons;
}

export async function getLesson(
  slug: string
): Promise<(Lesson & { module: Module; next: Lesson | null }) | null> {
  let module = lessons.find(({ lessons }) =>
    lessons.some(({ id }) => id === slug)
  );

  if (!module) {
    return null;
  }

  let index = module.lessons.findIndex(({ id }) => id === slug);
  if (index < module.lessons.length - 1) {
    return {
      ...module.lessons[index],
      module,
      next: module.lessons[index + 1],
    };
  }

  const currentModuleIndex = lessons.findIndex((m) => m.id === module.id);
  const nextModule = lessons[currentModuleIndex + 1];

  if (nextModule && nextModule.lessons.length > 0) {
    return {
      ...module.lessons[index],
      module,
      next: nextModule.lessons[0],
    };
  }

  if (lessons.length > 0 && lessons[0].lessons.length > 0) {
    return {
      ...module.lessons[index],
      module,
      next: lessons[0].lessons[0],
    };
  }

  return {
    ...module.lessons[index],
    module,
    next: null,
  };
}

const lessons = [
  {
    id: "1",
    title: "Mindset",
    module: "Module 1: Mindset",
    description: "Description",
    lessons: [
      {
        id: "landscape-of-choice",
        title:
          "Health (eating right, sleeping right, porn, phone addiction (opal), habits)",
        description: "Description",
        video: {
          duration: 786,
          thumbnail:
            "https://assets.tailwindcss.com/templates/compass/lesson-video-thumbnail-01.png",
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Mindset%20and%20Health%20Strategies%20.mp4",
        },
      },
      {
        id: "paradox-of-agency",
        title: "Self-Belief/Visualization",
        description: "Description",
        video: {
          duration: 741,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Self%20Belief%20%26%20Visualization.mp4",
        },
      },
      {
        id: "liberation-from-regret",
        title: "Tai Lopez 3-Step Framework",
        description: "Description",
        video: {
          duration: 500,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/3-Step%20Framework.mp4",
        },
      },
      {
        id: "recognizing-patterns",
        title: "Complete Self-Accountability",
        description: "Description",
        video: {
          duration: 611,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Self%20Accountability.mp4",
        },
      },
    ],
  },
  {
    id: "2",
    title: "Intro/Onboarding",
    module: "Module 2: TikTok Shop",
    description: "Description",
    lessons: [
      {
        id: "mapping-causal-factors",
        title: "Welcome",
        description: "Description",
        video: {
          duration: 67,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Intro%20-%201.mp4",
        },
      },
    ],
  },
  {
    id: "3",
    title: "The Basics",
    module: "Module 2: TikTok Shop",
    description: "Description",
    lessons: [
      {
        id: "adding-products-showcase",
        title: "Adding Products To Your Showcase",
        description: "Description",
        video: {
          duration: 600,
          url: null,
        },
      },
      {
        id: "dealing-with-coincidence",
        title: "Dealing with Coincidence",
        description: "Description",
        video: null,
      },
      {
        id: "adding-product-links",
        title: "Adding Product Links",
        description: "Description",
        video: null,
      },
      {
        id: "going-live",
        title: "Going Live",
        description: "Description",
        video: {
          duration: 607,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/How%20to%20Go%20Live.mp4",
        },
      },
      {
        id: "requesting-free-samples",
        title: "Requesting Free Samples",
        description: "Description",
        video: null,
      },
      {
        id: "withdrawing-money",
        title: "Withdrawing Your Money",
        video: null,
      },
    ],
  },
  {
    id: "4",
    title: "Section 01 Starter Pack",
    module: "Module 2: TikTok Shop",
    description: "Description",
    lessons: [
      {
        id: "tt-shop-affiliate-program",
        title: "What Is The TT Shop Affiliate Program",
        description: "Description",
        video: {
          duration: 515,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/What%20is%20TikTok%20Shop.mp4",
        },
      },
      {
        id: "access-anywhere",
        title: "How To Access From Anywhere In The World",
        description: "Description",
        video: {
          duration: 341,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/The%20Loophole%20Method.mp4",
        },
      },
      {
        id: "getting-account",
        title: "Getting An Account",
        description: "Description",
        video: {
          duration: 79,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/How%20to%20get%20an%20account.mp4",
        },
      },
      {
        id: "5k-followers-fast",
        title: "How To Get To 5k Followers FAST",
        description: "Description",
        video: {
          duration: 296,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/How%20To%20Get%20To%205k%20Followers%20FAST.mp4",
        },
      },
      {
        id: "account-warming",
        title: "Account Warming",
        description: "Description",
        video: {
          duration: 197,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Account%20Warming.mp4",
        },
      },
      {
        id: "winning-products-research",
        title:
          "How To Find Winning Products Everytime (Product Research) + (Winning Product Criteria)",
        description: "Description",
        video: {
          duration: 433,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Finding%20Winning%20Products_%20Proven%20Methods%20for%20Success!%20.mp4",
        },
      },
      {
        id: "create-viral-videos",
        title: "How To Create Viral Videos That ACTUALLY Sell",
        description: "Description",
        video: {
          duration: 266,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Creating%20Viral%20Videos%20That%20Sell_%20Tips%20for%20Success!%20.mp4",
        },
      },
      {
        id: "what-not-to-do",
        title: "What NOT To Do",
        description: "Description",
        video: {
          duration: 235,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/What%20NOT%20To%20Do.mp4",
        },
      },
      {
        id: "getting-paid-lcc",
        title: "Getting Paid/LCC",
        description: "Description",
        video: {
          duration: 169,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Getting%20Paid.mp4",
        },
      },
      {
        id: "viral-video-checklist",
        title: "Viral Video Checklist",
        description: "Description",
        video: {
          duration: 344,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Viral%20Video%20Checklist.mp4",
        },
      },
      {
        id: "gameify-tt-shop",
        title: "Gameify TikTok Shop",
        description: "Description",
        video: {
          duration: 227,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Gameify%20TikTok%20Shop.mp4",
        },
      },
    ],
  },
  {
    id: "5",
    title: "Section 02 Level Up",
    module: "Module 2: TikTok Shop",
    description: "Description",
    lessons: [
      {
        id: "full-process",
        title:
          "FULL Process Start To Finish (product, ideation, filming and bulk recording, edit, post)",
        description: "Description",
        video: null,
      },
      {
        id: "faceless-money",
        title: "How To Make Money FACELESS",
        description: "Description",
        video: {
          duration: 291,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Faceless%20TikTok%20Shop.mp4",
        },
      },
      {
        id: "chatgpt-to-riches",
        title: "ChatGPT To Riches",
        description: "Description",
        video: {
          duration: 327,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/ChatGPT%20To%20Riches.mp4",
        },
      },
      {
        id: "psychology-101",
        title: "Psychology 101 (Viral Hacking)",
        description: "Description",
        video: {
          duration: 598,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Psychology%20101.mp4",
        },
      },
      {
        id: "avoid-violations",
        title: "How To AVOID Violations",
        description: "Description",
        video: {
          duration: 283,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Avoiding%20Violations_%20Tips%20to%20Keep%20Your%20Account%20Safe%20.mp4",
        },
      },
      {
        id: "capitalize-on-trends",
        title: "How To Capitalize On Trends/Relate Anything To Anything",
        description: "Description",
        video: {
          duration: 308,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/How%20To%20Capitalize%20On%20Trends.mp4",
        },
      },
      {
        id: "print-with-livestreams",
        title: "How To Print With Livestreams",
        description: "Description",
        video: null,
      },
      {
        id: "case-studies-100k",
        title: "$100,000 Case Studies",
        description: "Description",
        video: null,
      },
      {
        id: "golden-formula",
        title: "The Golden Formula (video structure of most viral videos)",
        description: "Description",
        video: {
          duration: 916,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/The%20Golden%20Formula.mp4",
        },
      },
      {
        id: "seo-mastery",
        title:
          "SEO Mastery (dragging off screen, word choice, hashtag selection, creator search insights)",
        description: "Description",
        video: {
          duration: 472,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/SEO%20Mastery.mp4",
        },
      },
      {
        id: "becoming-the-viewer",
        title:
          "Becoming The Viewer (talk abt target audience, tapping into energy)",
        description: "Description",
        video: {
          duration: 340,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Becoming%20The%20Viewer.mp4",
        },
      },
    ],
  },
  {
    id: "6",
    title: "Section 03 God Mode",
    module: "Module 2: TikTok Shop",
    description: "Description",
    lessons: [
      {
        id: "posting-schedule",
        title: "Posting Schedule (KPIs)",
        description: "Description",
        video: {
          duration: 381,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Power%20of%20KPI_s.mp4",
        },
      },
      {
        id: "top-tier-videos",
        title:
          "Creating Top Tier Videos (LIVE RECORDING for regular vids, story, conspiracy)",
        description: "Description",
        video: {
          duration: 466,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Creating%20Viral%20Videos%20That%20Sell_%20Tips%20for%20Success!%20.mp4",
        },
      },
      {
        id: "no-sales",
        title: "Why You Are Getting No Sales",
        description: "Description",
        video: {
          duration: 148,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Why%20You%20Are%20Getting%20No%20Sales.mp4",
        },
      },
      {
        id: "cashing-out-llc",
        title: "Cashing Out Like A G (LLC Formation)",
        description: "Description",
        video: {
          duration: 400,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Cashing%20Out%20Like%20A%20G%20(LLC).mp4",
        },
      },
      {
        id: "exposing-algorithm",
        title: "Exposing The Algorithm",
        description: "Description",
        video: {
          duration: 427,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Exposing%20the%20Secrets%20of%20the%20TikTok%20Algorithm.mp4",
        },
      },
      {
        id: "stealing-like-artist",
        title: "Stealing Like An Artist",
        description: "Description",
        video: {
          duration: 214,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Stealing%20Like%20An%20Artist.mp4",
        },
      },
      {
        id: "make-money-if-banned",
        title: "How To Make Money (Even If TikTok Gets Banned)",
        description: "Description",
        video: {
          duration: 534,
          url: "https://pub-55c34eb2fdb84a70baa25d5ab7a671a4.r2.dev/Making%20Money%20if%20Tiktok%20gets%20Banned.mp4",
        },
      },
      {
        id: "replace-9-5-income",
        title: "Replacing Your 9-5 Income",
        description: "Description",
        video: null,
      },
    ],
  },
];

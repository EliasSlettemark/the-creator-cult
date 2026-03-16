import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// ─── Advanced scriptwriter constants ─────────────────────────────
const BUILT_IN = `Script 1 (Insoles - Problem/Pain): "We're on our feet for 10 hours a day and we still wonder why we have foot pain. No heel support, no arch support — asking for plantar fasciitis. I've tried every insole and these feel like stepping on a cloud. Acupressure points, super breathable, cut to fit any shoe. The deal is wild right now, thousands of 5-star reviews, selling out fast. Link below."
Script 2 (Concealer - Transformation/Demo): "PSA: shape tape week — less than $20 with a free $30 brush. Heading into church with zero makeup. Watch this take away my breakouts, scarring, dark circles in 60 seconds. Full coverage, extra creamy for dry skin. Shades will sell out. Linking below."
Script 3 (Beanie/Face Mask - Lifestyle): "You should never suffer through another winter without this. A beanie with a built-in face mask. Zip up jacket, this tucks in, pull up when cold pull down when not. Keeps ears warm, face warm, not heavy everywhere else. Every color. Throw in the washer. The epitome of winter warm."
Script 4 (Teeth Whitening - Demo/Proof): "Stick it on — only doing top teeth to test it. 30 minute timer. Oh my god. Look at the difference. Ew, my bottom teeth are so yellow. Enamel safe, non-toxic for sensitive teeth. Sold out many times. Orange shopping cart means still in stock — get it before it's gone."
Script 5 (Magnesium - Authority/Pharmacist): "You have to take magnesium the right way. I'm a pharmacist — I counsel patients on supplements constantly. Magnesium involved in over 300 body functions. But most people don't know: there's not just one type. Your body uses many forms for different jobs. Taking one type means missing most benefits. I recommend a multi-complex. Take in evening, don't take with zinc/calcium/iron. Muscle cramps, headaches, anxiety, fatigue — that's low magnesium. Linking my favorite: 8 types in one, lab tested, US-made, 45-day supply, selling out at this price."
Script 6 (Steam Mop - Problem/Solution): "You'll never go back to mopping the old way. Vacuums, mops, steam cleans at the same time. Steam only — no harsh chemicals. No three machines. Comes with extra roller and storage stand. On a huge sale now — when these sell out they won't restock. Link below if still available."
Script 7 (Anti-aging Bundle - Expert Breakdown): "Nobody is actually telling you how to use it. Microneedling serum first — stimulates collagen, creates microchannels so everything absorbs deeper. That's what no one tells you. Then pigmentation corrector. Then tox cream — small amount, I use it on tech neck lines too. Then wrinkle stick on 11s, crow's feet, around mouth. Then filler eye patches before bed — wake up looking like a walking filter. Screenshot this order. Only problem: four week wait because they keep selling out, and 75% off is only 24 more hours."
Script 8 (Korean Skincare - Before/After): "That used to be my face. Now — no makeup, no filter, not one needle, no Botox, no fillers. Korean skincare toner pads that broke the internet. Now they have a moisturizing cream with NAD+ — the anti-aging molecule. $60 for a three-month supply. Bundle is basically buy-one-get-one-half-off. Link might not show because everyone's buying it — grab the bundle before they sell out."
Script 9 (GLP Bundle - Problem List): "On a GLP and don't want muscle loss? Take creatine. Saggy droopy skin? Collagen is a must. No energy, no happiness? Vitamin D3K2. Hair falling out? Pumpkin seed oil. They noticed GLP users were buying these separately so they made a bundle — almost half off with free shipping. Keeps going out of stock. Grab two if you see the link."
Script 10 (Carpet Cleaner - Deal/Demo): "Don't spend thousands on professional carpet cleaning. All you need is this. Normally $199, scroll down for the $30 off coupon. Tons of suction, built-in stain remover, does stairs, couches, cushions. Two modes. Comes with deep clean solution. Limited restock — link below if still available."
Script 11 (Collagen - Science/Authority): "How to take collagen correctly — I'm a pancreatic cancer researcher. Collagen holds everything together: skin, joints, bones, hair, nails. We lose 1% every year starting in our 20s. Critical: full collagen can't enter your cells — it gets peed out. You need hydrolyzed collagen peptides. Small enough to pass through gut lining, enter bloodstream, signal your body to make more collagen. NeoCell: 20g hydrolyzed, grass-fed, third-party tested, $28."
Script 12 (Neck Cream - Transformation): "How did my neck go from this — after 100-pound weight loss — to this in weeks? One product. Clinically proven to thicken neck skin with ECM-5. Three-part regimen: spicule cream every night creates microchannels. One vial serum every three days. Then the ECM-5 cream. Followers are sending me their results. Not moisturizing — it's a permanent fix."
Script 13 (Digital Camera - Deal/FOMO): "I'm kind of pissed. I bought this camera at full price and right now it's 50% off in a flash sale. 4K, flip-up selfie screen, built-in flash around the lens so all photos are bright and crisp. Comes with camera, charger, memory card. Don't overpay like me — grab it now."
Script 14 (Skincare Bundle - Value Stack): "Someone at MediCube made a mistake. $228 worth of glass skin products for under $80 with free shipping. How is this even allowed? Full routine included: pink collagen mask, foam cleanser, cica toner, peptide serum, collagen jelly cream, collagen night mask, exosome shot, pore pads. Designed to work together — no guessing. Already selling out. Get it before they fix the pricing."
Script 15 (Magnesium/Cortisol - Authority): "Chin looks like this and belly pooch like that? You're not fat. You just have high cortisol. Pharmacist, almost 10 years. Stress dysregulation is the most overlooked health issue. Your HPA axis controls cortisol — magnesium regulates it. Low magnesium = stress hormones go up = symptoms pile up. Magnesium complex in one formula: glycinate, taurate, citrate and more. Toplux: 8 types, 45-day supply, vegetarian capsules, thousands of 5-star reviews. Runs great sales, sells out at this price. Orange shopping cart below."`;

const PROFILE = `CREATOR PROFILE (tailor every script to this person):
- 21-year-old male, great physique, good-looking
- Speaks firm, calm, quiet confident — never hype-bro, never salesy
- His calm confidence IS his credibility signal — scripts must match this energy
- For male products (fitness, supplements, grooming, gadgets): his body and lifestyle are the endorsement
- For female products (beauty, skincare): position him as the knowledgeable trustworthy guy who discovered it, or calm authority explaining the science
- Scripts feel like a confident friend's genuine recommendation — never a sales pitch
- Short, punchy sentences. Direct. No filler words.`;

function buildSys(bank: { title: string; content: string }[]) {
  const custom = bank.length
    ? `\n\nUSER-ADDED WINNING SCRIPTS (study these — user found these converting well):\n${bank.map((s) => `[${s.title}]:\n${s.content}`).join("\n\n---\n\n")}`
    : "";
  return `You are an elite TikTok Shop affiliate scriptwriter specializing in maximum-conversion content.\n${PROFILE}\n\nWINNING SCRIPT REFERENCE LIBRARY:\n${BUILT_IN}${custom}\n\nPSYCHOLOGICAL TACTICS to apply (pick the most powerful for each product):\n• Loss aversion — "selling out fast," "price goes back up"\n• Social proof — "thousands of 5-star reviews"\n• Authority — expertise, credentials, science\n• Curiosity gap — start mid-action, claim that demands explanation\n• Transformation — visceral before/after contrast\n• Value stack — show $ saved vs retail\n• Scarcity/urgency — limited stock, flash sale\n• Pattern interrupt — unexpected opener in first 2 seconds\n• Identity appeal — "people who do X need to know this"\n\nOUTPUT: Respond ONLY with valid JSON. No markdown, no backticks, no extra text:\n{"hook1":"","hook2":"","hook3":"","textHook1":"","textHook2":"","textHook3":"","visualHook1":"","visualHook2":"","visualHook3":"","script":"","angle":"","targetDemo":"","notes":""}`;
}

function buildHooksSys(bank: { title: string; content: string }[]) {
  const custom = bank.length
    ? `\nUSER SCRIPTS:\n${bank.map((s) => s.content).join("\n\n")}`
    : "";
  return `You are an elite TikTok Shop hook writer for a 21-year-old calm, confident, good-looking male creator.\n${PROFILE}\nReference: ${BUILT_IN}${custom}\nOUTPUT ONLY valid JSON, no extra text:\n{"spokenHooks":["","","","",""],"textHooks":["","","","",""],"visualHooks":["","","","",""]}`;
}

function parseJsonResponse(text: string): Record<string, unknown> {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  try {
    const userCookie = req.cookies.get("whop_user");
    if (!userCookie) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }
    let user: unknown;
    try {
      user = JSON.parse(userCookie.value);
    } catch {
      return NextResponse.json(
        { error: "Invalid user data" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Advanced scriptwriter flow
    if (body.advanced === true) {
      const {
        product,
        description,
        category,
        angle,
        targetDemo,
        videoLength,
        inspirationScript,
        notes,
        bankScripts = [],
        mode = "full",
        angleB,
      } = body;

      if (!product || typeof product !== "string" || !product.trim()) {
        return NextResponse.json(
          { error: "Product name is required" },
          { status: 400 }
        );
      }

      const userMsg = (ang: string) =>
        `Generate a high-conversion TikTok Shop affiliate script:\nPRODUCT: ${product}\nDESCRIPTION: ${description || "Use best judgment from product name"}\nCATEGORY: ${category || "Other"}\nTARGET DEMOGRAPHIC: ${targetDemo || "General (All)"}\nANGLE: ${ang}\nVIDEO LENGTH: ${videoLength || "30 seconds"}\n${inspirationScript ? `INSPIRATION SCRIPT (adapt style/structure):\n${inspirationScript}\n` : ""}${notes ? `ADDITIONAL NOTES: ${notes}` : ""}`;

      const callOpenAI = async (
        system: string,
        userContent: string
      ): Promise<Record<string, unknown>> => {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: system },
            { role: "user", content: userContent },
          ],
          temperature: 0.85,
          max_tokens: 1500,
        });
        const text = response.choices[0]?.message?.content?.trim();
        if (!text) throw new Error("No content generated");
        return parseJsonResponse(text);
      };

      if (mode === "hooks") {
        const system = buildHooksSys(bankScripts);
        const userContent = `Generate 5 hooks for: ${product}. Category: ${category || "Other"}. Demo: ${targetDemo || "General (All)"}. ${notes || ""}`;
        const result = await callOpenAI(system, userContent);
        return NextResponse.json({
          advanced: true,
          mode: "hooks",
          result: {
            spokenHooks: result.spokenHooks ?? [],
            textHooks: result.textHooks ?? [],
            visualHooks: result.visualHooks ?? [],
          },
        });
      }

      if (mode === "ab" && angleB) {
        const system = buildSys(bankScripts);
        const [resultA, resultB] = await Promise.all([
          callOpenAI(system, userMsg(angle)),
          callOpenAI(system, userMsg(angleB)),
        ]);
        return NextResponse.json({
          advanced: true,
          mode: "ab",
          resultA,
          resultB,
        });
      }

      // full
      const system = buildSys(bankScripts);
      const result = await callOpenAI(system, userMsg(angle || "Authority/Expert"));
      return NextResponse.json({
        advanced: true,
        mode: "full",
        result,
      });
    }

    // Legacy flow
    const { productName, productType, website, description, style, outline } =
      body;

    if (!productName || !productType || !website || !description || !style) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `
    Create a marketing script for the following product:
    - Product Name: ${productName}
    - Product Type: ${productType}
    - Website: ${website}
    - Description: ${description}
    - Style: ${style}
    - Outline: ${outline}

    The script might include the following sections:
    Hook:
    Intro:
    Features:
    Social Proof: 
    Call to Action:
    Conclusion:

    Provide the script in a plain text. No title, No styling. PLAIN TEXT AND ONLY USE COLONS FOR SECTIONS. BREAK TEXT BETWEEN SCETIONS.
  `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "ViralifyAI is a tiktok affiliate marketing viral script generator that creates good english, viral scripts, without making stuff up, or assuming things about the product. You're the api skriptify uses.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.92,
      max_tokens: 700,
      top_p: 0.59,
      frequency_penalty: 0,
      presence_penalty: 0.27,
    });

    const generatedText = response.choices[0].message?.content?.trim();
    if (!generatedText) {
      throw new Error("No content generated by OpenAI");
    }

    const scriptParts = generatedText.split("\n\n").reduce(
      (acc: { [key: string]: string }, part: string) => {
        const lines = part.split("\n");
        let key = lines[0].split(":")[0].trim();
        const content = lines.slice(1).join("\n").trim();
        key = key.toLowerCase().replace(/\s+/g, "");
        if (key === "calltoaction") key = "call to action";
        acc[key] = content;
        return acc;
      },
      {}
    );

    return NextResponse.json({ script: scriptParts });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate script";
    console.error("Error generating script:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

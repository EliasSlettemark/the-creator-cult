"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  TextField,
  TextArea,
  Select,
  Heading,
  Text,
  Inset,
  Badge,
  Separator,
} from "frosted-ui";
import { Copy, Download, Star, RotateCcw, Trash2 } from "lucide-react";

// ─── CONSTANTS ────────────────────────────────────────────────
const CATS = [
  "Health & Supplements",
  "Beauty & Skincare",
  "Fitness & Body",
  "Home & Gadgets",
  "Fashion & Accessories",
  "Food & Wellness",
  "Tech & Electronics",
  "Other",
];
const ANGLES = [
  "Authority/Expert",
  "Personal Transformation",
  "Deal/Value Urgency",
  "Social Proof Wave",
  "Problem→Solution",
  "Demo/Proof",
  "Curiosity Hook",
  "Emotional Story",
];
const LENGTHS = ["15 seconds", "30 seconds", "60 seconds"];
const DEMOS = [
  "General (All)",
  "Young Women (18-25)",
  "Women (25-40)",
  "Women (40+)",
  "Young Men (18-25)",
  "Men (25-40)",
  "Fitness Enthusiasts",
  "Moms",
  "Health-Conscious",
];
const PRESETS = [
  {
    label: "🧠 Authority",
    angle: "Authority/Expert",
    notes: "Lead with expertise. Establish trust before the pitch.",
  },
  {
    label: "💥 Shocking Reveal",
    angle: "Curiosity Hook",
    notes: "Open with a surprising claim or fact that stops the scroll.",
  },
  {
    label: "🔥 Deal Alert",
    angle: "Deal/Value Urgency",
    notes: "Heavy urgency. Price drop, limited stock, FOMO.",
  },
  {
    label: "💪 Transformation",
    angle: "Personal Transformation",
    notes: "Lean into the before/after visual contrast.",
  },
  {
    label: "📊 Social Proof",
    angle: "Social Proof Wave",
    notes: "Lead with viral moment or mass-popularity angle.",
  },
];

// ─── STORAGE ──────────────────────────────────────────────────
const STORAGE_KEYS = {
  products: "tiktok_scriptwriter_products",
  scripts: "tiktok_scriptwriter_scripts",
  bank: "tiktok_scriptwriter_bank",
};

function getStored<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function setStored(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
}

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const wc = (t = "") => t.trim().split(/\s+/).filter(Boolean).length;
const rt = (t = "") => Math.ceil(wc(t) / 2.5);

// ─── TYPES ────────────────────────────────────────────────────
type ProductEntry = {
  id: string;
  name: string;
  cat: string;
  desc: string;
  createdAt: number;
};

type BankEntry = {
  id: string;
  title: string;
  content: string;
  addedAt: number;
};

type ScriptResult = {
  hook1?: string;
  hook2?: string;
  hook3?: string;
  textHook1?: string;
  textHook2?: string;
  textHook3?: string;
  visualHook1?: string;
  visualHook2?: string;
  visualHook3?: string;
  script?: string;
  angle?: string;
  targetDemo?: string;
  notes?: string;
  spokenHooks?: string[];
  textHooks?: string[];
  visualHooks?: string[];
};

type SavedScript = {
  id: string;
  product: string;
  desc: string;
  cat: string;
  angle: string;
  len: string;
  demo: string;
  result: ScriptResult;
  resultB?: ScriptResult;
  mode: string;
  createdAt: number;
  rating: number;
  perfNotes: string;
};

// ─── REUSABLE ─────────────────────────────────────────────────
const GradientBlobs: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none blur-3xl">
    <div className="absolute w-72 h-72 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-50 top-10 left-10 animate-pulse" />
    <div className="absolute w-72 h-72 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full opacity-50 bottom-10 right-10 animate-pulse" />
  </div>
);

function CopyBtn({
  text,
  size = "2",
}: {
  text: string;
  size?: "1" | "2" | "3";
}) {
  const [copied, setCopied] = useState(false);
  const onClick = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button
      variant="ghost"
      size={size as "1" | "2" | "3"}
      onClick={onClick}
      title="Copy"
    >
      <Copy className="h-4 w-4 mr-2" />
      <Text className="text-xs">{copied ? "✓ Copied" : "Copy"}</Text>
    </Button>
  );
}

function Stars({
  value = 0,
  onChange,
}: {
  value?: number;
  onChange?: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const v = hover || value;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange?.(i)}
          className="p-0 border-0 bg-transparent cursor-pointer text-foreground"
          aria-label={`Rate ${i} stars`}
        >
          <Star
            className={`h-5 w-5 ${i <= v ? "fill-amber-400 text-amber-400" : "text-muted"}`}
          />
        </button>
      ))}
    </div>
  );
}

function Empty({
  icon,
  title,
  sub,
}: {
  icon: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="text-center py-12 px-5 text-muted">
      <div className="text-4xl mb-2">{icon}</div>
      <Heading size="5" className="mb-1">
        {title}
      </Heading>
      <Text size="2" color="gray">
        {sub}
      </Text>
    </div>
  );
}

// ─── GENERATE TAB ─────────────────────────────────────────────
function GenerateTab({
  products,
  bank,
  onSave,
  initData,
  onInitConsumed,
}: {
  products: ProductEntry[];
  bank: BankEntry[];
  onSave: (s: SavedScript) => void;
  initData: SavedScript | null;
  onInitConsumed: () => void;
}) {
  const [product, setProduct] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState(CATS[0]);
  const [angle, setAngle] = useState(ANGLES[0]);
  const [len, setLen] = useState(LENGTHS[1]);
  const [demo, setDemo] = useState(DEMOS[0]);
  const [inspire, setInspire] = useState("");
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState<"full" | "ab" | "hooks">("full");
  const [selProd, setSelProd] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [resultB, setResultB] = useState<ScriptResult | null>(null);
  const [rTab, setRTab] = useState<"script" | "hooks" | "visual" | "notes" | "spoken" | "text" | "visualH">("script");
  const [abSide, setAbSide] = useState<"a" | "b">("a");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initData) {
      setProduct(initData.product || "");
      setDesc(initData.desc || "");
      setCat(initData.cat || CATS[0]);
      setAngle(initData.angle || ANGLES[0]);
      setLen(initData.len || LENGTHS[1]);
      setDemo(initData.demo || DEMOS[0]);
      setNotes("");
      setResult(null);
      setResultB(null);
      setSaved(false);
      onInitConsumed();
    }
  }, [initData, onInitConsumed]);

  useEffect(() => {
    if (selProd) {
      const p = products.find((x) => x.id === selProd);
      if (p) {
        setProduct(p.name);
        setDesc(p.desc);
        setCat(p.cat);
      }
    }
  }, [selProd, products]);

  const generate = async () => {
    if (!product.trim()) {
      setErr("Enter a product name.");
      return;
    }
    setErr("");
    setLoading(true);
    setResult(null);
    setResultB(null);
    setSaved(false);
    try {
      const bankScripts = bank.map((b) => ({ title: b.title, content: b.content }));
      if (mode === "hooks") {
        const res = await fetch("/api/generate-script", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            advanced: true,
            product,
            description: desc,
            category: cat,
            targetDemo: demo,
            notes,
            bankScripts,
            mode: "hooks",
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Generation failed");
        }
        const data = await res.json();
        setResult(data.result);
        setRTab("spoken");
      } else if (mode === "ab") {
        const altAngles = ANGLES.filter((a) => a !== angle);
        const angleB = altAngles[Math.floor(Math.random() * altAngles.length)];
        const res = await fetch("/api/generate-script", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            advanced: true,
            product,
            description: desc,
            category: cat,
            angle,
            angleB,
            targetDemo: demo,
            videoLength: len,
            inspirationScript: inspire,
            notes,
            bankScripts,
            mode: "ab",
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Generation failed");
        }
        const data = await res.json();
        setResult(data.resultA);
        setResultB(data.resultB);
        setAbSide("a");
        setRTab("script");
      } else {
        const res = await fetch("/api/generate-script", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            advanced: true,
            product,
            description: desc,
            category: cat,
            angle,
            targetDemo: demo,
            videoLength: len,
            inspirationScript: inspire,
            notes,
            bankScripts,
            mode: "full",
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Generation failed");
        }
        const data = await res.json();
        setResult(data.result);
        setRTab("script");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Generation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveScript = () => {
    if (!result) return;
    onSave({
      id: uid(),
      product,
      desc,
      cat,
      angle,
      len,
      demo,
      result,
      resultB: resultB ?? undefined,
      mode,
      createdAt: Date.now(),
      rating: 0,
      perfNotes: "",
    });
    setSaved(true);
  };

  const activeR = mode === "ab" && abSide === "b" ? resultB : result;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <div className="p-6">
          <Heading size="6" className="mb-4">
            ⚡ Quick tone presets
          </Heading>
          <div className="flex flex-wrap gap-2 mb-6">
            {PRESETS.map((p) => (
              <Button
                key={p.label}
                variant={angle === p.angle ? "soft" : "surface"}
                size="2"
                onClick={() => {
                  setAngle(p.angle);
                  setNotes(p.notes);
                }}
              >
                {p.label}
              </Button>
            ))}
          </div>

          {products.length > 0 && (
            <div className="mb-4">
              <Text size="2" weight="medium" className="mb-2 block">
                📂 Load from product library
              </Text>
              <Select.Root
                value={selProd || "__none__"}
                onValueChange={(v) => setSelProd(v === "__none__" ? "" : v)}
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="__none__">— Select saved product —</Select.Item>
                  {products.map((p) => (
                    <Select.Item key={p.id} value={p.id}>
                      {p.name} ({p.cat})
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <TextField.Root>
              <Text size="2" weight="medium" className="mb-2 block">Product name *</Text>
              <TextField.Input
                placeholder="e.g. Magnesium Complex"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              />
            </TextField.Root>
            <div>
              <Text size="2" weight="medium" className="mb-2 block">
                Category
              </Text>
              <Select.Root value={cat} onValueChange={setCat}>
                <Select.Trigger className="w-full" />
                <Select.Content>
                  {CATS.map((c) => (
                    <Select.Item key={c} value={c}>
                      {c}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          </div>

          <div className="mb-4">
            <Text size="2" weight="medium" className="mb-2 block">
              Product description / key benefits / deal info
            </Text>
            <TextArea
              placeholder="Key features, ingredients, price, deal..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="min-h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Text size="2" weight="medium" className="mb-2 block">
                Script angle
              </Text>
              <Select.Root value={angle} onValueChange={setAngle}>
                <Select.Trigger className="w-full" />
                <Select.Content>
                  {ANGLES.map((a) => (
                    <Select.Item key={a} value={a}>
                      {a}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
            <div>
              <Text size="2" weight="medium" className="mb-2 block">
                Target demo
              </Text>
              <Select.Root value={demo} onValueChange={setDemo}>
                <Select.Trigger className="w-full" />
                <Select.Content>
                  {DEMOS.map((d) => (
                    <Select.Item key={d} value={d}>
                      {d}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
            <div>
              <Text size="2" weight="medium" className="mb-2 block">
                Video length
              </Text>
              <Select.Root value={len} onValueChange={setLen}>
                <Select.Trigger className="w-full" />
                <Select.Content>
                  {LENGTHS.map((l) => (
                    <Select.Item key={l} value={l}>
                      {l}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          </div>

          <div className="mb-4">
            <Text size="2" weight="medium" className="mb-2 block">
              🔥 Inspiration script (paste a winning script to adapt)
            </Text>
            <TextArea
              placeholder="Paste any winning script — AI will adapt its structure..."
              value={inspire}
              onChange={(e) => setInspire(e.target.value)}
              className="min-h-20"
            />
          </div>

          <div className="mb-6">
            <Text size="2" weight="medium" className="mb-2 block">Extra notes / instructions</Text>
            <TextField.Root>
              <TextField.Input
                placeholder="e.g. mention 50% off, focus on women 35+..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </TextField.Root>
          </div>

          <div className="flex gap-2 mb-4">
            {(
              [
                ["full", "⚡ Full Script"],
                ["ab", "🆚 A/B Variants"],
                ["hooks", "🎣 Hooks Only"],
              ] as const
            ).map(([m, label]) => (
              <Button
                key={m}
                variant={mode === m ? "soft" : "surface"}
                size="2"
                className="flex-1"
                onClick={() => setMode(m)}
              >
                {label}
              </Button>
            ))}
          </div>
          {mode === "ab" && (
            <Text size="2" color="gray" className="mb-2">
              Generates your angle + a second random angle. Compare to see which converts better.
            </Text>
          )}
          {mode === "hooks" && (
            <Text size="2" color="gray" className="mb-2">
              5 hooks of each type. Best when you need better openers.
            </Text>
          )}

          {err && (
            <Text size="2" color="red" className="mb-4">
              {err}
            </Text>
          )}

          <Button
            onClick={generate}
            disabled={loading}
            className="w-full"
            size="3"
          >
            {loading
              ? mode === "ab"
                ? "Generating A/B..."
                : "Generating..."
              : "⚡ Generate"}
          </Button>
        </div>
      </Card>

      {result && (
        <Card>
          <Inset side="all" pb="current" className="p-6">
            {mode === "ab" && (
              <div className="flex border-b border-default mb-4 -mx-6 px-6 pb-4">
                {(["a", "b"] as const).map((s) => (
                  <Button
                    key={s}
                    variant="ghost"
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=on]:border-primary"
                    onClick={() => setAbSide(s)}
                  >
                    {s === "a"
                      ? `Variant A — ${result?.angle ?? ""}`
                      : resultB
                        ? `Variant B — ${resultB?.angle ?? ""}`
                        : "Variant B"}
                  </Button>
                ))}
              </div>
            )}

            {activeR && (
              <>
                <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b border-default">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="soft" color="purple">
                      📌 {activeR.angle}
                    </Badge>
                    <Badge variant="soft" color="pink">
                      👥 {activeR.targetDemo}
                    </Badge>
                    {mode !== "hooks" && activeR.script && (
                      <Badge variant="soft" color="cyan">
                        ⏱ ~{rt(activeR.script)}s
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="2"
                      variant={saved ? "soft" : "solid"}
                      color={saved ? "green" : "purple"}
                      disabled={saved}
                      onClick={saveScript}
                    >
                      {saved ? "✓ Saved" : "💾 Save to History"}
                    </Button>
                    {mode !== "hooks" && activeR.script && (
                      <CopyBtn text={activeR.script} />
                    )}
                  </div>
                </div>

                {mode !== "hooks" && activeR && (
                  <>
                    <div className="flex border-b border-default mb-4 -mx-6 px-6">
                      {(
                        [
                          ["script", "📝 Script"],
                          ["hooks", "🎣 Hooks"],
                          ["visual", "🎥 Visual"],
                          ["notes", "💡 Notes"],
                        ] as const
                      ).map(([t, label]) => (
                        <Button
                          key={t}
                          variant="ghost"
                          size="2"
                          className="rounded-none border-b-2 border-transparent data-[state=on]:border-primary"
                          onClick={() => setRTab(t)}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                    <div className="min-h-[200px]">
                      {rTab === "script" && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Text size="2" color="gray">
                              {wc(activeR.script ?? "")} words · ~{rt(activeR.script ?? "")}s read
                            </Text>
                            <CopyBtn text={activeR.script ?? ""} />
                          </div>
                          <div className="bg-muted rounded-lg p-4 border-l-4 border-purple-500 whitespace-pre-wrap text-foreground">
                            {activeR.script}
                          </div>
                        </div>
                      )}
                      {rTab === "hooks" && (
                        <div className="space-y-4">
                          {[
                            ["🎤 Spoken Hooks", "purple", [activeR.hook1, activeR.hook2, activeR.hook3]],
                            ["📲 On-Screen Text", "pink", [activeR.textHook1, activeR.textHook2, activeR.textHook3]],
                          ].map(([title, _, items]) => (
                            <div key={String(title)}>
                              <Text size="2" weight="bold" className="mb-2 block">
                                {title}
                              </Text>
                              {(items as (string | undefined)[]).map((h, i) => (
                                <div
                                  key={i}
                                  className="flex justify-between gap-2 items-start mb-2 p-3 bg-muted rounded-lg border-l-4 border-purple-500"
                                >
                                  <Text size="2" className="flex-1">
                                    {h}
                                  </Text>
                                  <CopyBtn text={h ?? ""} size="1" />
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                      {rTab === "visual" && (
                        <div>
                          <Text size="2" weight="bold" className="mb-2 block">
                            🎥 Visual hook directions
                          </Text>
                          {[activeR.visualHook1, activeR.visualHook2, activeR.visualHook3].map(
                            (h, i) => (
                              <div
                                key={i}
                                className="flex justify-between gap-2 mb-2 p-3 bg-muted rounded-lg border-l-4 border-cyan-500"
                              >
                                <div>
                                  <Text size="1" color="gray">
                                    OPTION {i + 1}
                                  </Text>
                                  <Text size="2">{h}</Text>
                                </div>
                                <CopyBtn text={h ?? ""} size="1" />
                              </div>
                            )
                          )}
                        </div>
                      )}
                      {rTab === "notes" && (
                        <div>
                          <Text size="2" weight="bold" className="mb-2 block">
                            💡 Delivery notes
                          </Text>
                          <div className="bg-muted rounded-lg p-4 border-l-4 border-amber-500 whitespace-pre-wrap">
                            {activeR.notes}
                          </div>
                        </div>
                      )}
                    </div>
                    {activeR.script && (
                      <div className="mt-4">
                        <CopyBtn
                          text={`HOOKS:\n1. ${activeR.hook1 ?? ""}\n2. ${activeR.hook2 ?? ""}\n3. ${activeR.hook3 ?? ""}\n\nON-SCREEN TEXT:\n1. ${activeR.textHook1 ?? ""}\n2. ${activeR.textHook2 ?? ""}\n3. ${activeR.textHook3 ?? ""}\n\nVISUAL HOOKS:\n1. ${activeR.visualHook1 ?? ""}\n2. ${activeR.visualHook2 ?? ""}\n3. ${activeR.visualHook3 ?? ""}\n\nSCRIPT:\n${activeR.script}\n\nDELIVERY NOTES:\n${activeR.notes ?? ""}`}
                        />
                      </div>
                    )}
                  </>
                )}

                {mode === "hooks" && result && (
                  <div>
                    <div className="flex gap-2 mb-4 border-b border-default pb-4">
                      {(
                        [
                          ["spoken", "🎤 Spoken"],
                          ["text", "📲 Text"],
                          ["visualH", "🎥 Visual"],
                        ] as const
                      ).map(([t, label]) => (
                        <Button
                          key={t}
                          variant="ghost"
                          size="2"
                          onClick={() => setRTab(t)}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                    {rTab === "spoken" &&
                      result.spokenHooks?.map((h, i) => (
                        <div
                          key={i}
                          className="flex justify-between gap-2 mb-2 p-3 bg-muted rounded-lg border-l-4 border-purple-500"
                        >
                          <Text size="2" className="flex-1">
                            {h}
                          </Text>
                          <CopyBtn text={h} size="1" />
                        </div>
                      ))}
                    {rTab === "text" &&
                      result.textHooks?.map((h, i) => (
                        <div
                          key={i}
                          className="flex justify-between gap-2 mb-2 p-3 bg-muted rounded-lg border-l-4 border-pink-500"
                        >
                          <Text size="2" className="flex-1" weight="bold">
                            {h}
                          </Text>
                          <CopyBtn text={h} size="1" />
                        </div>
                      ))}
                    {rTab === "visualH" &&
                      result.visualHooks?.map((h, i) => (
                        <div
                          key={i}
                          className="flex justify-between gap-2 mb-2 p-3 bg-muted rounded-lg border-l-4 border-cyan-500"
                        >
                          <Text size="2" className="flex-1">
                            {h}
                          </Text>
                          <CopyBtn text={h} size="1" />
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
          </Inset>
        </Card>
      )}
    </div>
  );
}

// ─── HISTORY TAB ───────────────────────────────────────────────
function HistoryTab({
  scripts,
  onUpdate,
  onRemix,
}: {
  scripts: SavedScript[];
  onUpdate: (v: SavedScript[]) => void;
  onRemix: (s: SavedScript) => void;
}) {
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState<SavedScript | null>(null);
  const [pn, setPn] = useState("");
  const filtered = scripts.filter((s) =>
    s.product.toLowerCase().includes(search.toLowerCase())
  );

  const upd = (id: string, ch: Partial<SavedScript>) => {
    const next = scripts.map((s) => (s.id === id ? { ...s, ...ch } : s));
    onUpdate(next);
    if (sel?.id === id) setSel({ ...sel, ...ch });
  };
  const del = (id: string) => {
    onUpdate(scripts.filter((s) => s.id !== id));
    if (sel?.id === id) setSel(null);
  };

  if (scripts.length === 0) {
    return (
      <Card>
        <Inset side="all" className="p-8">
          <Empty
            icon="📚"
            title="No saved scripts yet"
            sub="Generate scripts and hit Save to build your library"
          />
        </Inset>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
      <Card>
        <Inset side="all" className="p-4">
          <TextField.Root className="mb-4">
            <TextField.Input
              placeholder="🔍 Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </TextField.Root>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filtered.length === 0 ? (
              <Text size="2" color="gray">
                No results.
              </Text>
            ) : (
              filtered.map((s) => (
                <div
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSel(s);
                    setPn(s.perfNotes || "");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSel(s);
                      setPn(s.perfNotes || "");
                    }
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${sel?.id === s.id ? "border-purple-500 bg-muted" : "border-default hover:bg-muted/50"}`}
                >
                  <Text size="2" weight="bold">
                    {s.product}
                  </Text>
                  <Text size="1" color="gray">
                    {s.cat} · {s.len} · {new Date(s.createdAt).toLocaleDateString()}
                  </Text>
                  <div className="flex justify-between items-center mt-2">
                    <Stars value={s.rating} onChange={(r) => upd(s.id, { rating: r })} />
                    <Badge variant="soft" size="1">
                      {s.angle}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Inset>
      </Card>

      <Card>
        <Inset side="all" className="p-6">
          {!sel ? (
            <div className="text-center py-12 text-muted">
              <Text size="2">← Select a script to view</Text>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-default">
                <div>
                  <Heading size="5" className="mb-2">
                    {sel.product}
                  </Heading>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="soft">{sel.angle}</Badge>
                    <Badge variant="soft" color="pink">
                      {sel.demo}
                    </Badge>
                    <Badge variant="soft" color="cyan">
                      {sel.len}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="2" onClick={() => onRemix(sel)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Remix
                  </Button>
                  <Button size="2" color="red" variant="soft" onClick={() => del(sel.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              <div>
                <Text size="2" weight="medium" className="mb-2 block">
                  Your rating
                </Text>
                <Stars value={sel.rating} onChange={(r) => upd(sel.id, { rating: r })} />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Text size="2" weight="medium">
                    Script
                  </Text>
                  <CopyBtn text={sel.result?.script ?? ""} size="1" />
                </div>
                <div className="bg-muted rounded-lg p-4 border-l-4 border-purple-500 whitespace-pre-wrap">
                  {sel.result?.script}
                </div>
              </div>

              {sel.result?.hook1 && (
                <div>
                  <Text size="2" weight="medium" className="mb-2 block">
                    Spoken hooks
                  </Text>
                  <div className="space-y-2">
                    {[sel.result.hook1, sel.result.hook2, sel.result.hook3]
                      .filter(Boolean)
                      .map((h, i) => (
                        <div
                          key={i}
                          className="flex justify-between gap-2 p-2 bg-muted rounded-lg"
                        >
                          <Text size="2">{h}</Text>
                          <CopyBtn text={h ?? ""} size="1" />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {sel.resultB && (
                <div className="p-4 bg-muted/50 rounded-lg border border-default">
                  <Text size="2" weight="medium" className="mb-2 block">
                    Variant B — {sel.resultB.angle}
                  </Text>
                  <div className="bg-muted rounded-lg p-4 whitespace-pre-wrap mt-2">
                    {sel.resultB.script}
                  </div>
                </div>
              )}

              <div>
                <Text size="2" weight="medium" className="mb-2 block">
                  Performance notes
                </Text>
                <TextArea
                  placeholder="Views, conversions, what worked..."
                  value={pn}
                  onChange={(e) => setPn(e.target.value)}
                  onBlur={() => upd(sel.id, { perfNotes: pn })}
                  className="min-h-20"
                />
              </div>
            </div>
          )}
        </Inset>
      </Card>
    </div>
  );
}

// ─── PRODUCTS TAB ─────────────────────────────────────────────
function ProductsTab({
  products,
  onUpdate,
}: {
  products: ProductEntry[];
  onUpdate: (v: ProductEntry[]) => void;
}) {
  const [name, setName] = useState("");
  const [cat, setCat] = useState(CATS[0]);
  const [desc, setDesc] = useState("");
  const [edit, setEdit] = useState<string | null>(null);

  const save = () => {
    if (!name.trim()) return;
    if (edit) {
      onUpdate(
        products.map((p) =>
          p.id === edit ? { ...p, name, cat, desc } : p
        )
      );
      setEdit(null);
    } else {
      onUpdate([
        ...products,
        { id: uid(), name, cat, desc, createdAt: Date.now() },
      ]);
    }
    setName("");
    setCat(CATS[0]);
    setDesc("");
  };

  const startEdit = (p: ProductEntry) => {
    setEdit(p.id);
    setName(p.name);
    setCat(p.cat);
    setDesc(p.desc);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <div className="p-6">
          <Heading size="5" className="mb-4">
            {edit ? "✏️ Edit product" : "➕ Add product"}
          </Heading>
          <div className="space-y-4">
            <TextField.Root>
              <Text size="2" weight="medium" className="mb-2 block">Product name</Text>
              <TextField.Input
                placeholder="e.g. Collagen Peptides"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </TextField.Root>
            <div>
              <Text size="2" weight="medium" className="mb-2 block">
                Category
              </Text>
              <Select.Root value={cat} onValueChange={setCat}>
                <Select.Trigger className="w-full" />
                <Select.Content>
                  {CATS.map((c) => (
                    <Select.Item key={c} value={c}>
                      {c}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
            <div>
              <Text size="2" weight="medium" className="mb-2 block">
                Description / deal info
              </Text>
              <TextArea
                placeholder="Key features, price, deal..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="min-h-24"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button onClick={save} className="flex-1" size="3">
              {edit ? "✓ Save changes" : "➕ Add product"}
            </Button>
            {edit && (
              <Button
                variant="surface"
                size="3"
                onClick={() => {
                  setEdit(null);
                  setName("");
                  setCat(CATS[0]);
                  setDesc("");
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {products.length === 0 ? (
          <Card>
            <Inset side="all" className="p-8">
              <Empty
                icon="🗂"
                title="No products saved"
                sub="Save products to load them in the generator"
              />
            </Inset>
          </Card>
        ) : (
          products.map((p) => (
            <Card key={p.id}>
              <div className="p-4 flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <Heading size="4">{p.name}</Heading>
                  <Badge variant="soft" className="mt-2">
                    {p.cat}
                  </Badge>
                  {p.desc && (
                    <Text size="2" color="gray" className="mt-2 block line-clamp-2">
                      {p.desc.slice(0, 100)}
                      {p.desc.length > 100 ? "..." : ""}
                    </Text>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="1" variant="soft" onClick={() => startEdit(p)}>
                    ✏️
                  </Button>
                  <Button
                    size="1"
                    color="red"
                    variant="soft"
                    onClick={() => onUpdate(products.filter((x) => x.id !== p.id))}
                  >
                    🗑
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// ─── SCRIPT BANK TAB ──────────────────────────────────────────
function BankTab({
  bank,
  onUpdate,
}: {
  bank: BankEntry[];
  onUpdate: (v: BankEntry[]) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const add = () => {
    if (!title.trim() || !content.trim()) return;
    onUpdate([
      ...bank,
      { id: uid(), title, content, addedAt: Date.now() },
    ]);
    setTitle("");
    setContent("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <Heading size="5" className="mb-1">
            🧠 Add script to AI memory
          </Heading>
          <Text size="2" color="gray" className="mb-4 block">
            Scripts you add are used to improve every future generation.
          </Text>
          <div className="space-y-4">
            <TextField.Root>
              <Text size="2" weight="medium" className="mb-2 block">Script title</Text>
              <TextField.Input
                placeholder="e.g. Viral Protein Powder — 200k views"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </TextField.Root>
            <div>
              <Text size="2" weight="medium" className="mb-2 block">
                Paste the winning script
              </Text>
              <TextArea
                placeholder="Full script — hooks, body, CTA..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-32"
              />
            </div>
          </div>
          <Button onClick={add} className="w-full mt-4" size="3">
            ➕ Add to AI memory
          </Button>
        </div>
      </Card>

      <div>
        <Text size="2" weight="bold" className="mb-3 block uppercase tracking-wide text-muted">
          AI memory — custom scripts ({bank.length})
        </Text>
        {bank.length === 0 ? (
          <Card>
            <Inset side="all" className="p-8">
              <Empty
                icon="🧠"
                title="AI memory is empty"
                sub="Add winning scripts above to teach the AI your best patterns"
              />
            </Inset>
          </Card>
        ) : (
          <div className="space-y-4">
            {bank.map((b) => (
              <Card key={b.id}>
                <div className="p-4">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <Heading size="3">{b.title}</Heading>
                      <Text size="1" color="gray">
                        Added {new Date(b.addedAt).toLocaleDateString()}
                      </Text>
                    </div>
                    <Button
                      size="1"
                      color="red"
                      variant="soft"
                      onClick={() => onUpdate(bank.filter((x) => x.id !== b.id))}
                    >
                      🗑 Remove
                    </Button>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-sm text-muted line-clamp-4">
                    {b.content}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Card className="bg-muted/30">
        <Inset side="all" className="p-4">
          <Text size="2" color="gray">
            📌 The AI starts with 15 built-in winning scripts. Every script you add is used in future generations so the AI learns your niche and what converts for you.
          </Text>
        </Inset>
      </Card>
    </div>
  );
}

// ─── ROOT PAGE ─────────────────────────────────────────────────
const TABS = [
  { id: "gen", icon: "⚡", label: "Generate" },
  { id: "history", icon: "📚", label: "History" },
  { id: "products", icon: "🗂", label: "Products" },
  { id: "bank", icon: "🧠", label: "Script Bank" },
] as const;

export default function ScriptGeneratorUI() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("gen");
  const [products, setProducts] = useState<ProductEntry[]>([]);
  const [scripts, setScripts] = useState<SavedScript[]>([]);
  const [bank, setBank] = useState<BankEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [remix, setRemix] = useState<SavedScript | null>(null);

  useEffect(() => {
    const p = getStored<ProductEntry[]>(STORAGE_KEYS.products);
    const s = getStored<SavedScript[]>(STORAGE_KEYS.scripts);
    const b = getStored<BankEntry[]>(STORAGE_KEYS.bank);
    if (p) setProducts(p);
    if (s) setScripts(s);
    if (b) setBank(b);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    setStored(STORAGE_KEYS.products, products);
  }, [loaded, products]);
  useEffect(() => {
    if (!loaded) return;
    setStored(STORAGE_KEYS.scripts, scripts);
  }, [loaded, scripts]);
  useEffect(() => {
    if (!loaded) return;
    setStored(STORAGE_KEYS.bank, bank);
  }, [loaded, bank]);

  const handleRemix = (s: SavedScript) => {
    setRemix(s);
    setTab("gen");
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Text color="gray">Loading your scriptwriter...</Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-h-fit bg-background text-foreground relative w-full overflow-x-hidden">
      <GradientBlobs />
      <main className="container relative z-10 flex flex-col w-full px-0 overflow-x-hidden">
        <div className="px-[54px] pr-12 py-7 flex flex-col">
          <div className="flex flex-col gap-2 mb-6">
            <Heading
              size="8"
              style={{ fontFeatureSettings: `'liga' 1, 'calt' 1` }}
            >
              Script Generator
            </Heading>
            <Text color="gray">
              Generate viral TikTok Shop scripts with AI · {bank.length > 0 ? `15 built-in + ${bank.length} custom scripts` : "15 built-in scripts"} · {scripts.length} saved · {products.length} products
            </Text>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-xl bg-muted/50">
            {TABS.map((t) => (
              <Button
                key={t.id}
                variant={tab === t.id ? "soft" : "ghost"}
                size="2"
                onClick={() => setTab(t.id)}
              >
                {t.icon} {t.label}
              </Button>
            ))}
          </div>

          {tab === "gen" && (
            <GenerateTab
              products={products}
              bank={bank}
              onSave={(s) => setScripts((prev) => [s, ...prev])}
              initData={remix}
              onInitConsumed={() => setRemix(null)}
            />
          )}
          {tab === "history" && (
            <HistoryTab
              scripts={scripts}
              onUpdate={setScripts}
              onRemix={handleRemix}
            />
          )}
          {tab === "products" && (
            <ProductsTab products={products} onUpdate={setProducts} />
          )}
          {tab === "bank" && <BankTab bank={bank} onUpdate={setBank} />}
        </div>
      </main>
    </div>
  );
}

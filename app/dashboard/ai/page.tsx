"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import { Button, Card, TextField, TextArea, Select, Heading, Text, Inset } from "frosted-ui";
import { Download, Copy, ThumbsDown, ThumbsUp, Dot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useScriptGenerator } from "./script";

const products = [
  {
    value: "food supplement",
    label: "Food Supplement",
  },
  {
    value: "makeup",
    label: "Makeup",
  },
  {
    value: "shapewear pants",
    label: "Shapewear Pants",
  },
  {
    value: "camera",
    label: "Camera",
  },
  {
    value: "skincare",
    label: "Skincare",
  },
  {
    value: "vacuum",
    label: "Vacuum",
  },
  {
    value: "summer dress",
    label: "Summer Dress",
  },
  {
    value: "turbo fan",
    label: "Turbo Fan",
  },
  {
    value: "whitening strips",
    label: "Whitening Strips",
  },
  {
    value: "iron",
    label: "Iron",
  },
  {
    value: "running vest",
    label: "Running Vest",
  },
  {
    value: "vitamin c glow",
    label: "Vitamin C Glow",
  },
  {
    value: "disney stickers",
    label: "Disney Stickers",
  },
  {
    value: "car player",
    label: "Car Player",
  },
  {
    value: "lashes remover",
    label: "Lashes Remover",
  },
  {
    value: "smart watch",
    label: "Smart Watch",
  },
  {
    value: "hose",
    label: "Hose",
  },
  {
    value: "cookware",
    label: "Cookware",
  },
  {
    value: "toilet-paper",
    label: "Toilet Paper",
  },
  {
    value: "walking-pad",
    label: "Walking Pad",
  },
  {
    value: "mattress",
    label: "Mattress",
  },
  {
    value: "lipstick",
    label: "Lipstick",
  },
  {
    value: "lipgloss",
    label: "Lipgloss",
  },
  {
    value: "liliosa lingerie",
    label: "Liliosa Lingerie",
  },
  {
    value: "laundry detergent",
    label: "Laundry Detergent",
  },
  {
    value: "loungewear-set",
    label: "Loungewear Set",
  },
  {
    value: "nipple covers",
    label: "Nipple Covers",
  },
  {
    value: "duck",
    label: "Duck",
  },
  {
    value: "lollipop",
    label: "Lollipop",
  },
  {
    value: "ear buds",
    label: "Ear Buds",
  },
  {
    value: "cooling blanket",
    label: "Cooling Blanket",
  },
  {
    value: "perfume",
    label: "Perfume",
  },
  {
    value: "smart scale",
    label: "Smart Scale",
  },
  {
    value: "shoes",
    label: "Shoes",
  },
  {
    value: "stair stepper",
    label: "Stair Stepper",
  },
  {
    value: "fan",
    label: "Fan",
  },
  {
    value: "bubble gun",
    label: "Bubble Gun",
  },
  {
    value: "portable fan",
    label: "Portable Fan",
  },
  {
    value: "powdered drink",
    label: "Powdered Drink",
  },
  {
    value: "water flosser",
    label: "Water Flosser",
  },
  {
    value: "false eyelashes",
    label: "False Eyelashes",
  },
  {
    value: "soap",
    label: "Soap",
  },
  {
    value: "energy drink",
    label: "Energy Drink",
  },
  {
    value: "jumpsuit",
    label: "Jumpsuit",
  },
  {
    value: "black jumpsuit",
    label: "Black Jumpsuit",
  },
  {
    value: "digital camera",
    label: "Digital Camera",
  },
  {
    value: "oversized coords",
    label: "Oversized Coords",
  },
  {
    value: "cleaning bundle",
    label: "Cleaning Bundle",
  },
  {
    value: "screen protector",
    label: "Screen Protector",
  },
  {
    value: "mattress topper",
    label: "Mattress Topper",
  },
  {
    value: "hair straightener",
    label: "Hair Straightener",
  },
  {
    value: "cctv",
    label: "CCTV",
  },
  {
    value: "candies",
    label: "Candies",
  },
  {
    value: "beauty storage",
    label: "Beauty Storage",
  },
  {
    value: "cora dress",
    label: "Cora Dress",
  },
  {
    value: "cargo shorts",
    label: "Cargo Shorts",
  },
  {
    value: "red dress",
    label: "Red Dress",
  },
  {
    value: "light projector",
    label: "Light Projector",
  },
  {
    value: "hair oil capsules",
    label: "Hair Oil Capsules",
  },
  {
    value: "deodorant spray",
    label: "Deodorant Spray",
  },
  {
    value: "litter box",
    label: "Litter Box",
  },
  {
    value: "air fryer",
    label: "Air Fryer",
  },
  {
    value: "powerbank",
    label: "Powerbank",
  },
  {
    value: "building blocks",
    label: "Building Blocks",
  },
  {
    value: "fitted jeans",
    label: "Fitted Jeans",
  },
  {
    value: "health supplements",
    label: "Health Supplements",
  },
  {
    value: "face mask",
    label: "Face Mask",
  },
  {
    value: "toner",
    label: "Toner",
  },
  {
    value: "birria bomb",
    label: "Birria Bomb",
  },
  {
    value: "nipple covers",
    label: "Nipple Covers",
  },
  {
    value: "sunscreen",
    label: "Sunscreen",
  },
  {
    value: "video player",
    label: "Video Player",
  },
  {
    value: "gimbal",
    label: "Gimbal",
  },
  {
    value: "bin booster",
    label: "Bin Booster",
  },
  {
    value: "wireless brush",
    label: "Wireless Brush",
  },
  {
    value: "dash cam",
    label: "Dash Cam",
  },
  {
    value: "pants",
    label: "Pants",
  },
  {
    value: "moisturizer",
    label: "Moisturizer",
  },
  {
    value: "concealer",
    label: "Concealer",
  },
  {
    value: "pillow",
    label: "Pillow",
  },
  {
    value: "shorts",
    label: "Shorts",
  },
  {
    value: "massager",
    label: "Massager",
  },
  {
    value: "work shoes",
    label: "Work Shoes",
  },
  {
    value: "air freshener",
    label: "Air Freshener",
  },
  {
    value: "fitted dress",
    label: "Fitted Dress",
  },
  {
    value: "body oil",
    label: "Body Oil",
  },
  {
    value: "revitalift serum",
    label: "Revitalift Serum",
  },
  {
    value: "laser level",
    label: "Laser Level",
  },
  {
    value: "camping chair",
    label: "Camping Chair",
  },
  {
    value: "rechargeable torch",
    label: "Rechargeable Torch",
  },
  {
    value: "jet washer",
    label: "Jet Washer",
  },
  {
    value: "leggings",
    label: "Leggings",
  },
  {
    value: "electric shaver",
    label: "Electric Shaver",
  },
  {
    value: "clogs",
    label: "Clogs",
  },
  {
    value: "glow lotion",
    label: "Glow Lotion",
  },
  {
    value: "electric scooter",
    label: "Electric Scooter",
  },
  {
    value: "assistance handle",
    label: "Assistance Handle",
  },
  {
    value: "car polish",
    label: "Car Polish",
  },
  {
    value: "body scrub",
    label: "Body Scrub",
  },
  {
    value: "gut health",
    label: "Gut Health",
  },
  {
    value: "lash serum",
    label: "Lash Serum",
  },
  {
    value: "lash curler",
    label: "Lash Curler",
  },
  {
    value: "curl cream",
    label: "Curl Cream",
  },
  {
    value: "hair oil",
    label: "Hair Oil",
  },
  {
    value: "lipstain",
    label: "Lipstain",
  },
  {
    value: "ruffle playsuit",
    label: "Ruffle Playsuit",
  },
  {
    value: "car polisher",
    label: "Car Polisher",
  },
  {
    value: "hotel pillows",
    label: "Hotel Pillows",
  },
  {
    value: "gym leggings",
    label: "Gym Leggings",
  },
  {
    value: "minoxidil",
    label: "Minoxidil",
  },
  {
    value: "laced sets",
    label: "Laced Sets",
  },
  {
    value: "car care",
    label: "Car Care",
  },
  {
    value: "gym clothes",
    label: "Gym Clothes",
  },
  {
    value: "sandals",
    label: "Sandals",
  },
  {
    value: "summer jacket",
    label: "Summer Jacket",
  },
  {
    value: "luggage set",
    label: "Luggage Set",
  },
  {
    value: "wigs",
    label: "Wigs",
  },
  {
    value: "pushup board",
    label: "Pushup Board",
  },
  {
    value: "screwdriver set",
    label: "Screwdriver Set",
  },
  {
    value: "tanning cream",
    label: "Tanning Cream",
  },
  {
    value: "mini printer",
    label: "Mini Printer",
  },
  {
    value: "lingerie set",
    label: "Lingerie Set",
  },
  {
    value: "wallpaper",
    label: "Wallpaper",
  },
  {
    value: "inspection camera",
    label: "Inspection Camera",
  },
  {
    value: "ruffle dress",
    label: "Ruffle Dress",
  },
  {
    value: "sink toy",
    label: "Sink Toy",
  },
  {
    value: "playsuit",
    label: "Playsuit",
  },
  {
    value: "coca cola",
    label: "CocaCola",
  },
  {
    value: "herbal book",
    label: "Herbal Book",
  },
  {
    value: "mystery bag",
    label: "Mystery Bag",
  },
  {
    value: "play mat",
    label: "Play Mat",
  },
  {
    value: "vacuum cleaner",
    label: "Vacuum Cleaner",
  },
  {
    value: "maxi dress",
    label: "Maxi Dress",
  },
  {
    value: "hotel pillow",
    label: "Hotel Pillow",
  },
  {
    value: "tumeric tablets",
    label: "Tumeric Tablets",
  },
  {
    value: "makeup bundle",
    label: "Makeup Bundle",
  },
  {
    value: "bodysuit",
    label: "Bodysuit",
  },
  {
    value: "bikini set",
    label: "Bikini Set",
  },
  {
    value: "wideleg pants",
    label: "Wideleg Pants",
  },
  {
    value: "bath towels",
    label: "Bath Towels",
  },
  {
    value: "memory foam",
    label: "Memory Foam",
  },
  {
    value: "collagen powder",
    label: "Collagen Powder",
  },
  {
    value: "ruched sleeve blazers",
    label: "Ruched-Sleeve Blazers",
  },
  {
    value: "stripped dress",
    label: "Stripped Dress",
  },
  {
    value: "microfiber towels",
    label: "Microfiber Towels",
  },
  {
    value: "puma shoes",
    label: "Puma Shoes",
  },
  {
    value: "stretch jeans",
    label: "Stretch Jeans",
  },
  {
    value: "shilajit",
    label: "Shilajit",
  },
  {
    value: "office outfit",
    label: "Office Outfit",
  },
  {
    value: "biker jacket",
    label: "Biker Jacket",
  },
  {
    value: "portable monitor",
    label: "Portable Monitor",
  },
  {
    value: "trouser set",
    label: "Trouser Set",
  },
];

const GradientBlobs: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none blur-3xl">
    <div className="absolute w-72 h-72 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-50 top-10 left-10 animate-pulse"></div>
    <div className="absolute w-72 h-72 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full opacity-50 bottom-10 right-10 animate-pulse"></div>
  </div>
);

const ScriptGeneratorUI: React.FC = () => {
  const {
    productName,
    setProductName,
    productType,
    setProductType,
    website,
    setWebsite,
    description,
    setDescription,
    style,
    setStyle,
    outline,
    setOutline,
    isLoading,
    script,
    handleGenerate,
    handleDownload,
    handleCopy,
  } = useScriptGenerator();

  const [showInputCard, setShowInputCard] = useState(true);

  useEffect(() => {
    if (script) {
      setShowInputCard(false);
    }
  }, [script]);

  const renderScriptContent = () => {
    if (!script) return null;

    return Object.entries(script).map(([sectionKey, sectionContent], index, array) => {
      return (
        <div key={sectionKey}>
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="soft" className="text-xs">
              {index + 1}
            </Badge>
            <Heading size="5" className="capitalize">
              {sectionKey}
            </Heading>
          </div>
          <div className="pl-8">
            <Text className="text-base leading-relaxed whitespace-pre-wrap">
              {sectionContent}
            </Text>
          </div>
          {index < array.length - 1 && <Separator className="mt-6" />}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen max-h-fit bg-background text-foreground relative w-full overflow-x-hidden">
      <GradientBlobs />
      <main className="container relative z-10 flex flex-col w-full px-0 overflow-x-hidden">
        {showInputCard && (
          <div className="px-[54px] pr-12 py-7 flex flex-col">
            <div className="flex flex-col gap-2 mb-8">
              <Heading
                size="8"
                style={{
                  fontFeatureSettings: `'liga' 1, 'calt' 1`,
                }}
              >
                Script Generator
              </Heading>
              <Text color="gray">Generate Viral TikTok Shop Scripts With AI</Text>
            </div>

            <Card className="mb-10">
              <div className="p-6">
                <Heading size="6" className="mb-4">
                  Viral Script Generator
                </Heading>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField.Root>
                    <TextField.Input
                      placeholder="Product Name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </TextField.Root>
                  <TextField.Root>
                    <TextField.Input
                      placeholder="Product Type"
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                    />
                  </TextField.Root>

                  <TextField.Root>
                    <TextField.Input
                      placeholder="Website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </TextField.Root>
                  <Select.Root value={style} onValueChange={setStyle}>
                    <Select.Trigger>
                      {style || "Select style"}
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="UGC">UGC</Select.Item>
                      <Select.Item value="Controversial">
                        Controversial
                      </Select.Item>
                      <Select.Item value="Informative">Informative</Select.Item>
                      <Select.Item value="Humorous">Humorous</Select.Item>
                      <Select.Item value="Tutorials">Tutorials</Select.Item>
                      <Select.Item value="Duets">Duets</Select.Item>
                      <Select.Item value="Clickbait">Clickbait</Select.Item>
                      <Select.Item value="Story Telling">
                        Story Telling
                      </Select.Item>
                      <Select.Item value="Before & After">
                        Before & After
                      </Select.Item>
                      <Select.Item value="Review">Review</Select.Item>
                      <Select.Item value="Comment Reply">
                        Comment Reply
                      </Select.Item>
                      <Select.Item value="Interview">Interview</Select.Item>
                      <Select.Item value="AI">AI</Select.Item>
                      <Select.Item value="Fear Mongering">
                        Fear Mongering
                      </Select.Item>
                      <Select.Item value="Experiments">Experiments</Select.Item>
                      <Select.Item value="Discount & Sales">
                        Discount & Sales
                      </Select.Item>
                      <Select.Item value="Comparison">Comparison</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  <div className="md:col-span-2">
                    <TextArea
                      placeholder="Product Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-28"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TextArea
                      placeholder="Outline (Optional)"
                      value={outline}
                      onChange={(e) => setOutline(e.target.value)}
                      className="min-h-10"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="mt-4 w-full"
                  size="3"
                >
                  {isLoading ? "Generating..." : "Generate Script"}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {script && (
          <div className="w-full max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <Inset side="all" pb="current" className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <Heading size="6">Generated Script</Heading>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="ghost"
                        size="2"
                        onClick={handleCopy}
                        title="Copy script"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        <Text className="text-xs">Copy</Text>
                      </Button>
                      <Button
                        variant="ghost"
                        size="2"
                        onClick={handleDownload}
                        title="Download script"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        <Text className="text-xs">Download</Text>
                      </Button>
                    </div>
                  </div>
                  <Separator className="mb-6" />
                  <div className="space-y-8">{renderScriptContent()}</div>
                </Inset>
              </Card>
            </motion.div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ScriptGeneratorUI;

import { getModules } from "@/data/lessons";
import type { Metadata } from "next";
import CoursesClient from "./CoursesClient";

export const metadata: Metadata = {
  title: "The Creator Cult - The Ultimate Guide to TikTok Shop",
  description: "The Ultimate Guide to TikTok Shop",
};

export default async function Page() {
  let modules = await getModules();

  return <CoursesClient modules={modules} />;
}











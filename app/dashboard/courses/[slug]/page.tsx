import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LessonClient from "./LessonClient";
import { getLesson } from "@/data/lessons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  let lesson = await getLesson((await params).slug);

  return {
    title: `${lesson?.title} - The Creator Cult`,
    description: lesson?.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let slug = (await params).slug;
  let lesson = await getLesson(slug);

  if (!lesson) {
    notFound();
  }


  return (
    <LessonClient 
      lesson={lesson} 
    />
  );
}








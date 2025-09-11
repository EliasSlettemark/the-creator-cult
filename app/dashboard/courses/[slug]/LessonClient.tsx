"use client";

import { NextPageLink } from "@/components/next-page-link";
import TableOfContents from "@/components/table-of-contents";
import { Video } from "@/components/video-player";
import { CompletedIcon } from "@/icons/completed-icon";
import { PlayIcon } from "@/icons/play-icon";
import { type Lesson, type Module } from "@/data/lessons";
import { useState, useEffect } from "react";
import Link from "next/link";

interface LessonClientProps {
  lesson: Lesson & { module: Module; next: Lesson | null };
  contentHtml: React.ReactNode;
}

export default function LessonClient({
  lesson,
  contentHtml,
}: LessonClientProps) {
  const [completed, setCompleted] = useState(false);
  const [lessons, setLessons] = useState<Set<string>>(new Set());
  const [show, setShow] = useState(false);

  useEffect(() => {
    const lessonsData = localStorage.getItem("lessons");
    const lessonsArray = lessonsData
      ? (JSON.parse(lessonsData) as string[])
      : [];
    const lessons = new Set(lessonsArray);
    setLessons(lessons);
    setCompleted(lessons.has(lesson.id));
  }, [lesson.id]);

  const complete = () => {
    if (!completed) {
      const newLessonsArray = Array.from(lessons);
      newLessonsArray.push(lesson.id);
      const newLessons = new Set(newLessonsArray);
      setLessons(newLessons);
      setCompleted(true);
      localStorage.setItem("lessons", JSON.stringify(newLessonsArray));
      setShow(true);
    }
  };

  const handleVideoEnded = () => {
    complete();
  };

  return (
    <>
      <div className="w-full">
        <div className="w-full px-4">
          {lesson.video && (
            <div className="relative">
              <Video
                id="video"
                src={lesson.video.url || ""}
                onEnded={handleVideoEnded}
              />
              {completed && (
                <div className="absolute top-4 right-4 bg-white text-gray-950 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                  <CompletedIcon
                    className="fill-white"
                    width="16"
                    height="16"
                  />
                  COMPLETED
                </div>
              )}
            </div>
          )}
          
          <div className="py-10">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {lesson.title}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {lesson.description}
              </p>
              {!completed && (
                <button
                  onClick={complete}
                  className="mt-4 inline-flex items-center gap-x-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-100"
                >
                  <CompletedIcon
                    className="fill-white"
                    width="16"
                    height="16"
                  />
                  Mark as completed
                </button>
              )}
            </div>
            
            <div className="mt-16 border-t border-gray-200 pt-8 dark:border-white/10">
              {lesson.next && (
                <NextPageLink
                  title={lesson.next.title}
                  description={lesson.next.description}
                  href={`/dashboard/courses/${lesson.next.id}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="mb-4">
              <CompletedIcon
                className="fill-green-500 mx-auto"
                width="64"
                height="64"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-950 mb-2">
              Lesson completed!
            </h2>
            <p className="text-gray-950 mb-6">
              You&apos;ve completed{" "}
              <span className="font-semibold">&quot;{lesson.title}&quot;</span>.
              {lesson.next && " The next lesson is now unlocked."}
            </p>
            {lesson.next && (
              <Link
                href={`/dashboard/courses/${lesson.next.id}`}
                className="inline-flex items-center gap-x-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-100"
                onClick={() => setShow(false)}
              >
                <PlayIcon className="fill-gray-950" width="16" height="16" />
                Next Lesson
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { NextPageLink } from "@/components/next-page-link";
import { Video } from "@/components/video-player";
import { CompletedIcon } from "@/icons/completed-icon";
import { PlayIcon } from "@/icons/play-icon";
import { CloseIcon } from "@/icons/close-icon";
import { type Lesson, type Module } from "@/data/lessons";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LessonClientProps {
  lesson: Lesson & { module: Module; next: Lesson | null };
  contentHtml?: React.ReactNode;
}

export default function LessonClient({
  lesson,
  contentHtml,
}: LessonClientProps) {
  const [completed, setCompleted] = useState(false);
  const [lessons, setLessons] = useState<Set<string>>(new Set());
  const [show, setShow] = useState(false);
  const router = useRouter();

  const exit = () => {
    router.push("/dashboard/courses");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        exit();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
            <div className="relative mt-6">
              <div className="absolute top-4 left-4 z-10">
                <button
                  onClick={exit}
                  className="inline-flex items-center gap-x-2 rounded-full bg-black/50 backdrop-blur-sm px-3 py-2 text-sm font-semibold text-white hover:bg-black/70 transition-colors"
                  title="Exit lesson (Press Esc)"
                >
                  <CloseIcon
                    width="18"
                    height="18"
                    className="stroke-white"
                    strokeWidth={3}
                  />
                  Exit
                </button>
              </div>

              <Video
                id="video"
                src={lesson.video.url || ""}
                onEnded={handleVideoEnded}
              />
              {completed && (
                <div className="absolute top-4 right-4 bg-white text-gray-950 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                  <CompletedIcon
                    className="fill-gray-950"
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
              <div className="mt-4 flex items-center gap-4">
                {!completed && (
                  <button
                    onClick={complete}
                    className="inline-flex items-center gap-x-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <CompletedIcon
                      className="fill-white"
                      width="16"
                      height="16"
                    />
                    Mark as completed
                  </button>
                )}
                <button
                  onClick={exit}
                  className="inline-flex items-center gap-x-2 rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-950 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Back to Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="mb-4">
              <CompletedIcon
                className="fill-green-500 mx-auto"
                width="64"
                height="64"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-950 dark:text-white mb-2">
              Lesson completed!
            </h2>
            <p className="text-gray-950 dark:text-gray-100 mb-6">
              You&apos;ve completed{" "}
              <span className="font-semibold">&quot;{lesson.title}&quot;</span>.
              {lesson.next && " The next lesson is now unlocked."}
            </p>
            <div className="flex gap-3 justify-center">
              {lesson.next && (
                <Link
                  href={`/dashboard/courses/${lesson.next.id}`}
                  className="inline-flex items-center gap-x-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  onClick={() => setShow(false)}
                >
                  <PlayIcon className="fill-white" width="16" height="16" />
                  Next Lesson
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

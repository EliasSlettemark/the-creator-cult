"use client";

import { PageSection } from "@/components/page-section";
import { type Module, type Lesson } from "@/data/lessons";
import { BookIcon } from "@/icons/book-icon";
import { ClockIcon } from "@/icons/clock-icon";
import { LessonsIcon } from "@/icons/lessons-icon";
import { PlayIcon } from "@/icons/play-icon";
import { LockedIcon } from "@/icons/locked-icon";
import { CirclePlayIcon } from "@/icons/circle-play-icon";
import { CompletedIcon } from "@/icons/completed-icon";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

function formatDuration(seconds: number): string {
  let h = Math.floor(seconds / 3600);
  let m = Math.floor((seconds % 3600) / 60);

  return h > 0 ? (m > 0 ? `${h} hr ${m} min` : `${h} hr`) : `${m} min`;
}

interface CoursesClientProps {
  modules: Module[];
}

export default function CoursesClient({ modules }: CoursesClientProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );
  const [unlockedLessons, setUnlockedLessons] = useState<Set<string>>(
    new Set()
  );

  const lessons = useMemo(
    () => modules.flatMap(({ lessons }) => lessons),
    [modules]
  );
  const duration = useMemo(
    () => lessons.reduce((sum, { video }) => sum + (video?.duration ?? 0), 0),
    [lessons]
  );

  useEffect(() => {
    const completedData = localStorage.getItem("lessons");
    const lessonsArray = completedData
      ? (JSON.parse(completedData) as string[])
      : [];
    const completed = new Set(lessonsArray);

    setCompletedLessons(completed);

    const unlocked = new Set<string>();

    if (lessons.length > 0) {
      unlocked.add(lessons[0].id);
    }

    for (let i = 0; i < lessons.length - 1; i++) {
      if (completed.has(lessons[i].id)) {
        unlocked.add(lessons[i + 1].id);
      }
    }

    setUnlockedLessons(unlocked);
  }, [lessons]);

  const isLessonCompleted = (lessonId: string) =>
    completedLessons.has(lessonId);
  const isLessonUnlocked = (lessonId: string) => unlockedLessons.has(lessonId);

  const getNextUnlockedLesson = () => {
    return lessons.find(
      (lesson) =>
        unlockedLessons.has(lesson.id) && !completedLessons.has(lesson.id)
    );
  };

  const nextLesson = getNextUnlockedLesson();

  return (
    <div className="relative mx-auto max-w-7xl">
      <div className="absolute -inset-x-2 top-0 -z-10 h-80 overflow-hidden rounded-t-2xl mask-b-from-60% sm:h-88 md:h-112 lg:-inset-x-4 lg:h-128">
        <img
          alt=""
          src="https://assets.tailwindcss.com/templates/compass/hero-background.png"
          className="absolute inset-0 h-full w-full mask-l-from-60% object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 rounded-t-2xl outline-1 -outline-offset-1 outline-gray-950/10 dark:outline-white/10" />
      </div>
      <div className="mx-auto max-w-6xl">
        <div className="relative">
          <div className="px-4 pt-48 pb-12 lg:py-24">
            <h1 className="text-2xl/7 font-bold">The Creator Cult</h1>
            <p className="mt-7 max-w-lg text-base/7 text-pretty text-gray-600 dark:text-gray-400">
              The Ultimate Guide to TikTok Shop
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm/7 font-semibold text-gray-950 sm:gap-3 dark:text-white">
              <div className="flex items-center gap-1.5">
                <BookIcon
                  className="stroke-gray-950/40 dark:stroke-white/40"
                  width="20"
                  height="20"
                />
                {modules.length} modules
              </div>
              <span className="hidden text-gray-950/25 sm:inline dark:text-white/25">
                &middot;
              </span>
              <div className="flex items-center gap-1.5">
                <LessonsIcon
                  className="stroke-gray-950/40 dark:stroke-white/40"
                  width="20"
                  height="20"
                />
                {lessons.length} lessons
              </div>
              <span className="hidden text-gray-950/25 sm:inline dark:text-white/25">
                &middot;
              </span>
              <div className="flex items-center gap-1.5">
                <ClockIcon
                  className="stroke-gray-950/40 dark:stroke-white/40"
                  width="20"
                  height="20"
                />
                {formatDuration(duration)}
              </div>
              <span className="hidden text-gray-950/25 sm:inline dark:text-white/25">
                &middot;
              </span>
              <div className="flex items-center gap-1.5">
                <CompletedIcon
                  className="text-green-500"
                  width="20"
                  height="20"
                />
                {completedLessons.size}/{lessons.length} completed
              </div>
            </div>
            <div className="mt-10">
              {nextLesson ? (
                <Link
                  href={`/dashboard/courses/${nextLesson.id}`}
                  className="inline-flex items-center gap-x-2 rounded-full bg-gray-950 px-3 py-0.5 text-sm/7 font-semibold text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <PlayIcon className="fill-white" width="20" height="20" />
                  Continue learning
                </Link>
              ) : (
                <Link
                  href={`/dashboard/courses/${lessons[0].id}`}
                  className="inline-flex items-center gap-x-2 rounded-full bg-gray-950 px-3 py-0.5 text-sm/7 font-semibold text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <PlayIcon className="fill-white" width="20" height="20" />
                  Start the course
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-16 pb-10 sm:px-4">
            {modules.map((module: Module, moduleIndex: number) => (
              <PageSection key={module.id} id={module.id} title={module.module}>
                <div className="max-w-2xl">
                  <h2 className="text-2xl/7 font-medium tracking-tight text-pretty text-gray-950 dark:text-white">
                    {module.title}
                  </h2>
                  <p className="mt-4 text-base/7 text-gray-700 sm:text-sm/7 dark:text-gray-400">
                    {module.description}
                  </p>

                  <ol className="mt-6 space-y-4">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isCompleted = isLessonCompleted(lesson.id);
                      const isUnlocked = isLessonUnlocked(lesson.id);

                      return (
                        <li key={lesson.id} className="relative">
                          <ContentLink
                            title={lesson.title}
                            description={lesson.description}
                            href={`/dashboard/courses/${lesson.id}`}
                            type="video"
                            duration={lesson.video?.duration}
                            isLocked={!isUnlocked}
                            isCompleted={isCompleted}
                          />
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </PageSection>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentLink({
  title,
  description,
  href,
  type = "article",
  duration,
  isLocked = false,
  isCompleted = false,
}: {
  title: string;
  description: string;
  href: string;
  type?: "article" | "tool" | "video";
  duration?: number | null;
  isLocked?: boolean;
  isCompleted?: boolean;
}) {
  const formatDuration = (seconds: number): string => {
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const content = (
    <div
      className={`-mx-3 -my-2 flex gap-3 rounded-xl px-3 py-2 text-sm/7 transition-all duration-200 ${
        isLocked
          ? "cursor-not-allowed opacity-60"
          : "hover:bg-gray-950/4 dark:hover:bg-white/5"
      }`}
    >
      <div className="flex h-lh shrink items-center relative">
        {isCompleted ? (
          <CompletedIcon className="text-green-500" width="24" height="24" />
        ) : isLocked ? (
          <LockedIcon
            className="stroke-gray-400 dark:stroke-gray-500"
            width="24"
            height="24"
          />
        ) : (
          <CirclePlayIcon className="fill-gray-950 stroke-gray-950/40 dark:fill-white dark:stroke-white/40" />
        )}
      </div>
      <div className="flex-1">
        <div>
          <span
            className={`font-semibold ${
              isLocked
                ? "text-gray-400 dark:text-gray-500"
                : "text-gray-950 dark:text-white"
            }`}
          >
            {title}
          </span>
          {duration && (
            <>
              <span className="mx-2 hidden text-gray-950/25 sm:inline dark:text-white/25">
                &middot;
              </span>
              <span
                className={`hidden sm:inline ${
                  isLocked ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {formatDuration(duration)}
              </span>
            </>
          )}
        </div>
        <p
          className={`${
            isLocked
              ? "text-gray-400 dark:text-gray-500"
              : "text-gray-700 dark:text-gray-400"
          }`}
        >
          {description}
        </p>
        {duration && (
          <div
            className={`sm:hidden ${
              isLocked ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {formatDuration(duration)}
          </div>
        )}
      </div>
    </div>
  );

  if (isLocked) {
    return (
      <div
        className="flow-root group"
        title="Complete the previous lesson to unlock this one"
      >
        {content}
      </div>
    );
  }

  return (
    <div className="flow-root">
      <Link href={href}>{content}</Link>
    </div>
  );
}

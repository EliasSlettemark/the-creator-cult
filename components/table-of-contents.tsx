"use client";

import { useEffect, useState } from "react";

export default function TableOfContents({ contentId }: { contentId: string }) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    const content = document.getElementById(contentId);
    if (!content) return;

    // Get all h2 and h3 elements from the content
    const elements = content.querySelectorAll('h2, h3');
    const headingElements = Array.from(elements).map((element) => ({
      id: element.id,
      text: element.textContent || '',
      level: Number(element.tagName.charAt(1))
    }));

    setHeadings(headingElements);

    // Create intersection observer
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: '0px 0px -40% 0px',
      threshold: 1.0
    });

    // Observe all section headings
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [contentId]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-8" aria-label="Table of contents">
      <h2 className="text-sm font-medium text-gray-900 dark:text-white">
        On this page
      </h2>
      <ul className="mt-4 space-y-3 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{
              paddingLeft: `${(heading.level - 2) * 16}px`
            }}
          >
            <a
              href={`#${heading.id}`}
              className={`block text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white ${
                activeId === heading.id ? 'text-blue-600 dark:text-blue-400' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: 'smooth'
                });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

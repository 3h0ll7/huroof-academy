import { useEffect, useState } from "react";

export const useSectionObserver = (sectionIds: string[], initialSection?: string) => {
  const [activeSection, setActiveSection] = useState(initialSection ?? sectionIds[0] ?? "");

  useEffect(() => {
    if (!sectionIds.length || typeof window === "undefined") return;

    const elements: HTMLElement[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.45,
        rootMargin: "-10% 0px -30% 0px",
      },
    );

    const tryObserve = () => {
      sectionIds.forEach((id) => {
        const node = document.getElementById(id);
        if (node && !elements.includes(node)) {
          observer.observe(node);
          elements.push(node);
        }
      });
      return elements.length === sectionIds.length;
    };

    let resolved = tryObserve();
    let interval: number | undefined;

    if (!resolved) {
      interval = window.setInterval(() => {
        resolved = tryObserve();
        if (resolved && interval) {
          window.clearInterval(interval);
        }
      }, 500);
    }

    return () => {
      if (interval) window.clearInterval(interval);
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeSection;
};

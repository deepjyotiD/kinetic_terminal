"use client";

import { useEffect, useRef, useCallback } from "react";

export function useScrollAnimation(deps: unknown[] = []) {
  const ref = useRef<HTMLDivElement>(null);

  const observe = useCallback(() => {
    const el = ref.current;
    if (!el) return () => {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "50px 0px -20px 0px" }
    );

    // Small delay to ensure DOM is painted first
    const timer = setTimeout(() => {
      const animatedElements = el.querySelectorAll(
        ".scroll-fade-up, .scroll-fade-left, .scroll-fade-right, .scroll-scale-in, .stagger-children"
      );
      animatedElements.forEach((elem) => observer.observe(elem));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const cleanup = observe();
    return cleanup;
  }, [observe]);

  return ref;
}

export function useCountUp(
  end: number,
  duration: number = 2000,
  startOnVisible: boolean = true
) {
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const animate = () => {
      if (counted.current) return;
      counted.current = true;

      const start = 0;
      const startTime = performance.now();
      const suffix = el.dataset.suffix || "";

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * eased);

        if (end >= 1000) {
          const formatted =
            end >= 1000000
              ? (current / 1000000).toFixed(1) + "M"
              : (current / 1000).toFixed(1) + "k";
          el.textContent = formatted + suffix;
        } else {
          el.textContent = current.toString() + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    if (startOnVisible) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) animate();
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      animate();
    }
  }, [end, duration, startOnVisible]);

  return ref;
}

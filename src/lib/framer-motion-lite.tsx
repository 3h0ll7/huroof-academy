import type React from "react";
import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  MutableRefObject,
  ReactNode,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";

export type MotionStyle = React.CSSProperties;

type Transition = {
  duration?: number;
  delay?: number;
  ease?: string;
};

type Viewport = {
  once?: boolean;
  amount?: number;
};

type MotionProps<K extends keyof JSX.IntrinsicElements> = ComponentPropsWithoutRef<K> & {
  initial?: MotionStyle;
  animate?: MotionStyle;
  whileInView?: MotionStyle;
  transition?: Transition;
  viewport?: Viewport;
  as?: ElementType;
  children?: ReactNode;
};

const easeFallback = "cubic-bezier(0.22, 1, 0.36, 1)";

const mergeRefs = <T,>(...refs: (ForwardedRef<T> | undefined)[]) => {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as MutableRefObject<T | null>).current = node;
      }
    });
  };
};

const createMotionComponent = <K extends keyof HTMLElementTagNameMap>(tag: K) => {
  type Element = HTMLElementTagNameMap[K];

  const MotionComponent = forwardRef<Element, MotionProps<K>>(
    ({
      initial,
      animate,
      whileInView,
      transition,
      viewport,
      style,
      as,
      children,
      ...rest
    }, ref) => {
      const localRef = useRef<Element | null>(null);
      const [isInView, setIsInView] = useState(false);
      const [hasAnimated, setHasAnimated] = useState(false);

      useEffect(() => {
        const frame = requestAnimationFrame(() => setHasAnimated(true));
        return () => cancelAnimationFrame(frame);
      }, []);

      useEffect(() => {
        if (!whileInView || !localRef.current) return;

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setIsInView(true);
                if (viewport?.once ?? true) {
                  observer.disconnect();
                }
              } else if (!(viewport?.once ?? true)) {
                setIsInView(false);
              }
            });
          },
          { threshold: viewport?.amount ?? 0.35 },
        );

        observer.observe(localRef.current);
        return () => observer.disconnect();
      }, [viewport, whileInView]);

      const Component = (as || tag) as ElementType;

      const baseStyle: MotionStyle = {
        transition: `all ${transition?.duration ?? 0.8}s ${transition?.ease ?? easeFallback}`,
        transitionDelay: `${transition?.delay ?? 0}s`,
        willChange: "opacity, transform",
      };

      let stateStyle: MotionStyle | undefined = initial;

      if (whileInView) {
        stateStyle = isInView ? whileInView : initial;
      } else if (animate) {
        stateStyle = hasAnimated ? animate : initial;
      }

      return (
        <Component ref={mergeRefs(ref, localRef)} style={{ ...baseStyle, ...stateStyle, ...style }} {...rest}>
          {children}
        </Component>
      );
    },
  );

  MotionComponent.displayName = `Motion.${String(tag)}`;
  return MotionComponent;
};

export const motion = {
  div: createMotionComponent("div"),
  section: createMotionComponent("section"),
  header: createMotionComponent("header"),
  nav: createMotionComponent("nav"),
  img: createMotionComponent("img"),
  button: createMotionComponent("button"),
  span: createMotionComponent("span"),
  p: createMotionComponent("p"),
  h1: createMotionComponent("h1"),
  h2: createMotionComponent("h2"),
  ul: createMotionComponent("ul"),
  li: createMotionComponent("li"),
  aside: createMotionComponent("aside"),
  article: createMotionComponent("article"),
};

export const AnimatePresence = ({ children }: { children: ReactNode }) => <>{children}</>;

export const useScroll = () => {
  const [scrollYProgress, setScrollYProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollYProgress(Number(progress.toFixed(4)));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrollYProgress };
};

export const useTransform = (
  value: number,
  inputRange: [number, number],
  outputRange: [number, number],
) => {
  const [transformed, setTransformed] = useState(outputRange[0]);

  useEffect(() => {
    const [inMin, inMax] = inputRange;
    const [outMin, outMax] = outputRange;
    const clamped = Math.min(Math.max((value - inMin) / (inMax - inMin || 1), 0), 1);
    const mapped = outMin + (outMax - outMin) * clamped;
    setTransformed(mapped);
  }, [inputRange, outputRange, value]);

  return transformed;
};


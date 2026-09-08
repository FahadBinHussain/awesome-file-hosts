"use client";

import { useImperativeHandle } from "react";
import { motion, useAnimation, type Variants } from "motion/react";

const EASE = [0.4, 0, 0.2, 1] as const;

export type AnimatedIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};

type IconShellProps = {
  className?: string;
  size?: number;
  ref?: React.Ref<AnimatedIconHandle>;
  children: (controls: ReturnType<typeof useAnimation>) => React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "ref">;

function IconShell({ children, className, size = 28, ref, ...props }: IconShellProps) {
  const controls = useAnimation();

  useImperativeHandle(
    ref,
    () => ({
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    }),
    [controls]
  );

  return (
    <div
      className={className}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 256 256"
        fill="currentColor"
        style={{ overflow: "visible" }}
      >
        {children(controls)}
      </svg>
    </div>
  );
}

export type AnimatedFeatureIconProps = {
  className?: string;
  size?: number;
  ref?: React.Ref<AnimatedIconHandle>;
};

export function DatabaseIcon({ className, size, ref, ...props }: AnimatedFeatureIconProps) {
  return (
    <IconShell className={className} size={size} ref={ref} {...props}>
      {(controls) => (
        <>
          <motion.ellipse
            cx="128"
            cy="60"
            rx="80"
            ry="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            animate={controls}
            variants={{
              normal: { scaleX: 1, transition: { duration: 0.3, ease: EASE } },
              animate: { scaleX: [1, 1.08, 1], transition: { duration: 0.6, ease: EASE } },
            }}
            style={{ originX: "50%", originY: "50%" }}
          />
          <motion.path
            d="M208 60v136c0 15.46-35.82 28-80 28s-80-12.54-80-28V60"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            animate={controls}
            variants={{
              normal: { pathLength: 1, transition: { duration: 0.3, ease: EASE } },
              animate: { pathLength: [0, 1], transition: { duration: 0.8, ease: EASE } },
            }}
          />
          <motion.path
            d="M208 128c0 15.46-35.82 28-80 28s-80-12.54-80-28"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            animate={controls}
            variants={{
              normal: { opacity: 1, transition: { duration: 0.3, ease: EASE } },
              animate: { opacity: [1, 0.3, 1], transition: { duration: 0.8, ease: EASE } },
            }}
          />
        </>
      )}
    </IconShell>
  );
}

export function ShieldCheckIcon({ className, size, ref, ...props }: AnimatedFeatureIconProps) {
  return (
    <IconShell className={className} size={size} ref={ref} {...props}>
      {(controls) => (
        <>
          <motion.path
            d="M208 40v60c0 60-40.79 88.66-76.13 104.05a8 8 0 0 1-5.74 0C90.79 188.66 50 160 50 100V40a8 8 0 0 1 8-8h142a8 8 0 0 1 8 8Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={controls}
            variants={{
              normal: { scale: 1, transition: { duration: 0.3, ease: EASE } },
              animate: { scale: [1, 1.08, 1], transition: { duration: 0.5, ease: EASE } },
            }}
            style={{ originX: "50%", originY: "50%" }}
          />
          <motion.path
            d="m96 124 22 22 44-44"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={controls}
            variants={{
              normal: { pathLength: 1, opacity: 1, transition: { duration: 0.3, ease: EASE } },
              animate: {
                pathLength: [0, 1],
                opacity: [0, 1],
                transition: { duration: 0.5, delay: 0.1, ease: EASE },
              },
            }}
          />
        </>
      )}
    </IconShell>
  );
}

export function LockIcon({ className, size, ref, ...props }: AnimatedFeatureIconProps) {
  const shackle: Variants = {
    normal: { y: 0, rotate: 0, transition: { duration: 0.3, ease: EASE } },
    animate: {
      y: [0, -4, 0, 0],
      rotate: [0, -8, 6, 0],
      transition: { duration: 0.7, ease: "easeInOut" },
    },
  };
  return (
    <IconShell className={className} size={size} ref={ref} {...props}>
      {(controls) => (
        <>
          <motion.rect
            x="48"
            y="104"
            width="160"
            height="104"
            rx="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            animate={controls}
            variants={{
              normal: { rotate: 0, transition: { duration: 0.3, ease: EASE } },
              animate: { rotate: [0, -3, 3, 0], transition: { duration: 0.7, ease: "easeInOut" } },
            }}
            style={{ originX: "50%", originY: "100%" }}
          />
          <motion.path
            d="M88 104V72a40 40 0 0 1 80 0v32"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            animate={controls}
            variants={shackle}
            style={{ originX: "50%", originY: "100%" }}
          />
          <motion.circle
            cx="128"
            cy="156"
            r="12"
            animate={controls}
            variants={{
              normal: { scale: 1, transition: { duration: 0.3, ease: EASE } },
              animate: { scale: [1, 1.3, 1], transition: { duration: 0.7, ease: "easeInOut" } },
            }}
            style={{ originX: "50%", originY: "50%" }}
          />
        </>
      )}
    </IconShell>
  );
}

export function MagnifyingGlassIcon({ className, size, ref, ...props }: AnimatedFeatureIconProps) {
  const wander: Variants = {
    normal: { x: 0, y: 0, transition: { duration: 0.3, ease: EASE } },
    animate: {
      x: [0, 5, 5, 0, 0, -5, -5, 0],
      y: [0, 0, 5, 5, 0, 0, -5, 0],
      transition: { duration: 0.9, ease: "easeInOut" },
    },
  };
  return (
    <IconShell className={className} size={size} ref={ref} {...props}>
      {(controls) => (
        <>
          <motion.circle
            cx="108"
            cy="108"
            r="64"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            animate={controls}
            variants={wander}
          />
          <motion.line
            x1="156"
            y1="156"
            x2="216"
            y2="216"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            animate={controls}
            variants={wander}
          />
        </>
      )}
    </IconShell>
  );
}

export function CodeIcon({ className, size, ref, ...props }: AnimatedFeatureIconProps) {
  return (
    <IconShell className={className} size={size} ref={ref} {...props}>
      {(controls) => (
        <>
          <motion.polyline
            points="88 64 24 128 88 192"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={controls}
            variants={{
              normal: { x: 0, transition: { duration: 0.3, ease: EASE } },
              animate: { x: [-4, 2, -4], transition: { duration: 0.7, ease: "easeInOut" } },
            }}
          />
          <motion.polyline
            points="168 64 232 128 168 192"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={controls}
            variants={{
              normal: { x: 0, transition: { duration: 0.3, ease: EASE } },
              animate: { x: [4, -2, 4], transition: { duration: 0.7, ease: "easeInOut" } },
            }}
          />
          <motion.line
            x1="144"
            y1="40"
            x2="112"
            y2="216"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            animate={controls}
            variants={{
              normal: { opacity: 1, transition: { duration: 0.3, ease: EASE } },
              animate: { opacity: [1, 0.4, 1], transition: { duration: 0.7, ease: "easeInOut" } },
            }}
          />
        </>
      )}
    </IconShell>
  );
}

export function GitBranchIcon({ className, size, ref, ...props }: AnimatedFeatureIconProps) {
  return (
    <IconShell className={className} size={size} ref={ref} {...props}>
      {(controls) => (
        <>
          <motion.circle
            cx="64"
            cy="72"
            r="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            animate={controls}
            variants={{
              normal: { scale: 1, transition: { duration: 0.3, ease: EASE } },
              animate: { scale: [1, 1.2, 1], transition: { duration: 0.6, ease: EASE } },
            }}
            style={{ originX: "50%", originY: "50%" }}
          />
          <motion.circle
            cx="64"
            cy="184"
            r="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            animate={controls}
            variants={{
              normal: { scale: 1, transition: { duration: 0.3, ease: EASE } },
              animate: { scale: [1, 1.2, 1], transition: { duration: 0.6, delay: 0.1, ease: EASE } },
            }}
            style={{ originX: "50%", originY: "50%" }}
          />
          <motion.circle
            cx="192"
            cy="88"
            r="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            animate={controls}
            variants={{
              normal: { scale: 1, transition: { duration: 0.3, ease: EASE } },
              animate: { scale: [1, 1.2, 1], transition: { duration: 0.6, delay: 0.2, ease: EASE } },
            }}
            style={{ originX: "50%", originY: "50%" }}
          />
          <motion.path
            d="M64 96v64"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            animate={controls}
            variants={{
              normal: { pathLength: 1, transition: { duration: 0.3, ease: EASE } },
              animate: { pathLength: [0, 1], transition: { duration: 0.5, ease: EASE } },
            }}
          />
          <motion.path
            d="M88 88c0 40 56 24 80 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            animate={controls}
            variants={{
              normal: { pathLength: 1, transition: { duration: 0.3, ease: EASE } },
              animate: { pathLength: [0, 1], transition: { duration: 0.6, delay: 0.15, ease: EASE } },
            }}
          />
        </>
      )}
    </IconShell>
  );
}

export function FileTextIcon({ className, size, ref, ...props }: AnimatedFeatureIconProps) {
  return (
    <IconShell className={className} size={size} ref={ref} {...props}>
      {(controls) => (
        <>
          <motion.path
            d="M200 96v96a16 16 0 0 1-16 16H72a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h64l64 64Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={controls}
            variants={{
              normal: { scale: 1, transition: { duration: 0.3, ease: EASE } },
              animate: { scale: [1, 1.05, 1], transition: { duration: 0.5, ease: EASE } },
            }}
            style={{ originX: "50%", originY: "50%" }}
          />
          <motion.polyline
            points="136 32 136 96 200 96"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={controls}
            variants={{
              normal: { opacity: 1, transition: { duration: 0.3, ease: EASE } },
              animate: { opacity: [1, 0.4, 1], transition: { duration: 0.5, ease: EASE } },
            }}
          />
          <motion.line
            x1="96"
            y1="136"
            x2="160"
            y2="136"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            animate={controls}
            variants={{
              normal: { scaleX: 1, transition: { duration: 0.3, ease: EASE } },
              animate: { scaleX: [1, 0.7, 1], transition: { duration: 0.6, ease: EASE } },
            }}
            style={{ originX: "50%", originY: "50%" }}
          />
          <motion.line
            x1="96"
            y1="168"
            x2="160"
            y2="168"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            animate={controls}
            variants={{
              normal: { scaleX: 1, transition: { duration: 0.3, ease: EASE } },
              animate: { scaleX: [1, 0.7, 1], transition: { duration: 0.6, delay: 0.1, ease: EASE } },
            }}
            style={{ originX: "50%", originY: "50%" }}
          />
        </>
      )}
    </IconShell>
  );
}

export function CheckCircleIcon({ className, size, ref, ...props }: AnimatedFeatureIconProps) {
  return (
    <IconShell className={className} size={size} ref={ref} {...props}>
      {(controls) => (
        <>
          <motion.circle
            cx="128"
            cy="128"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            animate={controls}
            variants={{
              normal: { scale: 1, transition: { duration: 0.3, ease: EASE } },
              animate: { scale: [1, 1.08, 1], transition: { duration: 0.5, ease: EASE } },
            }}
            style={{ originX: "50%", originY: "50%" }}
          />
          <motion.polyline
            points="84 132 112 160 172 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={controls}
            variants={{
              normal: { pathLength: 1, opacity: 1, transition: { duration: 0.3, ease: EASE } },
              animate: {
                pathLength: [0, 1],
                opacity: [0, 1],
                transition: { duration: 0.5, ease: EASE },
              },
            }}
          />
        </>
      )}
    </IconShell>
  );
}

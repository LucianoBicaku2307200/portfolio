"use client";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { HTMLAttributes, PropsWithChildren, useRef } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const Timeline: React.FC<PropsWithChildren<Props>> = ({
  className = "",
  children,
  ...props
}) => {
  const card = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: card,
    offset: ["end end", "start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  let maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };
  console.log(opacity);
  return (
    <motion.div
      onMouseMove={onMouseMove}
      ref={card}
      style={{ opacity }}
      className={`overflow-hidden relative border rounded-xl hover:bg-zinc-800/10 group md:gap-8 hover:border-zinc-400/50 border-zinc-600 bg-gradient-to-tl from-black/10 to-black/0 ${className}`}
    >
      <div className="pointer-events-none">
        <div className="absolute inset-0 z-0  transition duration-1000 [mask-image:linear-gradient(black,transparent)]" />
        <motion.div
          className="absolute inset-0 z-10  bg-gradient-to-br opacity-100  via-zinc-100/10  transition duration-1000 group-hover:opacity-50"
          style={style}
        />
        <motion.div
          className="absolute inset-0 z-10 opacity-0 mix-blend-overlay transition duration-1000 group-hover:opacity-100"
          style={style}
        />
      </div>

      {children}
    </motion.div>
  );
};

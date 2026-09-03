import { chakra, Text, useStyleConfig } from "@chakra-ui/react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import type { AnimationPlaybackControls, MotionStyle, PanInfo } from "motion/react";
import type { StackImageData } from "../data/images";

const MotionListItem = motion(chakra.li);
const MotionFlipper = motion(chakra.div);
const MotionDim = motion(chakra.span);

const VISIBLE_DEPTH = 4;
const SCALE_STEP = 0.05;
const Y_STEP = 14;
const DISMISS_DISTANCE = 100;
const DISMISS_VELOCITY = 500;
const REST_TILT = 7;
const DRAG_ROTATE_PER_PX = 0.03;
const WIGGLE_DELAY_MS = 5400;
const WIGGLE_REPEAT_MS = 8400;

type StackImageProps = {
  image: StackImageData;
  index: number;
  currentIndex: number;
  totalImages: number;
  isExiting: boolean;
  wiggleHint: boolean;
  onNext: () => void;
  onExitComplete: () => void;
};

function restTiltForIndex(index: number) {
  const n = Math.sin((index + 1) * 12.9898) * 43758.5453;
  return (n - Math.floor(n)) * 2 * REST_TILT - REST_TILT;
}

function toHandle(alt: string) {
  return `@${alt.replace(/\s+\d+$/, "").toLowerCase()}`;
}

export function StackImage({
  image,
  index,
  currentIndex,
  totalImages,
  isExiting,
  wiggleHint,
  onNext,
  onExitComplete,
}: StackImageProps) {
  const itemStyles = useStyleConfig("StackImage");
  const flipperStyles = useStyleConfig("StackImageFlipper");
  const faceStyles = useStyleConfig("StackImageFace");
  const backStyles = useStyleConfig("StackImageBack");
  const handleStyles = useStyleConfig("StackImageHandle");
  const dimStyles = useStyleConfig("StackImageDim");
  const photoStyles = useStyleConfig("StackImagePhoto");
  const x = useMotionValue(0);
  const restRotate = useMemo(() => restTiltForIndex(index), [index]);
  const rotate = useTransform(x, (value) => restRotate + value * DRAG_ROTATE_PER_PX);
  const handle = useMemo(() => toHandle(image.alt), [image.alt]);
  const exiting = useRef(false);
  const dragging = useRef(false);
  const wiggleAnim = useRef<AnimationPlaybackControls | null>(null);
  const [exitSettled, setExitSettled] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const offset = (index - currentIndex + totalImages) % totalImages;
  const isTop = offset === 0 && !isExiting;
  const isVisible = offset < VISIBLE_DEPTH;
  const isSettling = !isExiting && !exitSettled;
  const show = (isExiting || isVisible) && !isSettling;
  const scale = isExiting ? 1 : 1 - offset * SCALE_STEP;
  const y = isExiting ? 0 : offset * Y_STEP;
  const shade = isExiting || isTop ? 0 : Math.min(0.72, 0.45 + (offset - 1) * 0.14);

  useLayoutEffect(() => {
    if (!isExiting && !exitSettled) {
      x.set(0);
      setExitSettled(true);
    }
  }, [isExiting, exitSettled, x]);

  useEffect(() => {
    if (!isTop) {
      setFlipped(false);
    }
  }, [isTop]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!isTop || !wiggleHint || prefersReducedMotion) {
      return;
    }

    let cancelled = false;
    let delayId = 0;

    const runWiggle = async () => {
      if (cancelled || dragging.current || exiting.current) {
        return;
      }
      x.set(18);
      const controls = animate(x, 0, {
        type: "spring",
        stiffness: 900,
        damping: 11,
      });
      wiggleAnim.current = controls;
      await controls;
    };

    const schedule = (ms: number) => {
      delayId = window.setTimeout(() => {
        void runWiggle().then(() => {
          if (!cancelled) {
            schedule(WIGGLE_REPEAT_MS);
          }
        });
      }, ms);
    };

    schedule(WIGGLE_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(delayId);
      wiggleAnim.current?.stop();
      wiggleAnim.current = null;
    };
  }, [isTop, wiggleHint, prefersReducedMotion, x]);

  const stopWiggle = () => {
    wiggleAnim.current?.stop();
    wiggleAnim.current = null;
  };

  const onDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    dragging.current = false;
    if (!isTop || exiting.current) {
      return;
    }

    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;
    const shouldDismiss =
      Math.abs(offsetX) > DISMISS_DISTANCE || Math.abs(velocityX) > DISMISS_VELOCITY;

    if (shouldDismiss) {
      const direction = (Math.abs(offsetX) > 8 ? offsetX : velocityX) > 0 ? 1 : -1;
      const flyDistance = Math.max(
        typeof window === "undefined" ? 700 : window.innerWidth * 1.35,
        700,
      );
      exiting.current = true;
      setExitSettled(false);
      onNext();
      void animate(x, direction * flyDistance, {
        type: "spring",
        stiffness: 400,
        damping: 40,
      }).then(() => {
        exiting.current = false;
        onExitComplete();
      });
      return;
    }

    void animate(x, 0, { type: "spring", stiffness: 600, damping: 30 });
  };

  return (
    <MotionListItem
      __css={itemStyles}
      data-testid={isTop ? "top-card" : undefined}
      data-offset={offset}
      data-alt={image.alt}
      data-flipped={flipped ? "true" : "false"}
      style={
        {
          x,
          rotate,
          zIndex: isExiting ? totalImages + 1 : totalImages - offset,
          pointerEvents: isTop ? "auto" : "none",
          visibility: show ? "visible" : "hidden",
          "--ratio": image.ratio,
        } as MotionStyle
      }
      initial={{
        scale: 1 - (offset + 1) * SCALE_STEP,
        y: (offset + 1) * Y_STEP,
        opacity: 0,
      }}
      animate={{
        scale,
        y,
        opacity: show ? 1 : 0,
      }}
      transition={{
        scale: { type: "spring", stiffness: 320, damping: 32 },
        y: { type: "spring", stiffness: 320, damping: 32 },
        opacity: show ? { type: "spring", stiffness: 320, damping: 32 } : { duration: 0 },
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      dragMomentum={false}
      whileTap={isTop ? { scale: scale * 0.98 } : undefined}
      onDragStart={() => {
        dragging.current = true;
        stopWiggle();
      }}
      onDragEnd={onDragEnd}
      onTap={() => {
        if (!isTop || exiting.current || Math.abs(x.get()) > 10) {
          return;
        }
        stopWiggle();
        setFlipped((value) => !value);
      }}
      onContextMenu={(event: ReactMouseEvent) => event.preventDefault()}
    >
      <MotionFlipper
        __css={flipperStyles}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 420, damping: 28 }
        }
      >
        <chakra.div __css={faceStyles} aria-hidden={flipped}>
          <chakra.img
            __css={photoStyles}
            src={image.src}
            alt={image.alt}
            draggable={false}
            decoding={isTop ? "sync" : "async"}
          />
          <MotionDim
            __css={dimStyles}
            aria-hidden
            animate={{ opacity: shade }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          />
        </chakra.div>
        <chakra.div __css={backStyles} aria-hidden={!flipped}>
          <Text sx={handleStyles}>{handle}</Text>
        </chakra.div>
      </MotionFlipper>
    </MotionListItem>
  );
}

import { chakra, useStyleConfig } from "@chakra-ui/react";
import { useRef, useState } from "react";
import type { StackImageData } from "../data/images";
import { StackImage } from "./StackImage";

type CardStackProps = {
  images: StackImageData[];
};

function nextAvailableIndex(from: number, total: number, exiting: ReadonlySet<number>) {
  let next = (from + 1) % total;
  for (let i = 0; i < total; i += 1) {
    if (!exiting.has(next)) {
      return next;
    }
    next = (next + 1) % total;
  }
  return next;
}

export function CardStack({ images }: CardStackProps) {
  const styles = useStyleConfig("CardStack");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasSwiped, setHasSwiped] = useState(false);
  const [exitingIndexes, setExitingIndexes] = useState<Set<number>>(() => new Set());
  const exitingRef = useRef(exitingIndexes);

  const handleNext = (index: number) => {
    setHasSwiped(true);
    exitingRef.current = new Set(exitingRef.current);
    exitingRef.current.add(index);
    setExitingIndexes(exitingRef.current);
    setCurrentIndex((value) => nextAvailableIndex(value, images.length, exitingRef.current));
  };

  const handleExitComplete = (index: number) => {
    exitingRef.current = new Set(exitingRef.current);
    exitingRef.current.delete(index);
    setExitingIndexes(exitingRef.current);
  };

  return (
    <chakra.ul __css={styles} data-testid="card-stack" aria-label="Photo stack">
      {images.map((image, index) => (
        <StackImage
          key={image.src}
          image={image}
          index={index}
          currentIndex={currentIndex}
          totalImages={images.length}
          isExiting={exitingIndexes.has(index)}
          wiggleHint={!hasSwiped}
          onNext={() => handleNext(index)}
          onExitComplete={() => handleExitComplete(index)}
        />
      ))}
    </chakra.ul>
  );
}

import { useEffect, useState } from "react";

export function useImagesReady(primarySrc: string, preloadSrcs: string[]): boolean {
  const [ready, setReady] = useState(false);
  const preloadKey = preloadSrcs.join("\0");

  useEffect(() => {
    let cancelled = false;
    const extras = preloadKey.length > 0 ? preloadKey.split("\0") : [];

    const decodePrimary = async () => {
      const image = new Image();
      image.src = primarySrc;
      try {
        await image.decode();
      } catch {
        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject();
        }).catch(() => undefined);
      }
      if (!cancelled) {
        setReady(true);
      }
    };

    void decodePrimary();

    for (const src of extras) {
      const image = new Image();
      image.src = src;
    }

    return () => {
      cancelled = true;
    };
  }, [primarySrc, preloadKey]);

  return ready;
}

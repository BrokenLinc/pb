import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const colorModeConfig: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config: colorModeConfig,
  colors: {
    brand: {
      500: "#0078D4",
      600: "#005A9E",
      800: "#00365F",
      900: "#002A4A",
    },
    charcoal: {
      900: "#1A1A1A",
    },
  },
  fonts: {
    serif: `Georgia, "Times New Roman", serif`,
  },
  radii: {
    card: "14px",
  },
  shadows: {
    card: "0 36px 90px rgba(0, 20, 40, 0.65), 0 14px 36px rgba(0, 42, 74, 0.5)",
  },
  styles: {
    global: {
      "html, body, #root": {
        height: "100dvh",
        width: "100%",
        m: 0,
        overflow: "hidden",
        overscrollBehavior: "none",
        touchAction: "none",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
        WebkitUserSelect: "none",
        bg: "brand.500",
        color: "whiteAlpha.900",
      },
      body: {
        position: "fixed",
        inset: 0,
      },
      img: {
        display: "block",
        WebkitUserDrag: "none",
        userSelect: "none",
        pointerEvents: "none",
      },
    },
  },
  components: {
    CardStack: {
      baseStyle: {
        position: "relative",
        display: "grid",
        placeItems: "center",
        flex: "1 1 auto",
        alignSelf: "stretch",
        w: "100%",
        minW: 0,
        minH: 0,
        m: 0,
        p: 0,
        listStyleType: "none",
        touchAction: "none",
        containerType: "size",
      },
    },
    StackImage: {
      baseStyle: {
        position: "relative",
        gridArea: "1 / 1",
        m: 0,
        p: 0,
        w: "min(90cqw, calc(90cqh * var(--ratio)))",
        h: "min(90cqh, calc(90cqw / var(--ratio)))",
        touchAction: "none",
        transformOrigin: "center center",
        willChange: "transform",
        bg: "transparent",
        perspective: "1400px",
      },
    },
    StackImageFlipper: {
      baseStyle: {
        position: "relative",
        w: "100%",
        h: "100%",
        borderRadius: "card",
        boxShadow: "card",
        transformStyle: "preserve-3d",
        WebkitTransformStyle: "preserve-3d",
      },
    },
    StackImageFace: {
      baseStyle: {
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        borderRadius: "card",
        bg: "brand.600",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      },
    },
    StackImageBack: {
      baseStyle: {
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        borderRadius: "card",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        bg: "charcoal.900",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 6,
        transform: "rotateY(180deg)",
      },
    },
    StackImageHandle: {
      baseStyle: {
        color: "white",
        fontFamily: "serif",
        fontStyle: "italic",
        fontWeight: "normal",
        fontSize: { base: "2xl", md: "4xl" },
        letterSpacing: "0.02em",
        textAlign: "center",
        userSelect: "none",
      },
    },
    StackImageDim: {
      baseStyle: {
        position: "absolute",
        inset: 0,
        bg: "brand.500",
        pointerEvents: "none",
      },
    },
    StackImagePhoto: {
      baseStyle: {
        display: "block",
        w: "100%",
        h: "100%",
        objectFit: "cover",
        pointerEvents: "none",
        userSelect: "none",
        WebkitUserDrag: "none",
      },
    },
  },
});

export default theme;

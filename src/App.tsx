import { Box, HStack, Text } from "@chakra-ui/react";
import { faHand } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { CardStack } from "./components/CardStack";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { images } from "./data/images";
import { useImagesReady } from "./hooks/useImagesReady";

export default function App() {
  const preloadSrcs = useMemo(
    () => images.slice(1, 3).map((image) => image.src),
    [],
  );
  const ready = useImagesReady(images[0]?.src ?? "", preloadSrcs);

  return (
    <Box
      as="main"
      position="fixed"
      inset={0}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={6}
      w="100%"
      px={{ base: 3, md: 6 }}
      pt="max(16px, env(safe-area-inset-top))"
      pb="max(16px, env(safe-area-inset-bottom))"
      bg="brand.500"
    >
      {!ready && <LoadingOverlay />}
      {ready && images.length > 0 && <CardStack images={images} />}
      {ready && (
        <HStack
          as="p"
          spacing={2}
          color="whiteAlpha.700"
          fontSize="sm"
          textAlign="center"
        >
          <FontAwesomeIcon icon={faHand} />
          <Text as="span">Swipe the top photo left or right.</Text>
        </HStack>
      )}
    </Box>
  );
}

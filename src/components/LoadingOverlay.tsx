import { Box, Text } from "@chakra-ui/react";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react";

const MotionSpinner = motion(Box);

export function LoadingOverlay() {
  return (
    <Box
      data-testid="loading-overlay"
      position="fixed"
      inset={0}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={4}
      bg="brand.500"
      zIndex={20}
    >
      <MotionSpinner
        w="36px"
        h="36px"
        display="grid"
        placeItems="center"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
      >
        <FontAwesomeIcon icon={faCircle} size="2x" />
      </MotionSpinner>
      <Text color="whiteAlpha.700" fontSize="sm">
        Loading photos
      </Text>
    </Box>
  );
}

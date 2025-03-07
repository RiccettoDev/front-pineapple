import { Button } from "@chakra-ui/react";

interface OverlayProps{
    closeModal: any
}

export default function Overlay({ closeModal }: OverlayProps) {
  return (
    <Button
      w="100%"
      h="100%"
      bg="rgba(0, 0, 0, 0.5)"
      position="fixed"
      top={0}
      left={0}
      zIndex={1400}
      _hover={'none'}
      onClick={() => closeModal()}
    />
  );
}
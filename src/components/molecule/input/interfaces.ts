import { FlexProps, InputProps } from "@chakra-ui/react";

export interface MoleculeInputProps extends InputProps {
  error?: string | false;
  iconColor?: string;
  label?: string;
  leftIcon?: any;
}

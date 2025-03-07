import { ElementType } from "react";
import { TextareaProps } from "@chakra-ui/react";

export interface MLTextAreaProps extends TextareaProps {
  label?: string;
  error?: any;
  leftIcon?: ElementType;
}

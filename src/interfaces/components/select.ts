import { ElementType } from "react";
import { SelectProps } from "@chakra-ui/react";

export interface OptionsProps {
  value: any;
  label: string;
}

export interface MLSelectProps extends SelectProps {
  value: any;
  label?: string;
  error?: string | boolean;
  options: OptionsProps[];
  Multiple?: boolean;
  leftIcon?: ElementType;
  onChange: any;
  placeholder?: string;
  creatable?: boolean;
  isDisabled?: boolean;
}

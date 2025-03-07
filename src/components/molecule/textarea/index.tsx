import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Icon,
  Textarea,
} from "@chakra-ui/react";

import { MLTextAreaProps } from "interfaces/components/textarea";

const MLTextArea: React.FC<MLTextAreaProps> = ({
  label,
  leftIcon = null,
  name,
  borderColor = "gray.100",
  error,
  value,
  onChange,
  onBlur,
  ...rest
}) => {
  return (
    <FormControl isInvalid={error}>
      {!!label && (
        <FormLabel color="gray.50" fontSize="14px">
          {label}
        </FormLabel>
      )}

      <InputGroup>
        {!!leftIcon && (
          <InputLeftElement
            pointerEvents="none"
            children={<Icon as={leftIcon} />}
          />
        )}

        <Textarea
          name={name}
          fontSize="16px"
          borderWidth={2}
          borderColor={borderColor}
          bgColor="transparent"
          size="lg"
          focusBorderColor="primary"
          cursor="text"
          variant="filled"
          value={value}
          _hover={{ bg: "gray.secondary" }}
          onChange={onChange}
          onBlur={onBlur}
          {...rest}
        />
      </InputGroup>

      {error && <FormErrorMessage fontSize="13px">{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default MLTextArea;

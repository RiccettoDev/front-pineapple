"use client";
import {
  Input as ChakraInput,
  FormControl,
  FormLabel,
  Icon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text
} from "@chakra-ui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { MoleculeInputProps } from "./interfaces";

export default function MLInput({
  label,
  leftIcon,
  type,
  name,
  borderColor = "gray.100",
  error,
  value,
  onChange,
  onBlur,
  isRequired,
  ...rest
}: MoleculeInputProps) {
  const [seePass, setSeePass] = useState(false);

  return (
    <FormControl>
      {!!label && (
        <FormLabel color="#b9fa3c" display="flex">
          <Text
            fontFamily="Montserrat"
            fontSize="13px" 
            fontWeight="400"
            lineHeight={"16px"}
          >
            {label} 
            {isRequired && <Text as="span" color="red"> *</Text>}
          </Text>
        </FormLabel>
      )}

      <InputGroup>
        {!!leftIcon && (
          <InputLeftElement mt="1" children={<Icon as={leftIcon} />} />
        )}

        <ChakraInput
          name={name}
          borderWidth={2}
          fontSize="15px"
          borderColor={error ? "red" : borderColor}
          bgColor="transparent"
          size="lg"
          focusBorderColor="primary"
          cursor="text"
          variant="filled"
          value={value}
          _hover={{ bg: "gray.secondary" }}
          type={seePass ? "text" : type}
          onChange={onChange}
          onBlur={onBlur}
          {...rest}
        />

        {type === "password" && (
          <InputRightElement
            h="100%"
            pointerEvents="fill"
            cursor="pointer"
            onClick={() => setSeePass(!seePass)}
            children={<Icon as={seePass ? EyeIcon : EyeSlashIcon} />}
            _hover={{ color: "#E3E3E3" }}
          />
        )}
      </InputGroup>

      {error && (
        <Text fontSize="13px" color="red">
          {error}
        </Text>
      )}
    </FormControl>
  );
}

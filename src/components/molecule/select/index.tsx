"use client";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import ReactSelect from "react-select";
import CreatableSelect from "react-select/creatable";

import { theme } from "@chakra-ui/react";
import { colors } from "providers/chakra.provider";
import { MLSelectProps } from "interfaces/components/select";

const MLSelectInput: React.FC<MLSelectProps> = ({
  label,
  leftIcon = null,
  error,
  options = [],
  name,
  onChange,
  value,
  Multiple = false,
  placeholder = "Selecione...",
  creatable = false,
  isDisabled = false,
}) => {
  let doc: any = typeof document !== "undefined" ? document : {};

  const colourStyles: any = {
    container: () => ({ width: "100%" }),
    control: (styles: any, { isDisabled }: any) => ({
      ...styles,
      backgroundColor: isDisabled ? theme.colors.gray[50] : "white",
      // color: 'white',
      borderColor: error ? "red" : theme.colors.gray[100],
      boxShadow: "none",
      borderRadius: 5,
      borderWidth: 2,
      minHeight: 48,
      cursor: isDisabled ? "not-allowed" : "pointer",

      ":hover": {
        ...styles[":hover"],
        borderColor: colors.primary,
      },

      ":focus": {
        ...styles[":focus"],
        outline: "none",
        outlineWidth: 0,
      },
      ":active": {
        ...styles[":active"],
        borderColor: colors.primary,
      },
    }),
    option: (styles: any, { isDisabled, isSelected }: any) => {
      return {
        ...styles,
        backgroundColor: isSelected && theme.colors.gray[100],
        color: theme.colors.gray[900],
        cursor: isDisabled ? "not-allowed" : "default",
        ":active": {
          ...styles[":active"],
          backgroundColor: theme.colors.gray[800],
        },
        ":hover": {
          ...styles[":hover"],
          backgroundColor: theme.colors.gray[50],
        },
        ":focus": {
          ...styles[":focus"],
        },
      };
    },
    input: (styles: any) => ({
      ...styles,
      color: theme.colors.gray[900],

      ":focus": {
        ...styles[":focus"],
        outline: "none",
        outlineWidth: 0,
        borderColor: colors.primary,
      },
    }),
    singleValue: (styles: any) => ({
      ...styles,
      color: theme.colors.gray[900],
    }),

    menuList: (styles: any) => ({
      ...styles,
      backgroundColor: "white",
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  };

  return (
    <FormControl isInvalid={!!error}>
      {!!label && (
        <FormLabel color="gray.900" fontSize="15px">
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

        {Multiple ? (
          creatable ? (
            <CreatableSelect
              isDisabled={isDisabled}
              isMulti
              formatCreateLabel={(userValue) => `Criar: ${userValue}`}
              name={name}
              options={options}
              styles={colourStyles}
              noOptionsMessage={() => "Comece a digitar para um novo item"}
              placeholder={placeholder}
              onChange={(e: any) => onChange(name, e)}
              value={value}
            />
          ) : (
            <ReactSelect
              isDisabled={isDisabled}
              isMulti
              name={name}
              options={options}
              styles={colourStyles}
              noOptionsMessage={() => "Nada encontrado"}
              placeholder={placeholder}
              onChange={(e: any) => onChange(name, e)}
              value={value}
            />
          )
        ) : (
          <ReactSelect
            menuPortalTarget={doc.body}
            isDisabled={isDisabled}
            name={name}
            options={options}
            styles={colourStyles}
            noOptionsMessage={() => "Nada encontrado"}
            placeholder={placeholder}
            onChange={(e: any) => onChange(name, e.value)}
            value={value}
          />
        )}
      </InputGroup>

      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default MLSelectInput;

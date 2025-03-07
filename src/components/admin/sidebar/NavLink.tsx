"use client";
import { Flex, Icon, LinkProps, Text } from "@chakra-ui/react";
import { ElementType } from "react";

import { useSidebarNav } from "contexts/sidebar.context";
import { ActiveLink } from "./ActiveLink";

interface NavLinkProps extends LinkProps {
  icon: ElementType;
  children: string;
  href: string;
  shouldMatchExactHref?: boolean;
  isWideVersion: boolean;
  isWideVersionToVisible: boolean | any;
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon,
  children,
  shouldMatchExactHref = false,
  isWideVersion,
  isWideVersionToVisible,
}) => {
  const { isOpen, togglePanel } = useSidebarNav();
  return (
    <ActiveLink
      onClick={() => (!isWideVersionToVisible ? togglePanel() : {})}
      href={href}
      passHref
      shouldMatchExactHref={shouldMatchExactHref}
    >
      <Flex
        cursor="pointer"
        outline="none"
        p="3"
        borderRadius="8"
        _hover={{
          bg: "#b9fa3c",
          color: "#0c0c32", // Altera a cor do texto e ícone ao passar o mouse
        }}
        color={"#b9fa3c"}
      >
        <Icon as={icon} fontSize="20" />
        <Text
          ml="4"
          fontWeight="extrabold"
          fontSize="14px"
          color="inherit" // Herda a cor do Flex (para respeitar o hover)
        >
          {children}
        </Text>
      </Flex>
    </ActiveLink>
  );
};

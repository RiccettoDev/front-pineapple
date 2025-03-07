"use client";
import { Flex, Stack } from "@chakra-ui/react";

import Nav from "assets/config/nav-admin";
import { useAuth } from "contexts/auth.context";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

import { MdAdminPanelSettings } from "react-icons/md";

interface SidebarNavProps {
  isWideVersion: boolean | any;
  isWideVersionToVisible: boolean | any;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  isWideVersion,
  isWideVersionToVisible,
}) => {
  const { user } = useAuth();

  return (
    <Stack spacing={["2", "2", "12"]} align="flex-start">
      {/* {navConfig[user?.role || 1]?.map((section: any) => ( */}
      {Nav.map((section: any) => (
        <NavSection
          key={section.key}
          title={section.title}
          isWideVersion={isWideVersion}
        >
          <Stack>
            {section.items.map(({ key, href, icon, title, ...rest }: any) => (
              <NavLink
                _focus={{ boxShadow: "none" }}
                key={key}
                href={href}
                icon={icon}
                shouldMatchExactHref={rest.shouldMatchExactHref}
                isWideVersion={isWideVersion}
                isWideVersionToVisible={isWideVersionToVisible}
              >
                {title}
              </NavLink>
            ))}
          </Stack>
          <Flex mt={'4em'}>
              <Stack>
                  <NavLink
                    _focus={{ boxShadow: "none" }}
                    href={"/home"}
                    icon={MdAdminPanelSettings}
                    isWideVersion={isWideVersion}
                    isWideVersionToVisible={isWideVersionToVisible}
                  >
                    Voltar à Home
                  </NavLink>
              </Stack>
            </Flex>
        </NavSection>
      ))}
    </Stack>
  );
};

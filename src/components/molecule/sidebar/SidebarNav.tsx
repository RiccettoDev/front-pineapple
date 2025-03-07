"use client";
import { Button, Flex, Stack } from "@chakra-ui/react";

import { Nav } from "assets/config";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

import { useAuth } from "contexts/auth.context";
import { useSidebarNav } from "contexts/sidebar.context";
import { IoMenu } from "react-icons/io5";
import { MdAdminPanelSettings } from "react-icons/md";

interface SidebarNavProps {
  isWideVersion: boolean | any;
  isWideVersionToVisible: boolean | any;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  isWideVersion,
  isWideVersionToVisible,
}) => {

  const { user, me } = useAuth();
  const { togglePanel } = useSidebarNav();

  return (
    <Stack spacing={["2", "2", "12"]} align="flex-start">

        <Flex w={'100%'} mb={'4em'} p={4} display={{base:'flex', lg:'none'}}>
          <Button
            onClick={togglePanel}
            display={{base: 'flex', sm: 'none'}}
            bg={'#b9fa3c'}
          >
            <IoMenu />
          </Button>
        </Flex>
  
      {/* {navConfig[user?.role || 1]?.((section: any) => ( */}
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
          {user?.role === 9 || user?.role === 'admin' && (
            <Flex mt={'4em'}>
              <Stack>
                  <NavLink
                    _focus={{ boxShadow: "none" }}
                    href={"/dashboard"}
                    icon={MdAdminPanelSettings}
                    isWideVersion={isWideVersion}
                    isWideVersionToVisible={isWideVersionToVisible}
                  >
                    Painel Admin
                  </NavLink>
              </Stack>
            </Flex>
          )}
        </NavSection>
      ))}
    </Stack>
  );
};

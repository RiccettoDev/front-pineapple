"use client";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon
} from "@heroicons/react/24/solid";
import { IoMenu } from "react-icons/io5";

import { AuthContext } from "contexts/auth.context";
import { useSidebarNav } from "contexts/sidebar.context";
import { useContext } from "react";
import Logo from "/public/logo.png";

export default function MLHeader() {
  const { togglePanel } = useSidebarNav();
  const { user, logout } = useContext(AuthContext);
  let isWideVersion = useBreakpointValue({ base: false, md: true });

  return (
    <Flex
      bg="#0c0c32"
      alignItems="center"
      justifyContent="space-between"
      p="4"
      borderBottomWidth={2}
      borderBottomColor="gray.50"
      height={{base:"10vh", sm:"15vh"}}
      overflowY={'hidden'}
    >
      <HStack zIndex={500} >
        <Button
          onClick={togglePanel}
          display={{base: 'flex', sm: 'none'}}
          bg={'#b9fa3c'}
        >
          <IoMenu />
        </Button>
        <Box display={{base: 'none', sm: 'flex'}}>
          <Image width={{base:"100px", sm:"150px"}} alignSelf="center" src={Logo.src} alt="logo" />
        </Box>
        <Flex ml={4}>
          <Text color={'#FFD700'} fontSize={{base:"2xl", sm:"4xl"}} fontWeight={"extrabold"}>Pineapple</Text>
          <Text color={'#b9fa3c'} fontSize={{base:"2xl", sm:"4xl"}} fontWeight={"extrabold"}>Soccer</Text>
        </Flex>
      </HStack>

      <HStack spacing="24px">
        <Menu>
          <MenuButton
            backgroundColor="transparent"
            color="gray.40"
            fontWeight="500"
            fontSize="14px"
            _hover={{ borderColor: "primary" }}
            _active={{ borderColor: "primaryDark" }}
            _expanded={{ bg: "transparent", borderColor: "primary" }}
          >
            {isWideVersion ? (
              <HStack spacing="10px">
                <Avatar size="sm" name={user?.name} src={user?.avatar} />
                <Text color={'white'}>{user?.name || "-"}</Text>
                <Icon as={ChevronDownIcon} color="primary" />
              </HStack>
            ) : (
              <Avatar size="sm" name={user?.name} src={user?.avatar} />
            )}
          </MenuButton>
          <MenuList zIndex={99999} bg="#b9fa3c" borderColor="#b9fa3c">
            <MenuItem
              bg={"b9fa3c"}
              onClick={logout}
              _focus={{ bg: "b9fa3c" }}
              _hover={{ bg: "b9fa3c" }}
            >
              <Flex alignItems={"center"}>
                <Icon
                  mr="2"
                  as={ArrowLeftOnRectangleIcon}
                  color="#0c0c32"
                  fontSize="25px"
                />
                <Text fontSize="14px" color={"#0c0c32"} fontWeight={"extrabold"}>Sair</Text>
              </Flex>
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
}

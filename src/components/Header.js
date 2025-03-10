import { Flex, Tabs, Text, Link } from "@chakra-ui/react";
import { LiaCheckSquareSolid, LiaUserSolid } from "react-icons/lia";
import { AiFillFolderOpen } from "react-icons/ai";
import { useState, useEffect } from "react";
import HeaderMenuItem from "./HeaderMenuItem";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5); // Adjust scroll threshold as needed
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Flex
      as="header"
      direction="column"
      position="relative"
      width="100%"
      zIndex="1000"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p="0 3rem"
        // bg="white"
        boxShadow={isScrolled ? "sm" : "none"}
        position={isScrolled ? "relative" : "relative"}
        top="0"
      >
        <Text fontSize="5xl" fontWeight="bold" color="teal">
          R
        </Text>
        <Tabs.Root
          defaultValue="members"
          variant={isScrolled ? "enclosed" : "line"}
          colorScheme="green"
          size="lg"
          isFitted
          align="center"
          bg="grey.900"
          position={isScrolled ? "Fixed" : "stikcy"}
          top={isScrolled ? "1rem" : "auto"}
          left={isScrolled ? "31rem" : "auto"}
          zIndex="999"
          colorPalette="teal"
        >
          <Tabs.List>
            <Tabs.Trigger value="members">
              <LiaUserSolid />
              <Link unstyled href="#members">
                Members
              </Link>
            </Tabs.Trigger>
            <Tabs.Trigger value="projects">
              <AiFillFolderOpen />
              <Link unstyled href="#projects">
                Projects
              </Link>
            </Tabs.Trigger>
            <Tabs.Trigger value="tasks">
              <LiaCheckSquareSolid />
              <Link unstyled href="#work">
                Work
              </Link>
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        <Text>Login</Text>
      </Flex>
    </Flex>
  );
};

export default Header;

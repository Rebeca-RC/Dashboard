import { Link, Icon, Flex } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const HeaderMenuItem = ({ url, children, icon }) => {
  return (
    <Link
      as={RouterLink}
      to={url}
      fontSize="sm"
      fontWeight="semibold"
      letterSpacing="wide"
      textTransform="uppercase"
      mr="5"
      gap="1"
      display="flex"
      alignItems="center"
      color="whiteAlpha.800"
      mt={{ base: "2", md: "0" }}
      _hover={{ textDecor: "none", color: "whiteAlpha.500" }}
    >
      <Icon as={icon} ml="1" w="4" h="4" />
      {children}
    </Link>
  );
};

export default HeaderMenuItem;

import React from "react";
import { Box, Text, Heading, SimpleGrid } from "@chakra-ui/react";

const networkingData = [
  {
    title: "Primary Targets",
    color: "blue.100",
    items: [
      "Florida-based Healthcare CEOs (current: 23)",
      "Healthcare CFOs at mid-cap public companies (current: 23)",
      "Healthcare Board Members (current: 37)",
      "Executive recruiters specializing in healthcare C-suite",
    ],
  },
  {
    title: "Leverage Current Network",
    color: "green.100",
    items: [
      "Use 339 Healthcare CEO connections for warm intros",
      "Engage existing CTOs (155) for insights on target companies",
      "Connect with Florida network (67) for regional opportunities",
      "Request direct introductions to key decision-makers",
    ],
  },
  {
    title: "Growth Targets",
    color: "yellow.100",
    items: [
      "Add 25+ Florida healthcare CEOs/board members",
      "Connect with 20+ CFOs at target companies",
      "Identify 15+ healthcare private equity partners",
      "Connect with healthcare-focused executive recruiters",
    ],
  },
];

const StrategicNetworking = () => {
  return (
    <Box w="100%" p={6} bg="gray.100">
      <Box
        maxW="80%"
        mx="200px"
        p={4}
        bg="gray.50"
        color={"black"}
        fontFamily="Poppins"
        borderRadius="xl"
        boxShadow="xs"
      >
        <Heading as="h2" size="2xl" mb={8} textAlign="center">
          Strategic Networking Priorities
        </Heading>
        <SimpleGrid columns={[1, 3]} spacing={4}>
          {networkingData.map((section, index) => (
            <Box
              w="90%"
              key={index}
              bg={section.color}
              borderRadius="xl"
              p={4}
              // boxShadow="xs"
            >
              <Heading as="h3" size="md" mb={2}>
                {section.title}
              </Heading>
              {section.items.map((item, i) => (
                <Text key={i} fontSize="sm" mb={1}>
                  • {item}
                </Text>
              ))}
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default StrategicNetworking;

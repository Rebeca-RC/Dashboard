import React, { useEffect, useState } from "react";
import { Box, Text, Heading, SimpleGrid } from "@chakra-ui/react";

const DecisionMakerCards = () => {
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const spreadsheetId = "10R5dQ7M0ZgWfCoSbJH8Vpjj9YuOUN9kR6wvp-x6jkTs";
      const apiKey = "AIzaSyAr_f5eejQ5v9rm5TrVo_C5TFWOZlIi48o";
      const sheetName = localStorage.getItem("userSheet") || "Sheet1";

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;

      try {
        const response = await fetch(url);
        const result = await response.json();

        if (result.values) {
          const processedData = processSheetData(result.values);
          setData(processedData.cards);
          setTotalRows(processedData.totalValidRows);
        } else {
          console.warn("No values found in sheet.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const validPositions = [
    "Chief Executive Officer",
    "Chief Technology Officer",
    "Chief Information Officer",
    "Chief Financial Officer",
    "Board Member",
    "Director",
    "Vice President",
  ];

  const processSheetData = (values) => {
    if (values.length < 2) {
      console.warn("Sheet contains no valid data.");
      return { cards: [], totalValidRows: 0 };
    }

    const headers = values[0];
    const positionIndex = headers.indexOf("Position");

    if (positionIndex === -1) {
      console.error("Position column not found.");
      return { cards: [], totalValidRows: 0 };
    }

    const positionCounts = {};
    let othersCount = 0;
    let totalValidRows = 0;

    values.slice(1).forEach((row) => {
      const position = row[positionIndex]?.trim();
      if (!position) return;

      let matched = false;

      validPositions.forEach((validPosition) => {
        if (position.includes(validPosition)) {
          positionCounts[validPosition] =
            (positionCounts[validPosition] || 0) + 1;
          matched = true;
        }
      });

      if (!matched) {
        othersCount += 1;
      }

      totalValidRows += 1;
    });

    if (totalValidRows === 0) {
      console.warn("Total valid rows are zero.");
    }

    let cards = Object.keys(positionCounts)
      .map((title, index) => ({
        title,
        count: positionCounts[title],
        percentage: ((positionCounts[title] / totalValidRows) * 100).toFixed(1),
        color: [
          "blue.100",
          "green.100",
          "yellow.100",
          "purple.100",
          "teal.100",
          "red.100",
        ][index % 6],
      }))
      .sort((a, b) => b.percentage - a.percentage) // Sort descending by percentage
      .slice(0, 4); // Keep only top 4 categories

    // Add "Others" as the last item if applicable
    if (othersCount > 0) {
      cards.push({
        title: "Others",
        count: othersCount,
        percentage: ((othersCount / totalValidRows) * 100).toFixed(1),
        color: "gray.200",
      });
    }

    return { cards, totalValidRows };
  };

  return (
    <Box w="100%" p={4} bg="gray.100">
      <Box
        maxW="100%"
        mx="auto"
        p={4}
        color={"black"}
        bg={"white"}
        borderRadius="md"
        boxShadow="xs"
        fontFamily="Poppins"
        fontWeight="500"
      >
        <Heading
          as="h2"
          size="2xl"
          mb={3}
          fontFamily="Poppins"
          fontWeight="500"
        >
          Decision Makers
        </Heading>
        <Text mb={4} fontFamily="Poppins" fontWeight="500">
          <strong>Total Connections:</strong> {totalRows}
        </Text>

        <SimpleGrid columns={[1, 5]} spacing={4}>
          {data.map((card, index) => (
            <Box
              w="240px"
              key={index}
              bg={card.color}
              borderRadius="md"
              p={4}
              boxShadow="1px 1px 3px rgba(0,0,0,0.2)"
              textAlign="Start"
              color="black"
              fontFamily="Poppins"
              fontWeight="500"
            >
              <Heading as="h3" size="md">
                {card.title}
              </Heading>
              <Text fontSize="2xl" fontWeight="bold">
                {card.percentage}%
              </Text>
              <Text fontSize="sm">{card.count} profiles</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default DecisionMakerCards;

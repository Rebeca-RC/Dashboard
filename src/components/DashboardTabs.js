import React, { useState, useEffect, useMemo } from "react";
import { Box, Button, Flex, Grid } from "@chakra-ui/react";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState("Executive Roles");
  const [chartData, setChartData] = useState({
    pie: [],
    bar: [],
    industryPie: [],
  });
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [filteredBarData, setFilteredBarData] = useState([]);
  const [industryCounts, setIndustryCounts] = useState({});
  const [industryPositionCounts, setIndustryPositionCounts] = useState({});

  const validPositions = useMemo(
    () => [
      "Chief Executive Officer",
      "Chief Technology Officer",
      "Chief Information Officer",
      "Chief Financial Officer",
      "Board Member",
      "Director",
      "Vice President",
      "Other",
    ],
    []
  );

  const positionShortNames = {
    "Chief Executive Officer": "CEO",
    "Chief Technology Officer": "CTO",
    "Chief Information Officer": "CIO",
    "Chief Financial Officer": "CFO",
    "Board Member": "BM",
    Director: "Dir",
    "Vice President": "VP",
    Other: "Other",
  };

  useEffect(() => {
    const fetchData = async () => {
      const spreadsheetId = "10R5dQ7M0ZgWfCoSbJH8Vpjj9YuOUN9kR6wvp-x6jkTs";
      const apiKey = "AIzaSyAr_f5eejQ5v9rm5TrVo_C5TFWOZlIi48o";
      const sheetName = localStorage.getItem("userSheet");

      if (!sheetName) {
        console.warn("No sheet name found in local storage.");
        return;
      }

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.values) {
          processSheetData(data.values);
        } else {
          console.warn("No values in sheet data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const processSheetData = (values) => {
    if (values.length < 2) {
      console.warn("Sheet contains no valid data.");
      return;
    }

    const headers = values[0];
    const positionIndex = headers.indexOf("Position");
    const industryIndex = headers.indexOf("Industry");

    if (positionIndex === -1 || industryIndex === -1) {
      console.error("Required columns not found.");
      return;
    }

    const positionCounts = {};
    const industryCountsTemp = {};
    const industryPositionCountsTemp = {};

    values.slice(1).forEach((row) => {
      const position = row[positionIndex]?.trim();
      const industry = row[industryIndex]?.trim();

      if (industry) {
        industryCountsTemp[industry] = (industryCountsTemp[industry] || 0) + 1;

        if (!industryPositionCountsTemp[industry]) {
          industryPositionCountsTemp[industry] = {};
        }

        validPositions.forEach((validPosition) => {
          if (position && position.includes(validPosition)) {
            positionCounts[validPosition] =
              (positionCounts[validPosition] || 0) + 1;
            industryPositionCountsTemp[industry][validPosition] =
              (industryPositionCountsTemp[industry][validPosition] || 0) + 1;
          }
        });
      }
    });

    // Ensure every valid position has a count (even if zero)
    Object.keys(industryPositionCountsTemp).forEach((industry) => {
      validPositions.forEach((position) => {
        if (!industryPositionCountsTemp[industry][position]) {
          industryPositionCountsTemp[industry][position] = 0;
        }
      });
    });

    // Set the first industry as default
    const firstIndustry = Object.keys(industryCountsTemp)[0] || null;
    setSelectedIndustry(firstIndustry);

    // Initialize filtered bar data
    if (firstIndustry) {
      setFilteredBarData([
        {
          type: "bar",
          name: firstIndustry,
          showInLegend: true,
          dataPoints: validPositions.map((position) => ({
            label: position,
            y: industryPositionCountsTemp[firstIndustry]?.[position] || 0,
          })),
        },
      ]);
    }

    // Update state with fixed charts
    setIndustryCounts(industryCountsTemp);
    setIndustryPositionCounts(industryPositionCountsTemp);

    setChartData({
      pie: [
        {
          type: "pie",
          name: "Executive Roles",
          showInLegend: true,
          legendText: "{name}",
          dataPoints: Object.entries(positionCounts).map(
            ([position, count]) => ({
              label: positionShortNames[position] || position, // Short name fallback
              y: count,
              name: positionShortNames[position] || position,
            })
          ),
        },
      ],
      industryPie: [
        {
          type: "pie",
          name: "Industry",
          showInLegend: true,
          legendText: "{name}",
          dataPoints: Object.entries(industryCountsTemp).map(
            ([industry, count]) => ({
              label: industry,
              y: count,
              name: industry,
              click: (e) => handleIndustryClick(e.dataPoint.name), // Ensure click works
            })
          ),
        },
      ],
      bar: Object.keys(industryPositionCountsTemp).map((industry) => ({
        type: "bar",
        name: industry,

        showInLegend: true,
        dataPoints: validPositions.map((position) => ({
          label: positionShortNames[position] || position, // Use short labels
          y: industryPositionCountsTemp[industry]?.[position] || 0,
        })),
      })),
    });
  };
  const handleIndustryClick = (industry) => {
    console.log("Clicked Industry:", industry);
    console.log("Industry Position Data:", industryPositionCounts[industry]);

    setSelectedIndustry(industry);

    if (!industryPositionCounts[industry]) {
      console.warn(`No data available for ${industry}`);
      setFilteredBarData([]); // Prevent blank chart
      return;
    }

    // Correcting bar chart values to match the industryPie chart
    setFilteredBarData([
      {
        type: "bar",
        name: industry,
        showInLegend: true,
        legendText: "{name}",
        color: "#0089FF",
        dataPoints: Object.entries(industryPositionCounts[industry]).map(
          ([position, count]) => ({
            label: position,
            y: count, // Ensure correct mapping
          })
        ),
      },
    ]);
  };

  useEffect(() => {
    if (selectedIndustry && industryPositionCounts[selectedIndustry]) {
      setFilteredBarData([
        {
          type: "bar",
          name: "Number of Connections",
          color: "#0089FF",
          showInLegend: true,
          dataPoints: validPositions.map((position) => ({
            label: positionShortNames[position] || position,
            y: industryPositionCounts[selectedIndustry]?.[position] || 0,
          })),
        },
      ]);
    }
  }, [selectedIndustry, industryPositionCounts]);

  return (
    <Box w="100%" p={4} bg="gray.100">
      <Flex
        w="65%"
        gap={4}
        mb={4}
        justify="center"
        align="center"
        bgColor="gray.200"
        p={2}
        mx="auto" // Centers the Flex horizontally within Box
        display="flex"
        borderRadius="xl"
      >
        {["Executive Roles", "Industry Analysis"].map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            bg={activeTab === tab ? "white" : "gray.200"}
            color="black"
            borderRadius={activeTab === tab ? "xl" : "none"}
            w="65vh"
          >
            {tab}
          </Button>
        ))}
      </Flex>

      {activeTab === "Executive Roles" && (
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <Box p={4} boxShadow="md" borderRadius="md" bg="white">
            <CanvasJSChart
              options={{
                animationEnabled: true,
                title: {
                  text: "Executive Role Distribution",
                  fontSize: 18,
                  fontFamily: "Poppins",
                  fontWeight: "500",
                },
                data: chartData.pie,
              }}
            />
          </Box>
          <Box p={4} boxShadow="md" borderRadius="md" bg="white">
            <CanvasJSChart
              options={{
                animationEnabled: true,
                title: {
                  text: "Executives by Industry & Position",
                  fontSize: 18,
                  fontFamily: "Poppins",
                  fontWeight: "500",
                },
                data: chartData.bar,
              }}
            />
          </Box>
        </Grid>
      )}

      {activeTab === "Industry Analysis" && (
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <Box p={4} boxShadow="md" borderRadius="md" bg="white">
            <CanvasJSChart
              options={{
                animationEnabled: true,
                title: {
                  text: "Connections by Industry ",
                  fontSize: 18,
                  fontFamily: "Poppins",
                  fontWeight: "500",
                },
                data: chartData.industryPie,
              }}
            />
          </Box>

          {selectedIndustry && (
            <Box p={4} boxShadow="md" borderRadius="md" bg="white">
              <CanvasJSChart
                key={selectedIndustry} // Forces re-render when industry changes
                options={{
                  animationEnabled: true,
                  title: {
                    text: `${selectedIndustry} Positions`,
                    fontSize: 18,
                    fontFamily: "Poppins",
                    fontWeight: "500",
                  },
                  data: filteredBarData,
                }}
              />
            </Box>
          )}
        </Grid>
      )}

      {/* {activeTab === "Target Connections" && (
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {selectedIndustry && (
            <Box p={4} boxShadow="md" borderRadius="md" bg="white">
              <CanvasJSChart
                key={selectedIndustry} // Forces re-render when industry changes
                options={{
                  animationEnabled: true,
                  title: {
                    text: `${selectedIndustry} Positions`,
                    fontSize: 18,
                  },
                  data: filteredBarData,
                }}
              />
            </Box>
          )}
        </Grid>
      )} */}
    </Box>
  );
};

export default DashboardTabs;

import React, { useEffect, useState } from "react";
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import CanvasJSReact from "@canvasjs/react-charts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../index.css";
import moment from "moment";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [selectedRange, setSelectedRange] = useState("today");
  const [requestsSentTotal, setRequestsSentTotal] = useState(0);
  const [acceptedRequestsTotal, setAcceptedRequestsTotal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const spreadsheetId = "10R5dQ7M0ZgWfCoSbJH8Vpjj9YuOUN9kR6wvp-x6jkTs";
        const apiKey = "AIzaSyAr_f5eejQ5v9rm5TrVo_C5TFWOZlIi48o";
        const sheetName = localStorage.getItem("userSheet"); // Change this if your sheet has a different name
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        console.log("Raw API Response:", data);

        const rows = data.values;
        if (!rows || rows.length === 0) return;

        const headers = rows[0]; // First row contains headers
        let previousRow = {};

        const cleanedData = rows.slice(1).map((row) => {
          const values = headers.reduce((obj, header, index) => {
            obj[header.trim()] = row[index]
              ? row[index].trim()
              : previousRow[header.trim()];
            return obj;
          }, {});

          previousRow = values; // Store previous row for missing values handling

          return {
            date: values["Date"],
            position: values["Position"] || "",
            industry: values["Industry"] || "",
          };
        });

        setData(cleanedData.filter((item) => item.date));
      } catch (error) {
        console.error("Error fetching or parsing data:", error);
      }
    };

    fetchData();
  }, []);

  const filterDataByRange = (data) => {
    const today = new Date();
    let filteredData = [];

    if (selectedRange === "today") {
      filteredData = data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate.toDateString() === today.toDateString();
      });
    } else if (selectedRange === "weekly") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
      startOfWeek.setHours(0, 0, 0, 0);

      filteredData = data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startOfWeek && itemDate <= today;
      });
    } else if (selectedRange === "monthly") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);

      filteredData = data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startOfMonth && itemDate <= today;
      });
    }

    return filteredData;
  };

  useEffect(() => {
    const filteredData = filterDataByRange(data);

    let totalRequestsSent = 0;
    let totalAcceptedRequests = 0;

    const uniqueDates = new Set(); // Track unique dates

    filteredData.forEach((item) => {
      if (!uniqueDates.has(item.date)) {
        totalRequestsSent += item.requestsSent || 0; // Add requestsSent once per unique date
        uniqueDates.add(item.date);
      }
      totalAcceptedRequests += item.acceptedRequests || 0; // Sum acceptedRequests always
    });

    console.log("Total Requests Sent:", totalRequestsSent);
    console.log("Total Accepted Requests:", totalAcceptedRequests);

    setRequestsSentTotal(totalRequestsSent);
    setAcceptedRequestsTotal(totalAcceptedRequests);
  }, [selectedRange, data]);

  const filteredData = filterDataByRange(data);

  const processData = () => {
    const processedData = [];

    filteredData.forEach((item) => {
      const existingItem = processedData.find(
        (entry) => entry.date === item.date
      );
      if (existingItem) {
        existingItem.requestsSent = item.requestsSent;
        existingItem.acceptedRequests = item.acceptedRequests;
        existingItem.totalAccepted = item.totalAccepted;

        if (item.position === "ceo") {
          existingItem.ceo = item.acceptedRequests;
        } else if (item.position === "vp") {
          existingItem.vp = item.acceptedRequests;
        } else if (item.position === "svp") {
          existingItem.svp = item.acceptedRequests;
        }
      } else {
        processedData.push({
          date: item.date,
          requestsSent: item.requestsSent,
          acceptedRequests: item.acceptedRequests,
          ceo: item.position === "ceo" ? item.acceptedRequests : 0,
          vp: item.position === "vp" ? item.acceptedRequests : 0,
          svp: item.position === "svp" ? item.acceptedRequests : 0,
          totalAccepted: item.totalAccepted,
        });
      }
    });

    return processedData;
  };

  const processedData = processData();
  console.log(processedData);
  const pieData = [
    { label: "CEO", y: processedData.reduce((sum, item) => sum + item.ceo, 0) },
    { label: "VP", y: processedData.reduce((sum, item) => sum + item.vp, 0) },
    { label: "SVP", y: processedData.reduce((sum, item) => sum + item.svp, 0) },
  ];

  const formatXAxisLabel = (selectedRange, date) => {
    if (selectedRange === "weekly") {
      return moment(date, "DD-MM-YYYY").format("ddd"); // Example: "Mon", "Tue"
    }
    if (selectedRange === "monthly") {
      const weekNumber = Math.ceil(moment(date, "DD-MM-YYYY").date() / 7); // Get week number
      return `${weekNumber} Week`; // Example: "1st Week", "2nd Week"
    }
    return date; // Default case: return the date as it is
  };

  // Processed data transformation
  const lineData = processedData.map((item) => ({
    label: formatXAxisLabel(selectedRange, item.date), // Format X-axis labels
    y: item.requestsSent,
  }));

  return (
    <>
      <Heading
        mb={2}
        size="4xl"
        textAlign="center"
        color="white"
        fontWeight="400"
        backgroundColor="#1A1A1A"
        padding={2}
        backdropBlur={10}
      >
        LinkedIn Connection Dashboard
      </Heading>
      <Flex
        direction="column"
        gap={3}
        fontFamily={"poppins"}
        padding="30px "
        borderRadius="20px 20px 0 0"
        backgroundColor="#F1F1F1"
      >
        {/* Dropdown Menu for Time Range */}
        <Flex justifyContent="start" gap={3} padding="0 30px 0 30px">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            style={{
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "16px",
              backgroundColor: "white",
              color: "black",
              _hover: { borderColor: "gray" },
            }}
          >
            <option value="today">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
          </select>

          <Box position="relative">
            {/* Clickable Text */}
            <Text
              color="black"
              backgroundColor="white"
              borderRadius="10px"
              padding="5px"
              border="1px solid #ccc"
              cursor="pointer"
              onClick={() => setShowCalendar(!showCalendar)}
              _hover={{ borderColor: "gray" }}
            >
              📅 Compare to:{" "}
              {selectedDate
                ? selectedDate.toLocaleDateString()
                : new Date().toLocaleDateString()}
            </Text>

            {/* Date Picker positioned below the text */}
            {showCalendar && (
              <Box position="absolute" top="40px" zIndex="10">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  inline
                />
              </Box>
            )}
          </Box>
        </Flex>

        <Flex gap={3} flex={4} padding="0 30px 0 30px">
          <Flex
            flexDirection="column"
            color="#333"
            padding="8px"
            borderRadius="10px"
            backgroundColor="white"
            border="1px solid #ccc"
            w="3xs"
          >
            <Text fontSize="md" fontWeight="400">
              Requests Sent
            </Text>
            <Text fontSize="md" fontWeight="500">
              {requestsSentTotal}
            </Text>
          </Flex>
          <Flex
            flexDirection="column"
            color="#333"
            padding="8px"
            borderRadius="10px"
            backgroundColor="white"
            border="1px solid #ccc"
            w="3xs"
          >
            <Text fontSize="md" fontWeight="400">
              Accepted Requests
            </Text>
            <Text fontSize="md" fontWeight="500">
              {acceptedRequestsTotal}
            </Text>
          </Flex>
          <Flex
            flexDirection="column"
            color="#333"
            padding="8px"
            borderRadius="10px"
            backgroundColor="white"
            border="1px solid #ccc"
            w="3xs"
          >
            <Text fontSize="md" fontWeight="400">
              Engagement
            </Text>
            <Text fontSize="md" fontWeight="500">
              1000
            </Text>
          </Flex>
          <Flex
            flexDirection="column"
            color="#333"
            padding="8px"
            borderRadius="10px"
            backgroundColor="white"
            border="1px solid #ccc"
            w="3xs"
          >
            <Text fontSize="md" fontWeight="400">
              Email outreach
            </Text>
            <Text fontSize="md" fontWeight="500">
              850
            </Text>
          </Flex>
        </Flex>

        <Flex gap={5} padding="0 30px 0 30px">
          <Flex
            flex={1}
            borderRadius={20}
            overflow="hidden"
            border="1px solid #E1E1E1"
            p={5}
            bgColor="white"
          >
            <CanvasJSChart
              options={{
                animationEnabled: true,
                title: {
                  text: "Requests Sent Over Time",
                  fontSize: 24,
                  fontFamily: "Poppins",
                  fontWeight: "500",
                },
                axisX: {
                  title: "Date",
                  crosshair: { enabled: true },
                  labelFontFamily: "Poppins",
                  titleFontFamily: "Poppins",
                },
                axisY: {
                  title: "Requests Sent",
                  crosshair: { enabled: true },
                  labelFontFamily: "Poppins",
                  titleFontFamily: "Poppins",
                },
                data: [
                  {
                    type: "line",
                    dataPoints: lineData,
                  },
                ],
              }}
            />
          </Flex>

          <Flex
            flex={1}
            borderRadius={20}
            overflow="hidden"
            border="1px solid #E1E1E1"
            p={5}
            bgColor="white"
          >
            <CanvasJSChart
              options={{
                animationEnabled: true,
                title: {
                  text: "Accepted Requests by Position",
                  fontSize: 24,
                  fontFamily: "Poppins",
                  fontWeight: "500",
                },
                legend: {
                  verticalAlign: "bottom",
                  horizontalAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: 14,
                  maxWidth: 300, // Prevents text overflow
                  itemWrap: true,
                },
                data: [
                  {
                    type: "pie",
                    startAngle: 240,
                    showInLegend: true,
                    legendText: "{label}",
                    indexLabel: "{label} - {y}",
                    indexLabelFontFamily: "Poppins",
                    indexLabelFontWeight: "400",
                    dataPoints: pieData,
                  },
                ],
              }}
            />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Dashboard;

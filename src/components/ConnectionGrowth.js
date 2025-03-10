import { useState, useEffect } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ConnectionGrowth = () => {
  const [quarterlyData, setQuarterlyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
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
        console.log("🔍 Fetched Data:", result); // Check raw response

        if (result.values) {
          const processedData = processSheetData(result.values);
          console.log("✅ Processed Data:", processedData); // Check processed data
          setQuarterlyData(processedData.quarterly);
          setMonthlyData(processedData.monthly);
          setTotalRows(processedData.totalValidRows);
        } else {
          console.warn("⚠ No values found in sheet.");
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const processSheetData = (rows) => {
    if (!rows || rows.length < 2) {
      console.warn("⚠ Sheet is empty or has no data rows.");
      return { quarterly: [], monthly: [], totalValidRows: 0 };
    }

    const dataRows = rows.slice(1); // Skip the header
    let quarterlyMap = new Map();
    let monthlyMap = new Map();
    let totalValidRows = 0;

    dataRows.forEach((row, index) => {
      const dateStr = row[0]?.trim(); // Get first column value

      // **Validate Date Format**
      if (
        !dateStr ||
        dateStr.length < 10 ||
        !/^\d{2}-\d{2}-\d{4}$/.test(dateStr)
      ) {
        console.warn(
          `⚠ Skipping invalid entry at row ${index + 2}: "${
            dateStr || "Empty row"
          }"`
        );
        return;
      }

      const [day, month, year] = dateStr.split("-").map(Number);
      const dateObj = new Date(year, month - 1, day);

      if (isNaN(dateObj.getTime())) {
        console.warn(
          `⚠ Skipping malformed date at row ${index + 2}: "${dateStr}"`
        );
        return;
      }

      // **Generate Monthly & Quarterly Keys**
      const monthKey = dateObj.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });
      const quarter = Math.floor((month - 1) / 3) + 1;
      const quarterKey = `Q${quarter} ${year}`;

      // **Update Maps**
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);
      quarterlyMap.set(quarterKey, (quarterlyMap.get(quarterKey) || 0) + 1);

      totalValidRows++;
    });

    const quarterly = Array.from(quarterlyMap, ([quarter, connections]) => ({
      quarter,
      connections,
    }));
    const monthly = Array.from(monthlyMap, ([month, count]) => ({
      month,
      count,
    }));

    console.log("📊 Final Quarterly Data:", quarterly);
    console.log("📆 Final Monthly Data:", monthly);

    return { quarterly, monthly, totalValidRows };
  };

  return (
    <Box w="100%" p={4} bg="gray.100">
      <Box bg="white" p={4} borderRadius="md" boxShadow="sm">
        <Heading as="h2" size="xl" mb={4}>
          Network Growth
        </Heading>

        <Text mb={4}>Total Records Processed: {totalRows}</Text>

        {quarterlyData.length > 0 ? (
          <Box mb={6}>
            <Heading as="h3" size="md" mb={2}>
              Network Growth by Quarter
            </Heading>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quarterlyData}>
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="connections" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Text>No quarterly data available.</Text>
        )}

        {monthlyData.length > 0 ? (
          <Box>
            <Heading as="h3" size="md" mb={2}>
              Monthly Connection Growth
            </Heading>
            <Box overflowX="auto">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                    <th style={headerStyle}>MONTH</th>
                    <th style={headerStyle}>COUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((row, index) => (
                    <tr key={index}>
                      <td style={cellStyle}>{row.month}</td>
                      <td style={cellStyle}>{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Box>
        ) : (
          <Text>No monthly data available.</Text>
        )}
      </Box>
    </Box>
  );
};

const headerStyle = {
  padding: "10px",
  fontWeight: "bold",
  borderBottom: "2px solid #ddd",
};
const cellStyle = { padding: "8px", borderBottom: "1px solid #ddd" };

export default ConnectionGrowth;

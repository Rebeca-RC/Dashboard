import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Box, Button, Flex, Select, Text } from "@chakra-ui/react";
import { format, subDays, startOfToday } from "date-fns";

const DateRangeFilter = ({ onApply }) => {
  const today = startOfToday();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [predefinedFilter, setPredefinedFilter] = useState("Custom");

  const handlePredefinedFilterChange = (filter) => {
    setPredefinedFilter(filter);

    switch (filter) {
      case "Today":
        setStartDate(today);
        setEndDate(today);
        break;
      case "Yesterday":
        setStartDate(subDays(today, 1));
        setEndDate(subDays(today, 1));
        break;
      case "Last 7 Days":
        setStartDate(subDays(today, 7));
        setEndDate(today);
        break;
      case "Last 30 Days":
        setStartDate(subDays(today, 30));
        setEndDate(today);
        break;
      case "Last 90 Days":
        setStartDate(subDays(today, 90));
        setEndDate(today);
        break;
      default:
        setStartDate(null);
        setEndDate(null);
        break;
    }
  };

  const handleApply = () => {
    if (onApply && startDate && endDate) {
      onApply({ startDate, endDate });
    }
  };

  const handleCancel = () => {
    setPredefinedFilter("Custom");
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <Box p={5} border="1px solid #ddd" borderRadius="md" maxWidth="400px">
      <Flex flexDirection="column" gap={4}>
        {/* Predefined Filters */}
        <Select
          placeholder="Custom"
          value={predefinedFilter}
          onChange={(e) => handlePredefinedFilterChange(e.target.value)}
        >
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="Last 7 Days">Last 7 Days</option>
          <option value="Last 30 Days">Last 30 Days</option>
          <option value="Last 90 Days">Last 90 Days</option>
        </Select>

        {/* Date Range Picker */}
        <Flex gap={2}>
          <Box>
            <Text>Start Date:</Text>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select start date"
            />
          </Box>
          <Box>
            <Text>End Date:</Text>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select end date"
            />
          </Box>
        </Flex>

        {/* Apply and Cancel Buttons */}
        <Flex justifyContent="space-between" mt={4}>
          <Button
            colorScheme="blue"
            onClick={handleApply}
            isDisabled={!startDate || !endDate}
          >
            Apply
          </Button>
          <Button colorScheme="gray" onClick={handleCancel}>
            Cancel
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default DateRangeFilter;

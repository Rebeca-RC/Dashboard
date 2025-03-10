import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  Heading,
  Text,
  Flex,
  Image,
} from "@chakra-ui/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchSheetNames = async () => {
    try {
      const spreadsheetId = "10R5dQ7M0ZgWfCoSbJH8Vpjj9YuOUN9kR6wvp-x6jkTs";
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=AIzaSyAr_f5eejQ5v9rm5TrVo_C5TFWOZlIi48o`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data.sheets) {
        setError("No sheets found in the spreadsheet!");
        return;
      }

      const sheetNames = data.sheets.map((sheet) => sheet.properties.title);

      if (sheetNames.includes(email.trim().toLowerCase())) {
        localStorage.setItem("userSheet", email.trim().toLowerCase());
        navigate("/home");
      } else {
        setError("Email not found! Please try again.");
      }
    } catch (error) {
      setError("Error fetching sheet names. Please check your API key.");
      console.error("Error:", error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter an email");
      return;
    }
    setError("");
    fetchSheetNames();
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="flex-start"
      bg="white"
      gap={24}
      direction="column"
    >
      <Text
        fontSize="4xl"
        color="black"
        textAlign="center"
        mt={5}
        fontWeight="bold"
      >
        Dashboard Login
      </Text>
      <Flex
        w="80%"
        maxW="600px"
        h="350px" // 👈 Increased height here
        boxShadow="lg"
        borderRadius="lg"
        overflow="hidden"
      >
        {/* Left Side - Blue Section */}
        <Box
          flex="1"
          bg="navy"
          p={8}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          h="full" // 👈 Ensure it takes full height
        >
          {/* <Image
            src="/your-logo.png"
            alt="Company Logo"
            boxSize="80px"
            mb={4}
          /> */}
          <Heading size="4xl" color="white" mb={5}>
            Nexxence
          </Heading>
          <Text color="white" textAlign="center" mt={4}>
            Welcome! Please log in to continue.
          </Text>
        </Box>

        {/* Right Side - Login Form */}
        <Box
          flex="2"
          bg="#F1F1F1"
          justifyContent={"center"}
          alignItems={"center"}
          display="flex"
          flexDirection="column"
        >
          <Heading as="h1" size="4xl" textAlign="center" mb={4} color="black">
            Login
          </Heading>
          <form onSubmit={handleLogin}>
            <Text fontWeight="bold" mb={2} color="black">
              Email Address
            </Text>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              mb={4}
              color="black"
              border="1px solid"
              borderColor="gray.300"
            />
            <Button
              colorScheme="yellow"
              width="full"
              type="submit"
              border="1px solid"
              borderColor="blue.300"
            >
              Login
            </Button>
          </form>
          {error && (
            <Text color="red.500" mt={2} textAlign="center">
              {error}
            </Text>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Login;

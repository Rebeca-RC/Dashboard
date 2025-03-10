import { Flex } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeScreen from ".//screens/HomeScreen";
import Login from "./screens/Login";

const App = () => {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Flex
        as="main"
        direction="column"
        py="1"
        px="1"
        // bgColor="#1A1A1A"
        w="100%"
      >
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
        <Routes>
          <Route path="/Home" element={<HomeScreen />} />
        </Routes>
      </Flex>
      {/* <Footer /> */}
    </BrowserRouter>
  );
};

export default App;

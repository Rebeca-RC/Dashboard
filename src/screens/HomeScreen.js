import { Button, Color, Flex, Grid } from "@chakra-ui/react";
import CoustomCard from "../components/CoustomCard";
import { useEffect, useRef } from "react";
// import { Player } from "@lordicon/react";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";
import Dashboard from "../components/Dashboard";
import DashboardTabs from "../components/DashboardTabs";
import ConnectionDash from "../components/ConnectionDash";
import DecisionMakerCards from "../components/DecisionMakerCards";
import StrategicNetworking from "../components/StrategicNetworking";
import ConnectionGrowth from "../components/ConnectionGrowth";

// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

// const ICON = require("../components/wired-lineal-35-edit-hover-circle.json");
const HomeScreen = () => {
  const playerRef = useRef(null);

  useEffect(() => {
    playerRef.current?.playFromBeginning();
  }, []);
  return (
    <Grid
    // templateColumns={{ sm: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr 1fr" }}
    // gap="8"
    >
      {/* <Dashboard /> */}
      <DecisionMakerCards />
      <DashboardTabs />
      <StrategicNetworking />
      <ConnectionGrowth />
      {/* <ConnectionDash /> */}
    </Grid>
  );
};

export default HomeScreen;

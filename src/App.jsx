import { Box } from "@mui/material";
import { MapView } from "./map/MapView";
import "./App.css";

function App() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          position: "relative",
        }}
      >
        <MapView />
      </Box>
    </Box>
  );
}

export default App;

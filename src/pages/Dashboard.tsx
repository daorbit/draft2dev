import { Typography, Box } from "@mui/material";
import ImageEditor from "./ImageEditor";

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <ImageEditor />
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;

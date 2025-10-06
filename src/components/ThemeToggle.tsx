import React from "react";
import { Box, useTheme } from "@mui/material";
import { Sun, Moon } from "lucide-react";
import { useAppTheme } from "../contexts/ThemeContext";

const ThemeToggle: React.FC = () => {
  const muiTheme = useTheme();
  const { mode, toggleTheme } = useAppTheme();
  const isDark = mode === "dark";

  return (
    <Box
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleTheme();
        }
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "12px",
        py: 1.2,
        px: 2,
        border: `1px solid ${muiTheme.palette.divider}`,
        transition: "all 0.2s ease",
        backgroundColor: muiTheme.palette.action.hover,
        cursor: "pointer",
        "&:hover": {
          background: isDark
            ? "linear-gradient(135deg, #1f2937 0%, #111827 100%)"
            : "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
          borderColor: isDark ? "#3b82f6" : "#f59e0b",
          color: "white",
          boxShadow: isDark
            ? "0 4px 6px -1px rgba(59, 130, 246, 0.25)"
            : "0 4px 6px -1px rgba(245, 158, 11, 0.25)",
          "& .theme-icon": {
            color: "white",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          className="theme-icon"
          sx={{
            color: muiTheme.palette.text.secondary,
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
          }}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </Box>
        <Box
          sx={{
            fontSize: "0.92rem",
            fontWeight: 500,
            color: muiTheme.palette.text.primary,
          }}
        >
          {isDark ? "Light Mode" : "Dark Mode"}
        </Box>
      </Box>
    </Box>
  );
};

export default ThemeToggle;

import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
} from "@mui/material";
import { LogOut, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { menuItems } from "../../constants/menuItems";
import ThemeToggle from "../ThemeToggle";
import styled from "styled-components";

// Styled components for the collapsible sidebar
const SidebarTrigger = styled.div`
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 50px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 0 12px 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1300;
  transition: all 0.3s ease;
  box-shadow: 2px 0 8px rgba(99, 102, 241, 0.25);

  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  }

  svg {
    color: white;
    transition: transform 0.3s ease;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  }

  &:hover svg {
    transform: translateX(2px);
  }

  /* Add focus styles for accessibility */
  &:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
`;

// Overlay that appears behind sidebar
const SidebarOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1200;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  transition: all 0.3s ease;
`;

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const theme = useTheme();

  const handleMenuClick = (key: string) => {
    navigate(key);
    setIsOpen(false); // Close sidebar after navigation
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsOpen(false);
    }, 300); // 300ms delay before hiding
    setHoverTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  const menuItemsMapped = menuItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    onClick: () => handleMenuClick(item.key),
  }));

  return (
    <>
      {/* Sidebar Trigger - Always visible */}
      <SidebarTrigger
        data-sidebar-trigger
        onMouseEnter={handleMouseEnter}
        onClick={handleMouseEnter}
        role="button"
        tabIndex={0}
        aria-label="Open navigation menu"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleMouseEnter();
          }
        }}
      >
        <ChevronRight size={18} />
      </SidebarTrigger>

      {/* Overlay - appears when sidebar is open */}
      <SidebarOverlay isVisible={isOpen} onClick={() => setIsOpen(false)} />

      {/* Collapsible Sidebar - Overlay style like Vercel */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            backgroundColor: theme.palette.background.default,
            border: "none",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            zIndex: 1250,
          },
        }}
        PaperProps={{
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
        }}
      >
        {/* Sidebar Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.paper,
          }}
        >
         
        </Box>

        {/* Navigation Menu */}
        <List sx={{ pt: 2, px: 2 }}>
          {menuItemsMapped.map((item) => (
            <ListItem key={item.key} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={location.pathname === item.key}
                onClick={item.onClick}
                sx={{
                  borderRadius: "12px",
                  transition: "all 0.2s ease",
                  py: 1.2,
                  position: "relative",
                  overflow: "hidden",
                  "&.Mui-selected": {
                    background:
                      "linear-gradient(135deg, #f0f4ff 0%, #e0f2fe 100%)",
                    color: "#6366f1",
                    fontWeight: 600,
                    boxShadow: "0 1px 3px rgba(99, 102, 241, 0.15)",
                    "& .MuiListItemIcon-root": {
                      color: "#6366f1",
                    },
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "3px",
                      background:
                        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      borderRadius: "0 2px 2px 0",
                    },
                  },
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: theme.palette.text.secondary,
                    minWidth: "40px",
                    transition: "all 0.2s ease",
                    "& svg": {
                      color: "currentColor !important",
                      width: "18px",
                      height: "18px",
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: 500,
                      fontSize: "0.92rem",
                      color: "inherit",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Theme Toggle and Logout Section */}
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            left: 16,
            right: 16,
          }}
        >
          {/* Theme Toggle */}
          <Box sx={{ mb: 2 }}>
            <ThemeToggle />
          </Box>

          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: "12px",
              py: 1.2,
              border: `1px solid ${theme.palette.divider}`,
              transition: "all 0.2s ease",
              backgroundColor: theme.palette.action.hover,
              "&:hover": {
                background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
                borderColor: "#f87171",
                color: "#dc2626",
                boxShadow: "0 4px 6px -1px rgba(220, 38, 38, 0.1)",
                "& .MuiListItemIcon-root": {
                  color: "#dc2626",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: theme.palette.text.secondary,
                minWidth: "40px",
                transition: "all 0.2s ease",
                "& svg": {
                  color: "currentColor !important",
                  width: "18px",
                  height: "18px",
                },
              }}
            >
              <LogOut size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                "& .MuiListItemText-primary": {
                  fontWeight: 500,
                  fontSize: "0.92rem",
                  color: "inherit",
                },
              }}
            />
          </ListItemButton>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;

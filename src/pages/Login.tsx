import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { LoginCredentials } from "../types/auth";
import { DEFAULT_PRIVATE_PATH } from "../routes";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || DEFAULT_PRIVATE_PATH;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login(credentials);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      }}
    >
      {/* Left Side - App Info */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 6,
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.2)",
            zIndex: 1,
          }}
        />

        <Box sx={{ zIndex: 2, textAlign: "center", maxWidth: 500 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { md: "3rem", lg: "3.5rem" },
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Welcome to
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              mb: 4,
              fontSize: { md: "2rem", lg: "2.5rem" },
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Snap2 UI Management Platform
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 6,
              opacity: 0.9,
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            Build stunning user interfaces with our powerful component library
            and design tools. Create, customize, and deploy beautiful UIs in
            minutes.
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.6 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#000",
          // p: 4,
          position: "relative",
        }}
      >
         <img
          src="/snap3.png"
          alt="Logo"
          style={{
            maxWidth: "200px",
            borderRadius: "20px",
            position: "absolute",
            top: "20px",
            left: "120px",
            transform: "translateX(-50%)",
          }}
        />
        <Card
          elevation={0}
          sx={{
            width: "100%",
            border: "none",
            boxShadow: "none",
          }}
        >
          <CardContent sx={{ p: { xs: 4, sm: 6 } }}>
            {/* Logo/Brand */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: "#fff",
                  letterSpacing: "-0.5px",
                }}
              >
                Sign in to your account
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#64748b",
                  fontWeight: 400,
                }}
              >
                Welcome to Snap2 UI Management Platform
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  "& .MuiAlert-message": {
                    fontSize: "0.875rem",
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Typography
                variant="body2"
                sx={{
                  color: "#fff",
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Email *
              </Typography>

              <TextField
                fullWidth
                placeholder="Enter your email"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleChange}
                required
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#ffffff",
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: "#d1d5db",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#3b82f6",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "14px 16px",
                    fontSize: "0.95rem",
                  },
                }}
              />

              <Typography
                variant="body2"
                sx={{
                  color: "#fff",
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Password *
              </Typography>

              <TextField
                fullWidth
                placeholder="Enter your password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={handleChange}
                required
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#ffffff",
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: "#d1d5db",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#3b82f6",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "14px 16px",
                    fontSize: "0.95rem",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "#6b7280" }}
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ textAlign: "right", mb: 4 }}>
                <Link
                  to="/forgot-password"
                  style={{
                    color: "#3b82f6",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  Forgot Password
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                // disabled={isLoading}
                sx={{
                  mb: 4,
                  py: 1.8,
                  fontSize: "1rem",
                  fontWeight: 600,
                  bgcolor: "#3b82f6",
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#2563eb",
                  },
                  "&:disabled": {
                    bgcolor: "#93c5fd",
                  },
                }}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </Box>

            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "#6b7280",
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: "#3b82f6",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;

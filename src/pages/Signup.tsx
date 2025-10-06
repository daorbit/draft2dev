import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { SignupCredentials } from "../types/auth";

const Signup: React.FC = () => {
  const [credentials, setCredentials] = useState<SignupCredentials>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (credentials.password !== credentials.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (credentials.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await signup(credentials);
      if (result.success) {
        setSuccess(
          result.message || "Account created successfully! Please log in."
        );
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(result.message || "Signup failed");
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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
            Join the Future
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
            of UI Development
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
            Start building stunning user interfaces today. Join thousands of
            developers who trust Snap2 UI for their design and development
            needs.
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Signup Form */}
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
            // maxWidth: 420,
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
                Create Account
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#64748b",
                  fontWeight: 400,
                }}
              >
                Start building amazing projects today
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

            {success && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  "& .MuiAlert-message": {
                    fontSize: "0.875rem",
                  },
                }}
              >
                {success}
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
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
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
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#ffffff",
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: "#d1d5db",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
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

              <Typography
                variant="body2"
                sx={{
                  color: "#fff",
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Confirm Password *
              </Typography>

              <TextField
                fullWidth
                placeholder="Confirm your password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={credentials.confirmPassword}
                onChange={handleChange}
                required
                sx={{
                  mb: 4,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#ffffff",
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: "#d1d5db",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
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
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        sx={{ color: "#6b7280" }}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  mb: 4,
                  py: 1.8,
                  fontSize: "1rem",
                  fontWeight: 600,
                  bgcolor: "#667eea",
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#5a67d8",
                  },
                  "&:disabled": {
                    bgcolor: "#a5b4fc",
                  },
                }}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </Box>

            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "#6b7280",
              }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#667eea",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Sign In
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Signup;

import React, { lazy, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useMutation, QueryCache, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../services/hooks";

import {
  resendEmailConfirmation,
  logout,
  deactivateUser,
} from "../services/http";
import { jwtAtom, expAtom, userProfileAtom } from "../services/atoms";

const Loader = lazy(() => import("./Loader"));

const Account = () => {
  const queryClient = useQueryClient();
  const jwt = useAtomValue(jwtAtom);
  const { data: profileData, isLoading, error } = useUserProfile(jwt?.access);
  const userEmail = profileData?.email;
  const userEmailVerified = profileData?.email_verified;
  const queryCache = new QueryCache();
  const resetJwt = useResetAtom(jwtAtom);
  const resetExp = useResetAtom(expAtom);
  const resetUser = useResetAtom(userProfileAtom);

  // Snackbar state for feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();

  // Mutation to resend email confirmation
  const resendEmailMutation = useMutation({
    mutationFn: (email) => resendEmailConfirmation({ email }),
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Confirmation email sent successfully!",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Failed to send confirmation email: ${error.message || error}`,
        severity: "error",
      });
    },
  });

  // Mutation for logout
  const logoutMutation = useMutation({
    mutationFn: () => logout(jwt.refresh),
    onSuccess: (data) => {
      queryCache.clear();
      toast.success(data.detail);
      setSnackbar({
        open: true,
        message: "Logged out successfully.",
        severity: "success",
      });
      // Optionally, you can redirect or reload page here:
      // window.location.href = "/login";
      resetJwt();
      resetExp();
      resetUser();
      localStorage.clear();
      navigate("/login");
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Logout failed: ${error.message || error}`,
        severity: "error",
      });
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: () => deactivateUser(profileData?.username),
    onSuccess: () => {
      toast.success("Account deactivated");
      queryClient.clear();
      resetJwt();
      resetExp();
      resetUser();
      localStorage.clear();
      navigate("/login");
    },
    onError: (error) => {
      toast.error(`Failed to delete user: ${error.message || error}`);
    },
  });

  const handleSendConfirmation = () => {
    if (userEmail) {
      resendEmailMutation.mutate(userEmail);
    }
  };

  const handleDeactivateUser = () => {
    if (
      window.confirm(
        "Are you sure you want to deactivate your account? This action requires reactivation by emailing us."
      )
    ) {
      deactivateUserMutation.mutate();
    }
  };

  if (
    isLoading ||
    resendEmailMutation.isLoading ||
    deactivateUserMutation.isLoading
  )
    return <Loader />;
  if (error) return <p>Error loading profile</p>;

  // console.log(profileData);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table aria-label="user profile table">
          <TableBody>
            <TableRow>
              <TableCell variant="head">Username</TableCell>
              <TableCell>{profileData?.username}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Email</TableCell>
              <TableCell>
                {userEmail}{" "}
                {userEmailVerified ? (
                  <Typography
                    component="span"
                    color="success.main"
                    sx={{ ml: 1, fontWeight: "bold" }}
                  >
                    (Verified)
                  </Typography>
                ) : (
                  <Typography
                    component="span"
                    color="warning.main"
                    sx={{ ml: 1, fontWeight: "bold" }}
                  >
                    (Unverified)
                  </Typography>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">User ID</TableCell>
              <TableCell>{profileData?.pk}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Status</TableCell>
              <TableCell>
                {profileData?.is_staff ? "Role: Staff" : "Regular User"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Date Joined</TableCell>
              <TableCell>
                {new Date(profileData?.date_joined).toLocaleString("en-US", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Last Login</TableCell>
              <TableCell>
                {new Date(profileData?.last_login).toLocaleString("en-US", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table aria-label="user profile table">
          <TableBody>
            <TableRow>
              <TableCell variant="head" sx={{ whiteSpace: "nowrap" }}>
                Actions
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={userEmailVerified || resendEmailMutation.isLoading}
                  onClick={handleSendConfirmation}
                  sx={{ mr: 2 }}
                >
                  {resendEmailMutation.isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Send Email Confirmation"
                  )}
                </Button>

                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isLoading}
                  sx={{ mr: 2 }}
                >
                  {logoutMutation.isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Logout"
                  )}
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDeactivateUser}
                  disabled={deactivateUserMutation.isLoading}
                >
                  {deactivateUserMutation.isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Deactivate Account"
                  )}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Account;

import React, { lazy, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TableCell,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

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

const ProfileField = ({ label, value }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center">
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={500}>
      {value}
    </Typography>
  </Stack>
);

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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();

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

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Account Overview
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Profile Details
        </Typography>

        <Stack spacing={2}>
          <ProfileField label="Username" value={profileData?.username} />
          <ProfileField
            label="Email"
            value={
              <>
                {profileData?.email}
                <Typography
                  component="span"
                  sx={{
                    ml: 1,
                    fontWeight: "bold",
                    color: profileData?.email_verified
                      ? "success.main"
                      : "warning.main",
                  }}
                >
                  ({profileData?.email_verified ? "Verified" : "Unverified"})
                </Typography>
              </>
            }
          />
          <ProfileField label="User ID" value={profileData?.pk} />
          <ProfileField
            label="Status"
            value={profileData?.is_staff ? "Staff" : "Regular User"}
          />
          <ProfileField
            label="Date Joined"
            value={new Date(profileData?.date_joined).toLocaleString("en-US", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          />
          <ProfileField
            label="Last Login"
            value={new Date(profileData?.last_login).toLocaleString("en-US", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          />
        </Stack>
      </Paper>
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Subscription
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          View your subscription history.
        </Typography>
        <Button
          variant="outlined"
          color="info"
          startIcon={<ReceiptLongIcon />}
          href="/orders"
          sx={{ mt: 2 }}
        >
          View Subscription History
        </Button>
      </Paper>

      {/* --- Session Controls --- */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Session Controls
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Use this to end your current session securely.
        </Typography>

        <Button
          variant="text"
          color="warning"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isLoading}
          startIcon={<LogoutIcon />}
        >
          {logoutMutation.isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Logout"
          )}
        </Button>
      </Paper>

      {/* --- Account Management --- */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Account Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage your account settings and identity verification.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="flex-start"
        >
          <Button
            variant="contained"
            color="primary"
            disabled={userEmailVerified || resendEmailMutation.isLoading}
            onClick={handleSendConfirmation}
            startIcon={<MailOutlineIcon />}
          >
            {resendEmailMutation.isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Send Email Confirmation"
            )}
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={handleDeactivateUser}
            disabled={deactivateUserMutation.isLoading}
            startIcon={<DeleteForeverIcon />}
          >
            {deactivateUserMutation.isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Deactivate Account"
            )}
          </Button>
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 2, display: "block" }}
        >
          Deactivating your account will require reactivation through support.
        </Typography>
      </Paper>

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

const StyledRow = ({ label, value }) => (
  <TableRow>
    <TableCell variant="head" sx={{ fontWeight: 500, color: "text.secondary" }}>
      {label}
    </TableCell>
    <TableCell>{value}</TableCell>
  </TableRow>
);

export default Account;

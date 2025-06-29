import { lazy } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Stack,
  Link,
  CircularProgress,
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { toast } from "react-hot-toast";
import { sanitize } from "isomorphic-dompurify";
import { jwtDecode } from "jwt-decode";
import * as yup from "yup";
import { useGoogleLogin } from "@react-oauth/google";

import { login, googleLogin } from "../services/http";
import { userKeys, serviceKeys } from "../services/queryKeyFactory";
import { jwtAtom, expAtom } from "../services/atoms";
const Loader = lazy(() => import("./Loader"));

const Login = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setJwt = useSetAtom(jwtAtom);
  const setExp = useSetAtom(expAtom);

  // Validation schema
  const schema = yup
    .object({
      email: yup.string().required("Enter your registered email"),
      password: yup.string().required("Password is required"),
    })
    .required();

  // Mutation hook for login
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      const decoded = jwtDecode(data.access);

      setJwt({ access: data?.access, refresh: data?.refresh });
      toast.success(`Welcome ${data.user.username}`);
      reset();
      navigate("/account");
      if (typeof decoded.exp === "number") setExp(decoded.exp);
    },
    onError: (error) => {
      toast.error(`Login failed: ${error.message}`);
      navigate("/login");
    },
  });

  // Mutation hook for Google login
  const googleLoginMutation = useMutation({
    mutationFn: googleLogin,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      const decoded = jwtDecode(data.access);

      setJwt({ access: data?.access, refresh: data?.refresh });
      toast.success('Google login success!');
      navigate("/account");
      if (typeof decoded.exp === "number") setExp(decoded.exp);
    },
    onError: (error) => {
      toast.error("Google login failed:", error);
      navigate("/login");
    },
  });

  const handleGoogleSuccess = (response) => {
    googleLoginMutation.mutate(response.access_token);
  };

  const handleGoogleFailure = (response) => {
    toast.error("Google login failed:", response);
  };

  const gLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleFailure,
    redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (input) => {
    const sanitizedData = {
      email: sanitize(input.email),
      password: input.password,
    };
    mutation.mutate(sanitizedData);
  };

  if (mutation.isLoading || googleLoginMutation.isLoading) return <Loader />;

  return (
    <Box
      sx={{
        minHeight: "100vh", // full viewport height
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // vertical center
        alignItems: "center", // horizontal center
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Typography variant="h6" component="h6" gutterBottom>
        <Link underline="none" component={RouterLink} to="/">
          FinMark By Imperionite
        </Link>
      </Typography>
      <Box
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          mt: 2,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            //helperText={errors.email ? errors.email.message : ""}
            autoComplete="current-email"
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <Divider sx={{ my: 2 }}>or</Divider>

        <Button
          startIcon={<GoogleIcon />}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          onClick={() => gLogin()}
          disabled={googleLoginMutation.isLoading}
        >
          {googleLoginMutation.isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Continue with Google"
          )}
        </Button>

        <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
          <Typography>Don't have an account?</Typography>
          <Link component={RouterLink} to="/signup" underline="hover">
            Sign Up
          </Link>
        </Stack>
      </Box>
    </Box>
  );
};

export default Login;

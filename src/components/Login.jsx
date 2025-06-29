import { useState } from "react";
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

const Login = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
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
    mutationFn: async (data) => {
      const response = await login(data);
      return response;
    },
    onMutate: () => {
      console.log("Mutation started");
      setIsLoading(true);
    },
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
    onSettled: () => {
      setIsLoading(false); // Re-enable the button when mutation is settled
    },
  });

  // Mutation hook for Google login
  const googleLoginMutation = useMutation({
    mutationFn: googleLogin,
    onMutate: () => {
      console.log("Google login started");
      setIsLoading(true); // Disable the button during Google login mutation
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      const decoded = jwtDecode(data.access);

      setJwt({ access: data?.access, refresh: data?.refresh });
      toast.success("Google login success!");
      navigate("/account");
      if (typeof decoded.exp === "number") setExp(decoded.exp);
    },
    onError: (error) => {
      toast.error("Google login failed:", error);
      navigate("/login");
    },
    onSettled: () => {
      setIsLoading(false); // Re-enable the button after Google login mutation
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

  const onSubmit = async (input) => {
    const sanitizedData = {
      email: sanitize(input.email),
      password: input.password,
    };
    await mutation.mutateAsync(sanitizedData);
  };

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
            helperText={errors.email ? errors.email.message : ""}
            autoComplete="email"
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
            sx={{
              mt: 2,
              height: 40,
              position: "relative", // Make sure the spinner can be positioned within the button
            }}
            disabled={isLoading || mutation.isLoading} // Disable the button during mutation
            loading={isLoading}
            loadingPosition="start"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <Divider sx={{ my: 2 }}>or</Divider>

        <Button
          startIcon={
            !googleLoginMutation.isLoading || !isLoading ? <GoogleIcon /> : null
          }
          fullWidth
          variant="outlined"
          sx={{
            mb: 2,
            height: 40,
            position: "relative",
          }}
          onClick={() => gLogin()}
          disabled={isLoading || googleLoginMutation.isLoading} // Disable Google button during loading
          loading={isLoading}
          loadingPosition="start"
        >
          {googleLoginMutation.isLoading || isLoading
            ? "Connecting..."
            : "Continue with Google"}
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

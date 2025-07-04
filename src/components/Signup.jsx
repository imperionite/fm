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

import { signup, googleLogin } from "../services/http";
import { userKeys, serviceKeys } from "../services/queryKeyFactory";
import { jwtAtom, expAtom } from "../services/atoms";

const Signup = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setJwt = useSetAtom(jwtAtom);
  const setExp = useSetAtom(expAtom);

  // Validation schema
  const schema = yup
    .object({
      username: yup.string().trim().min(2).required(),
      email: yup.string().email().required(),
      password1: yup.string().trim().min(8).required(),
      password2: yup
        .string()
        .oneOf([yup.ref("password1"), null], "Password must match"),
    })
    .required();

  // Mutation hook for signup
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await signup(data);
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
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  // Mutation hook for Google login as signup
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
      toast.success("Google Signup success!");
      navigate("/account");
      if (typeof decoded.exp === "number") setExp(decoded.exp);
    },
    onError: (error) => {
      toast.error("Google signup failed:", error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleGoogleSuccess = (response) => {
    googleLoginMutation.mutate(response.access_token);
  };

  const handleGoogleFailure = (response) => {
    toast.error("Google signup failed:", response);
  };

  const gLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleFailure,
    redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  });

  // React Hook Form setup
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      username: "",
      email: "",
      password1: "",
      password2: "",
    },
  });

  const onSubmit = async (input) => {
    const sanitizedData = {
      username: sanitize(input.username),
      email: sanitize(input.email),
      password1: input.password1,
      password2: input.password2,
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
        <Link component={RouterLink} to="/" underline="none">
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
          Signup
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username ? errors.username.message : ""}
            autoComplete="current-username"
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
            autoComplete="current-email"
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("password1")}
            error={!!errors.password1}
            helperText={errors.password1 ? errors.password1.message : ""}
            autoComplete="current-password1"
          />

          <TextField
            label="Re-Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("password2")}
            error={!!errors.password2}
            helperText={errors.password2 ? errors.password2.message : ""}
            autoComplete="current-re-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, height: 40 }}
            disabled={mutation.isLoading || isLoading}
            loading={isLoading}
            loadingPosition="start"
          >
            {mutation.isLoading || isLoading ? "Signing up..." : "Signup"}
          </Button>
        </form>

        <Divider sx={{ my: 2 }}>or</Divider>

        <Button
          startIcon={
            !googleLoginMutation.isLoading || !isLoading ? <GoogleIcon /> : null
          }
          fullWidth
          variant="outlined"
          sx={{ mb: 2, height: 40 }}
          onClick={() => gLogin()}
          disabled={googleLoginMutation.isLoading || isLoading}
          loading={isLoading}
          loadingPosition="start"
        >
          {googleLoginMutation.isLoading || isLoading
            ? "Connecting..."
            : "Continue with Google"}
        </Button>

        <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
          <Typography>Already have an account?</Typography>
          <Link component={RouterLink} to="/login" underline="hover">
            Login
          </Link>
        </Stack>
      </Box>
    </Box>
  );
};

export default Signup;

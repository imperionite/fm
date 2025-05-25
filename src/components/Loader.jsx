import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function Loader() {
  return (
    <Box
      sx={{
        width: 1000,
        height: "60vh", // full viewport height
        display: "flex", // enable flexbox
        flexDirection: "column", // stack skeletons vertically
        justifyContent: "center", // center vertically
        alignItems: "center", // center horizontally
        mx: "auto", // horizontal margin auto (optional)
      }}
    >
      <Skeleton animation="wave" width="100%" />
      <Skeleton animation="wave" width="100%" />
      <Skeleton animation="wave" width="100%" />
      <Skeleton animation="wave" width="100%" />
      <Skeleton animation="wave" width="100%" />
      <Skeleton animation="wave" width="100%" />
      <Skeleton animation="wave" width="100%" />
      <Skeleton animation="wave" width="100%" />
      <Skeleton animation="wave" width="100%" />
      <Skeleton animation="wave" width="100%" />
      <Skeleton animation="wave" width="100%" />
      <Skeleton animation="wave" width="100%" />
    </Box>
  );
}

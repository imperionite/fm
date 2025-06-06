import { IconButton, Badge, Link } from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { useAtomValue } from "jotai";
import { cartAtom } from "../services/atoms"; // or wherever your cart state is

export default function CartIcon() {
  const cart = useAtomValue(cartAtom); // assuming this returns an array

  return (
    <IconButton component={Link} to="/cart" aria-label="Service Cart">
      <Badge
        badgeContent={cart.length}
        color="secondary"
        showZero={false} // true if you want to show badge at 0
        overlap="rectangular"
      >
        <WorkOutlineIcon />
      </Badge>
    </IconButton>
  );
}

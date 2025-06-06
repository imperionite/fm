import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { Link } from "react-router-dom";
import { useAtomValue } from "jotai";
import { jwtAtom } from "../services/atoms";
import { useCartFetch } from "../services/hooks";

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const jwt = useAtomValue(jwtAtom);
  const isAuthenticated = jwt?.access && jwt.access !== "";

  const { data: cartData } = useCartFetch(jwt?.access);

  const cartItemCount = cartData?.items?.length || 0;

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const navItemsUnauth = ["Home", "About", "Services", "Contact", "Login"];
  const navItemsAuth = ["Home", "About", "Services", "Contact", "Account"];

  const navRoutes = {
    Home: "/",
    About: "/about",
    Services: "/services",
    Contact: "/contact",
    Login: "/login",
    Account: "/account",
  };

  const navItems = isAuthenticated ? navItemsAuth : navItemsUnauth;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" elevation={4}>
        <Toolbar>
          {/* Hamburger menu for mobile */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: "none" } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Site title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FinMark by Imperionite
          </Typography>

          {/* Desktop nav buttons */}
          <Box
            sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}
          >
            {navItems.map((item) => (
              <Button
                key={item}
                color="inherit"
                component={Link}
                to={navRoutes[item]}
                sx={{ ml: 1 }}
              >
                {item}
              </Button>
            ))}

            {/* Cart icon with badge */}
            {isAuthenticated && (
              <IconButton
                color="inherit"
                component={Link}
                to="/cart"
                sx={{ ml: 2 }}
                aria-label={`Cart with ${cartItemCount} items`}
              >
                <Badge
                  badgeContent={cartItemCount}
                  color="secondary"
                  showZero={false}
                >
                  <WorkOutlineIcon />
                </Badge>
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        anchor="left"
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        <List>
          {navItems.map((item) => (
            <ListItem key={item} disablePadding>
              <ListItemButton
                sx={{ textAlign: "center" }}
                component={Link}
                to={navRoutes[item]}
                onClick={toggleDrawer(false)}
              >
                <ListItemText primary={item} />
              </ListItemButton>
            </ListItem>
          ))}

          {/* Mobile drawer cart item */}
          {isAuthenticated && (
            <ListItem disablePadding>
              <ListItemButton
                sx={{ textAlign: "center" }}
                component={Link}
                to="/cart"
                onClick={toggleDrawer(false)}
              >
                <Badge
                  badgeContent={cartItemCount}
                  color="secondary"
                  showZero={false}
                  overlap="circular"
                  sx={{ mr: 1 }}
                >
                  <WorkOutlineIcon />
                </Badge>
                <ListItemText primary="Cart" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </Box>
  );
}

export default Header;

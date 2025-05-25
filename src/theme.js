import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Use light mode for white background
    background: {
      default: '#ffffff', // White background
      paper: '#ffffff',   // Paper surfaces also white
    },
    text: {
      primary: '#212121', // Dark text color (almost black)
      secondary: '#424242', // Slightly lighter for secondary text
    },
    // Optionally override primary and secondary colors to neutral tones
    primary: {
      main: '#455a64', // Blue-grey, professional and neutral
    },
    secondary: {
      main: '#607d8b', // Another neutral blue-grey shade
    },
  },
});

export default theme;

import { createTheme } from '@mui/material/styles'
import { lightBlue, deepOrange } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    primary: {
      main: lightBlue[700],
    },
    secondary: {
      main: lightBlue[400],
    },
    error: {
      main: deepOrange[700],
    },
  },
})

export default theme

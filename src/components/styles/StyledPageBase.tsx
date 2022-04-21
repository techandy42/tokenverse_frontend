import { styled } from '@mui/material/styles'
import {
  MARGIN_TOP,
  MARGIN_LARGE,
  BREAKPOINT_LARGE,
  BREAKPOINT_SMALL,
} from '../../../constants'

const StyledPageBase = styled('div')(({ theme }) => ({
  marginBottom: MARGIN_LARGE,
  marginLeft: 0,
  marginRight: 0,
  [theme.breakpoints.up(BREAKPOINT_SMALL)]: {
    marginLeft: '20px',
    marginRight: '20px',
  },
  [theme.breakpoints.up(BREAKPOINT_LARGE)]: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '960px',
  },
}))

export default StyledPageBase

import { styled } from '@mui/material/styles'
import { BREAKPOINT_SMALL, BREAKPOINT_LARGE } from '../../../../constants'

const DisplayPicture = styled('div')(({ theme }) => ({
  marginLeft: '24px',
  marginRight: '32px',
  [theme.breakpoints.up(BREAKPOINT_SMALL)]: {
    marginLeft: '32px',
    marginRight: '48px',
  },
  [theme.breakpoints.up(BREAKPOINT_LARGE)]: {
    marginLeft: '48px',
    marginRight: '64px',
  },
}))

export default DisplayPicture

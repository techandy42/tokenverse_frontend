import { styled } from '@mui/material/styles'
import { BREAKPOINT_SMALL } from '../../../../constants'

const VerificationBoxUp750 = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up(BREAKPOINT_SMALL)]: {
    display: 'block',
  },
}))

export default VerificationBoxUp750

import { styled } from '@mui/material/styles'
import { BREAKPOINT_SMALL } from '../../../../constants'

const VerificationBoxDown750 = styled('div')(({ theme }) => ({
  display: 'block',
  [theme.breakpoints.up(BREAKPOINT_SMALL)]: {
    display: 'none',
  },
}))

export default VerificationBoxDown750

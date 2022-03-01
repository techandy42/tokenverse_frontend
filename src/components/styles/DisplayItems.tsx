import { styled } from '@mui/material/styles'
import { BREAKPOINT_SMALL } from '../../../constants'

const DisplayItems = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gridGap: '4px',
  marginTop: '4px',
  [theme.breakpoints.up(BREAKPOINT_SMALL)]: {
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gridGap: '12px',
    marginTop: '12px',
  },
}))

export default DisplayItems

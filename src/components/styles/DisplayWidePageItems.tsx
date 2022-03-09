import { styled } from '@mui/material/styles'
import { BREAKPOINT_SMALL, BREAKPOINT_LARGE } from '../../../constants'

const DisplayWidePageItems = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gridGap: '4px',
  marginTop: '4px',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gridGap: '12px',
    marginTop: '12px',
  },
  [theme.breakpoints.up(BREAKPOINT_SMALL)]: {
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  },
  [theme.breakpoints.up('xl')]: {
    gridTemplateColumns: 'repeat(8, minmax(0, 1fr))',
  },
}))

export default DisplayWidePageItems

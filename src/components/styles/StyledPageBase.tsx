import { styled } from '@mui/material/styles'
import { MARGIN_TOP, MARGIN_LARGE } from '../../../constants'

const StyledPageBase = styled('div')(({ theme }) => ({
  marginTop: MARGIN_TOP,
  marginBottom: MARGIN_LARGE,
  marginLeft: '0%',
  marginRight: '0%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: '6%',
    marginRight: '6%',
  },
  [theme.breakpoints.up('md')]: {
    marginLeft: '18%',
    marginRight: '18%',
  },
}))

export default StyledPageBase

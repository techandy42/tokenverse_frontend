import { MARGIN_LARGE, MARGIN_SMALL } from '../../../constants'
import StyledPageBase from '../../components/styles/StyledPageBase'
import Typography from '@mui/material/Typography'

const AccountMetaMaskNotConnected = () => {
  // modify code
  return (
    <StyledPageBase>
      <Typography
        variant='h5'
        sx={{
          marginTop: MARGIN_LARGE,
          marginBottom: MARGIN_SMALL,
          fontWeight: 160,
        }}
        className='font-chakra'
      >
        MetaMask not connected
      </Typography>
      <Typography
        variant='h5'
        sx={{
          marginBottom: MARGIN_SMALL,
          fontWeight: 160,
        }}
        className='font-chakra'
      >
        Please Connect to MetaMask
      </Typography>
    </StyledPageBase>
  )
}

export default AccountMetaMaskNotConnected

import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import default_account_image from '../../../images/default_account_image.jpg'
import getAccount, { IAccountInfo } from '../../../tokenFunctions/getAccount'
import FlexBox from '../styles/FlexBox'
import FlexSpace from '../styles/FlexSpace'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import CopyToClipboardBar from '../styles/CopyToClipboardBar'
import { styled } from '@mui/material/styles'
import { BREAKPOINT_SMALL, BREAKPOINT_LARGE } from '../../../constants'
import Link from 'next/link'
import WebsiteLink from './AccountInfo/WebsiteLink'
import WebAssetIcon from '@mui/icons-material/WebAsset'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import IPersonalInfo from '../../../interfaces/IPersonalInfo'
import AccountVerificationPopup from './AccountVerificationPopup'
import Tooltip from '@mui/material/Tooltip'

// Fetch the personal information of the back-end
const fetchedPersonalInfo: IPersonalInfo = {
  joinedDate: new Date(),
  image: null,
  userName: 'Andy Lee',
  companyName: 'Tokenverse',
  description:
    'I am the founder of Tokenverse, which is an NFT and SFT trading platform for all virtual reality platforms and games.',
  email: 'techandy42@email.com',

  mainLink: 'https://google.com',
  facebookLink: 'https://facebook.com',
  instagramLink: 'https://instagram.com',
  twitterLink: 'https://twitter.com',
  linkedInLink: 'https://linkedin.com',

  verified: false,
  verificationDate: new Date(),
  verificationLink: 'https://google.com',
}

const VerificationBoxUp750 = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up(BREAKPOINT_SMALL)]: {
    display: 'block',
  },
}))

const VerificationBoxDown750 = styled('div')(({ theme }) => ({
  display: 'block',
  [theme.breakpoints.up(BREAKPOINT_SMALL)]: {
    display: 'none',
  },
}))

const DisplayPicture = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
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

const AccountInfo = () => {
  const [accountInfo, setAccountInfo] = useState<IAccountInfo | null>(null)
  const [isAccountVerificationPopupOpen, setIsAccountVerificationPopupOpen] =
    useState<boolean>(false)

  useEffect(() => {
    const callAccount = async () => {
      const accountInfo = await getAccount()
      if (accountInfo !== undefined) {
        setAccountInfo(accountInfo)
      }
    }
    callAccount()
  }, [])

  const displayAccountInfo = () => {
    if (accountInfo !== null) {
      if (accountInfo.errorMessage === null) {
        return (
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <CopyToClipboardBar
              label='Account'
              value={accountInfo.accountAddress}
            />
            <CopyToClipboardBar
              label='Balance'
              value={accountInfo.etherBalance}
            />
          </Box>
        )
      } else {
        return (
          <>
            <Typography sx={{ fontWeight: 200 }}>
              {accountInfo.errorMessage}
            </Typography>
          </>
        )
      }
    } else {
      return (
        <>
          <Typography sx={{ fontWeight: 200 }}>No account info</Typography>
        </>
      )
    }
  }

  const displayVerficationAndEditButtons = () => {
    return (
      <>
        <IconButton
          size='large'
          edge='end'
          color='inherit'
          disableRipple
          sx={{ marginRight: '0.5rem' }}
        >
          {fetchedPersonalInfo.verified ? (
            <Tooltip placement='top' title='Verification Info'>
              <AssignmentTurnedInIcon
                color='primary'
                sx={{ fontSize: 30 }}
                onClick={toggleAccountVerificationPopup}
              />
            </Tooltip>
          ) : (
            <Tooltip placement='top' title='Request Verification'>
              <Link href='/account/verification-request'>
                <AssignmentTurnedInIcon
                  color='disabled'
                  sx={{ fontSize: 30 }}
                  onClick={toggleAccountVerificationPopup}
                />
              </Link>
            </Tooltip>
          )}
        </IconButton>
        <Link href='/account/edit'>
          <Button
            variant='contained'
            size='small'
            sx={{ textTransform: 'none' }}
          >
            Edit
          </Button>
        </Link>
      </>
    )
  }

  const formatPersonalInfoDescription = (
    fetchedPersonalInfoDescription: string,
  ) => {
    if (fetchedPersonalInfoDescription.length > 280) {
      return fetchedPersonalInfoDescription.slice(0, 278) + '..'
    } else {
      return fetchedPersonalInfoDescription
    }
  }

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Set the image file in the back-end
  }

  const toggleAccountVerificationPopup = () => {
    if (!fetchedPersonalInfo.verified) return
    setIsAccountVerificationPopupOpen(!isAccountVerificationPopupOpen)
  }

  return (
    <>
      <FlexBox sx={{ alignItems: 'normal', marginBottom: '4rem' }}>
        <FlexSpace />
        {/* Displaying picture */}
        <DisplayPicture>
          <label htmlFor='file-input'>
            <img
              src={
                fetchedPersonalInfo.image === null
                  ? default_account_image.src
                  : URL.createObjectURL(fetchedPersonalInfo.image)
              }
              style={{
                borderRadius: '50%',
                width: '10rem',
                height: '10rem',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
              alt='No Image Found'
            />
            <input
              id='file-input'
              type='file'
              accept='image/*'
              hidden
              onChange={(e: any) => handleImageFile(e)}
              onClick={(e: any) => {
                e.target.value = null
              }}
            />
          </label>
          {fetchedPersonalInfo.image !== null && (
            <Button disableRipple className='no-hover' sx={{ fontSize: 12 }}>
              Remove
            </Button>
          )}
        </DisplayPicture>
        {/* Displaying information about the user */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <FlexBox
            sx={{
              marginBottom: '0.75rem',
              marginTop: '0.75rem',
            }}
          >
            <Typography
              className='font-chakra'
              variant='h4'
              sx={{ marginRight: '0.75rem' }}
            >
              {fetchedPersonalInfo.userName}
            </Typography>
            <VerificationBoxUp750>
              {displayVerficationAndEditButtons()}
            </VerificationBoxUp750>
          </FlexBox>
          <VerificationBoxDown750>
            {displayVerficationAndEditButtons()}
          </VerificationBoxDown750>
          <Typography
            sx={{
              marginBottom: '1rem',
              fontWeight: 300,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {fetchedPersonalInfo.description !== '' &&
              formatPersonalInfoDescription(fetchedPersonalInfo.description)}
          </Typography>
          <Typography
            color='primary'
            sx={{ marginBottom: '0.5rem', cursor: 'pointer' }}
          >
            More Information
          </Typography>
          {fetchedPersonalInfo.mainLink !== '' && (
            <WebsiteLink
              link={fetchedPersonalInfo.mainLink}
              title={
                <FlexBox>
                  <WebAssetIcon sx={{ fontSize: 20, marginRight: '0.25rem' }} />
                  <span>{fetchedPersonalInfo.mainLink}</span>
                </FlexBox>
              }
            />
          )}
          {fetchedPersonalInfo.facebookLink !== '' && (
            <WebsiteLink
              link={fetchedPersonalInfo.facebookLink}
              title={
                <FlexBox>
                  <FacebookIcon sx={{ fontSize: 20, marginRight: '0.25rem' }} />
                  <span>Facebook Account</span>
                </FlexBox>
              }
            />
          )}
          {fetchedPersonalInfo.instagramLink !== '' && (
            <WebsiteLink
              link={fetchedPersonalInfo.instagramLink}
              title={
                <FlexBox>
                  <InstagramIcon
                    sx={{ fontSize: 20, marginRight: '0.25rem' }}
                  />
                  <span>Instagram Account</span>
                </FlexBox>
              }
            />
          )}
          {fetchedPersonalInfo.twitterLink !== '' && (
            <WebsiteLink
              link={fetchedPersonalInfo.twitterLink}
              title={
                <FlexBox>
                  <TwitterIcon sx={{ fontSize: 20, marginRight: '0.25rem' }} />
                  <span>Twitter Account</span>
                </FlexBox>
              }
            />
          )}
          {fetchedPersonalInfo.linkedInLink !== '' && (
            <WebsiteLink
              link={fetchedPersonalInfo.linkedInLink}
              title={
                <FlexBox>
                  <LinkedInIcon sx={{ fontSize: 20, marginRight: '0.25rem' }} />
                  <span>LinkedIn Account</span>
                </FlexBox>
              }
              lastItem={true}
            />
          )}
          {displayAccountInfo()}
        </Box>
        <Box sx={{ flexGrow: 4 }} />
      </FlexBox>
      {isAccountVerificationPopupOpen && (
        <AccountVerificationPopup
          userName={fetchedPersonalInfo.userName}
          verificationDate={fetchedPersonalInfo.verificationDate}
          verificationLink={fetchedPersonalInfo.verificationLink}
          handleClose={toggleAccountVerificationPopup}
        />
      )}
    </>
  )
}

export default AccountInfo

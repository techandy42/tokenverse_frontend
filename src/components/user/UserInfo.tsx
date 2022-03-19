import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import default_account_image from '../../../images/default_account_image.jpg'
import FlexBox from '../styles/FlexBox'
import FlexSpace from '../styles/FlexSpace'
import Box from '@mui/material/Box'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import CopyToClipboardBar from '../styles/CopyToClipboardBar'
import WebsiteLink from '../account/AccountInfo/WebsiteLink'
import WebAssetIcon from '@mui/icons-material/WebAsset'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import AccountVerificationPopup from '../account/AccountVerificationPopup'
import Tooltip from '@mui/material/Tooltip'
import emptyAddress from '../../../constants/emptyAddress'
import DisplayPicture from '../styles/pageInformations/DisplayPicture'
import formatPersonalInfoString from '../../../helperFunctions/formatPersonalInfoString'
import IUser from '../../../interfaces/schema/IUser'
import initialUserData from '../../../initialData/schema/initialUser'

interface IProps {
  userData: null | IUser
}

const AccountInfo: React.FC<IProps> = ({ userData }) => {
  // Fetching users' informations
  const [fetchedPersonalInfo, setFetchedPersonalInfo] =
    useState<IUser>(initialUserData)
  const [isAccountVerificationPopupOpen, setIsAccountVerificationPopupOpen] =
    useState<boolean>(false)

  useEffect(() => {
    if (userData !== null && userData?.address !== emptyAddress) {
      setFetchedPersonalInfo(userData)
    }
  }, [userData])

  const displayAccountInfo = () => {
    if (userData !== null && userData.address !== emptyAddress) {
      return (
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <CopyToClipboardBar label='Account' value={userData.address} />
        </Box>
      )
    } else {
      return (
        <>
          <Typography sx={{ fontWeight: 200 }}>No account info</Typography>
        </>
      )
    }
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
          <img
            src={
              fetchedPersonalInfo.image === null
                ? default_account_image.src
                : fetchedPersonalInfo.image
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
              sx={{
                marginRight: '2rem',
                fontSize: { xs: 18, sm: 26, md: 34 },
                marginBottom: { xs: '0.5rem', sm: 0 },
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>
                {formatPersonalInfoString(fetchedPersonalInfo.userName, 24)}
              </span>
              <span>
                {fetchedPersonalInfo.verified && (
                  <Tooltip placement='top' title='Verification Info'>
                    <VerifiedUserOutlinedIcon
                      color='primary'
                      sx={{ fontSize: 24 }}
                      onClick={toggleAccountVerificationPopup}
                    />
                  </Tooltip>
                )}
              </span>
            </Typography>
          </FlexBox>
          <Typography
            sx={{
              marginBottom: '0.5rem',
              fontWeight: 400,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {fetchedPersonalInfo.companyName !== '' &&
              formatPersonalInfoString(fetchedPersonalInfo.companyName, 40)}
          </Typography>
          <Typography
            sx={{
              marginBottom: '1rem',
              fontWeight: 300,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {fetchedPersonalInfo.description !== '' &&
              formatPersonalInfoString(fetchedPersonalInfo.description, 280)}
          </Typography>
          {fetchedPersonalInfo.mainLink !== '' && (
            <WebsiteLink
              link={fetchedPersonalInfo.mainLink}
              title={
                <FlexBox>
                  <WebAssetIcon sx={{ fontSize: 16, marginRight: '0.25rem' }} />
                  <span style={{ fontSize: 14 }}>
                    {fetchedPersonalInfo.mainLink}
                  </span>
                </FlexBox>
              }
            />
          )}
          {fetchedPersonalInfo.facebookLink !== '' && (
            <WebsiteLink
              link={fetchedPersonalInfo.facebookLink}
              title={
                <FlexBox>
                  <FacebookIcon sx={{ fontSize: 16, marginRight: '0.25rem' }} />
                  <span style={{ fontSize: 14 }}>Facebook Account</span>
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
                    sx={{ fontSize: 16, marginRight: '0.25rem' }}
                  />
                  <span style={{ fontSize: 14 }}>Instagram Account</span>
                </FlexBox>
              }
            />
          )}
          {fetchedPersonalInfo.twitterLink !== '' && (
            <WebsiteLink
              link={fetchedPersonalInfo.twitterLink}
              title={
                <FlexBox>
                  <TwitterIcon sx={{ fontSize: 16, marginRight: '0.25rem' }} />
                  <span style={{ fontSize: 14 }}>Twitter Account</span>
                </FlexBox>
              }
            />
          )}
          {fetchedPersonalInfo.linkedInLink !== '' && (
            <WebsiteLink
              link={fetchedPersonalInfo.linkedInLink}
              title={
                <FlexBox>
                  <LinkedInIcon sx={{ fontSize: 16, marginRight: '0.25rem' }} />
                  <span style={{ fontSize: 14 }}>LinkedIn Account</span>
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
          handleClose={toggleAccountVerificationPopup}
        />
      )}
    </>
  )
}

export default AccountInfo

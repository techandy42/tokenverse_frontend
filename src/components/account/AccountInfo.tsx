import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import default_account_image from '../../../images/default_account_image.jpg'
import FlexBox from '../styles/FlexBox'
import FlexSpace from '../styles/FlexSpace'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
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
import { selectAccountInfo } from '../../redux/features/accountInfoSlice'
import {
  selectAccountData,
  AccountDataState,
  initialState as initialAccountDataState,
} from '../../redux/features/accountDataSlice'
import { useAppSelector } from '../../redux/app/hooks'
import emptyAddress from '../../../constants/emptyAddress'
import DisplayPicture from '../styles/pageInformations/DisplayPicture'
import VerificationBoxUp750 from '../styles/pageInformations/VerificationBoxUp750'
import VerificationBoxDown750 from '../styles/pageInformations/VerificationBoxDown750'
import formatPersonalInfoString from '../../../helperFunctions/formatPersonalInfoString'

const AccountInfo = () => {
  // Fetching users' informations
  const fetchedAccountInfo = useAppSelector(selectAccountInfo)
  const fetchedAccountData = useAppSelector(selectAccountData)

  const [fetchedPersonalInfo, setPersonalInfo] = useState<AccountDataState>(
    initialAccountDataState,
  )
  const [isAccountVerificationPopupOpen, setIsAccountVerificationPopupOpen] =
    useState<boolean>(false)

  useEffect(() => {
    if (fetchedAccountData.address !== emptyAddress) {
      setPersonalInfo(fetchedAccountData)
    }
  }, [fetchedAccountData])

  const displayAccountInfo = () => {
    if (fetchedAccountInfo.account !== emptyAddress) {
      return (
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <CopyToClipboardBar
            label='Account'
            value={fetchedAccountInfo.account}
          />
          <CopyToClipboardBar
            label='Balance'
            value={fetchedAccountInfo.etherBalance}
          />
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
          <Link href={'/account/edit'}>
            <Tooltip placement='bottom' title='Edit'>
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
            </Tooltip>
          </Link>
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
              sx={{ marginRight: '2rem', fontSize: { xs: 18, sm: 26, md: 34 } }}
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
            <VerificationBoxUp750>
              <Link href='/account/edit'>
                <Button
                  variant='outlined'
                  size='small'
                  sx={{
                    textTransform: 'none',
                  }}
                >
                  Edit
                </Button>
              </Link>
            </VerificationBoxUp750>
          </FlexBox>
          <VerificationBoxDown750>
            <Link href='/account/edit'>
              <Button
                variant='outlined'
                size='small'
                sx={{ textTransform: 'none', marginBottom: '1rem' }}
              >
                Edit
              </Button>
            </Link>
          </VerificationBoxDown750>
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

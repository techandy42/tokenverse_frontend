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

// Fetch the personal information of the back-end
interface IPersonalInfo {
  image: any
  name: string | null
  description: string | null
  link: string | null
  verified: boolean
  verifiedUserName: string
  verificationDate: Date
  verificationInfo: string | null
  verificationFile: any
}

const personalInfo: IPersonalInfo = {
  image:
    'https://www.minuteschool.com/wp-content/uploads/2017/01/programming-technology-1080x630.jpg',
  name: 'Govanni Georgio',
  description:
    'But everyone calls me Georgio. This is a meme description that is supposed to be funny, but it is actually only used for testing the front-end',
  link: 'https://google.com',
  verified: true,
  verifiedUserName: 'Govanni Georgio',
  verificationDate: new Date(),
  verificationInfo: 'This person has been ',
  verificationFile: { info: 'Every product looks valid' },
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
          <AssignmentTurnedInIcon
            color={personalInfo.verified ? 'primary' : 'disabled'}
            sx={{ fontSize: 30 }}
          />
        </IconButton>
        <Button variant='contained' size='small' sx={{ textTransform: 'none' }}>
          Edit
        </Button>
      </>
    )
  }

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Set the image file in the back-end
  }

  return (
    <>
      <FlexBox sx={{ alignItems: 'normal', marginBottom: '4rem' }}>
        <FlexSpace />
        {/* Displaying picture */}
        <DisplayPicture>
          <div>
            <label for='file-input'>
              <img
                src={
                  personalInfo.image === null
                    ? default_account_image.src
                    : personalInfo.image
                }
                style={{
                  borderRadius: '50%',
                  width: '10rem',
                  height: '10rem',
                  cursor: 'pointer',
                }}
                alt='No Image Found'
              />
            </label>
            {personalInfo.image === null ? (
              <input
                id='file-input'
                type='file'
                accept='image/*'
                hidden
                onChange={handleImageFile}
              />
            ) : null}
          </div>
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
              {personalInfo.name}
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
              marginBottom: '0.25rem',
              fontWeight: 300,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {personalInfo.description}
          </Typography>
          <Typography
            color='primary'
            sx={{ marginBottom: '0.25rem', cursor: 'pointer' }}
          >
            More Information
          </Typography>
          <a
            href={personalInfo.link}
            target='_blank'
            style={{ marginBottom: '1.5rem' }}
          >
            <Typography color='primary'>{personalInfo.link}</Typography>
          </a>
          {displayAccountInfo()}
        </Box>
        <Box sx={{ flexGrow: 4 }} />
      </FlexBox>
    </>
  )
}

export default AccountInfo

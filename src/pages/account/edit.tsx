import React, { useState } from 'react'
import IPersonalInfo from '../../../interfaces/IPersonalInfo'
import StyledPageBase from '../../components/styles/StyledPageBase'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { MARGIN_LARGE, MARGIN_SMALL } from '../../../constants'
import DividerMarginBottom from '../../components/styles/DividerMarginBottom'
import { BREAKPOINT_SMALL, BREAKPOINT_LARGE } from '../../../constants'
import default_account_image from '../../../images/default_account_image.jpg'
import FlexBox from '../../components/styles/FlexBox'
import FlexSpace from '../../components/styles/FlexSpace'

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

  verified: true,
  verificationDate: new Date(),
  // place a file here for testing
  verificationFile: null,
}

interface IAlertEmailLinkFields {
  userName: boolean
  email: boolean
  mainLink: boolean
  facebookLink: boolean
  instagramLink: boolean
  twitterLink: boolean
  linkedInLink: boolean
}

const initialAlertEmailLinkFields: IAlertEmailLinkFields = {
  userName: false,
  email: false,
  mainLink: false,
  facebookLink: false,
  instagramLink: false,
  twitterLink: false,
  linkedInLink: false,
}

const edit = () => {
  const [personalInfo, setPersonalInfo] =
    useState<IPersonalInfo>(fetchedPersonalInfo)
  const [alertUserNameEmailLinkFields, setAlertUserNameEmailLinkFields] =
    useState<IAlertEmailLinkFields>(initialAlertEmailLinkFields)

  const handlePersonalInfoChanges = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value })
  }

  const isUserNameValid = (userName: string) => {
    // check if the userName is valid with the userNames in the database
    // the userName must be unique and not empty
    if (userName === '') return false
    return true
  }

  const handleUserNameChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setPersonalInfo({ ...personalInfo, userName: e.target.value })
    if (!isUserNameValid(e.target.value)) {
      setAlertUserNameEmailLinkFields({
        ...alertUserNameEmailLinkFields,
        userName: true,
      })
    } else if (alertUserNameEmailLinkFields.userName) {
      setAlertUserNameEmailLinkFields({
        ...alertUserNameEmailLinkFields,
        userName: false,
      })
    }
  }

  const handleSubmit = (e: React.FormEventHandler<HTMLFormElement>) => {
    e.preventDefault()
    // check for name, email and links validity
    let isInputsInvalid = false
    if (!isUserNameValid(personalInfo.userName)) {
      isInputsInvalid = true
      setAlertUserNameEmailLinkFields({
        ...alertUserNameEmailLinkFields,
        userName: true,
      })
    } else {
      if (alertUserNameEmailLinkFields.userName) {
        setAlertUserNameEmailLinkFields({
          ...alertUserNameEmailLinkFields,
          userName: false,
        })
      }
    }
    // Check for email and links
    if (!isInputsInvalid) {
      // send the personalInfo data to the back-end
      // fetch user account for submitting to the back-end
      setAlertUserNameEmailLinkFields(initialAlertEmailLinkFields)
    }
  }

  return (
    <StyledPageBase>
      <form onSubmit={handleSubmit}>
        <Typography
          variant='h4'
          sx={{
            marginTop: MARGIN_LARGE,
            marginBottom: MARGIN_LARGE,
            fontWeight: 200,
          }}
          className='font-chakra'
        >
          Edit Profile
        </Typography>
        {/* Display Picture and Remove Button */}
        <Box sx={{ marginBottom: MARGIN_LARGE }}>
          <Box sx={{ marginLeft: '2.5rem', marginBottom: MARGIN_SMALL }}>
            <div>
              <label for='file-input'>
                <img
                  src={
                    personalInfo.image === null
                      ? default_account_image.src
                      : URL.createObjectURL(personalInfo.image)
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
              </label>
              <input
                id='file-input'
                type='file'
                accept='image/*'
                hidden
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, image: e.target.files[0] })
                }
                onClick={(e) => {
                  e.target.value = null
                }}
              />
            </div>
          </Box>
          <Box sx={{ marginLeft: '7.5rem' }}>
            {personalInfo.image !== null && (
              <Button
                className='btn'
                sx={{ position: 'relative', transform: 'translateX(-50%)' }}
                onClick={() =>
                  setPersonalInfo({ ...personalInfo, image: null })
                }
              >
                Remove Image
              </Button>
            )}
          </Box>
        </Box>
        <DividerMarginBottom />
        <Typography variant='h5' sx={{ marginBottom: MARGIN_LARGE }}>
          Personal Information
        </Typography>
        {alertUserNameEmailLinkFields.userName && (
          <Alert severity='error' sx={{ marginBottom: MARGIN_LARGE }}>
            {personalInfo.userName === ''
              ? 'The Username cannot be empty'
              : 'The Username Already Exists'}
          </Alert>
        )}
        <TextField
          sx={{ marginBottom: MARGIN_LARGE }}
          fullWidth
          label='Username'
          name='userName'
          value={personalInfo.userName}
          onChange={(e) => handleUserNameChange(e)}
          required
        />
        <TextField
          sx={{ marginBottom: MARGIN_LARGE }}
          fullWidth
          label='Company Name'
          name='companyName'
          value={personalInfo.companyName}
          onChange={handlePersonalInfoChanges}
        />
        <TextField
          sx={{ marginBottom: MARGIN_LARGE }}
          fullWidth
          label='Description'
          name='description'
          value={personalInfo.description}
          onChange={handlePersonalInfoChanges}
          multiline
        />
        {alertUserNameEmailLinkFields.email && (
          <Alert severity='error' sx={{ marginBottom: MARGIN_LARGE }}>
            Invalid Email (Personal / Company Email)
          </Alert>
        )}
        <TextField
          sx={{ marginBottom: MARGIN_LARGE }}
          fullWidth
          label='Personal / Company Email'
          name='email'
          value={personalInfo.email}
          onChange={handlePersonalInfoChanges}
          multiline
        />
        <DividerMarginBottom />
        <Typography variant='h5' sx={{ marginBottom: MARGIN_LARGE }}>
          Website Links
        </Typography>
        {alertUserNameEmailLinkFields.mainLink && (
          <Alert severity='error' sx={{ marginBottom: MARGIN_LARGE }}>
            Invalid Link (Main Link)
          </Alert>
        )}
        <TextField
          sx={{ marginBottom: MARGIN_LARGE }}
          fullWidth
          label='Personal / Company Website Link'
          name='mainLink'
          value={personalInfo.mainLink}
          onChange={handlePersonalInfoChanges}
          multiline
        />
        {alertUserNameEmailLinkFields.facebookLink && (
          <Alert severity='error' sx={{ marginBottom: MARGIN_LARGE }}>
            Invalid Link (Facebook Link)
          </Alert>
        )}
        <TextField
          sx={{ marginBottom: MARGIN_LARGE }}
          fullWidth
          label='Facebook Link'
          name='facebookLink'
          value={personalInfo.facebookLink}
          onChange={handlePersonalInfoChanges}
          multiline
        />
        {alertUserNameEmailLinkFields.instagramLink && (
          <Alert severity='error' sx={{ marginBottom: MARGIN_LARGE }}>
            Invalid Link (Instagram Link)
          </Alert>
        )}
        <TextField
          sx={{ marginBottom: MARGIN_LARGE }}
          fullWidth
          label='Instagram Link'
          name='instagramLink'
          value={personalInfo.instagramLink}
          onChange={handlePersonalInfoChanges}
          multiline
        />
        {alertUserNameEmailLinkFields.twitterLink && (
          <Alert severity='error' sx={{ marginBottom: MARGIN_LARGE }}>
            Invalid Link (Twitter Link)
          </Alert>
        )}
        <TextField
          sx={{ marginBottom: MARGIN_LARGE }}
          fullWidth
          label='Twitter Link'
          name='twitterLink'
          value={personalInfo.twitterLink}
          onChange={handlePersonalInfoChanges}
          multiline
        />
        {alertUserNameEmailLinkFields.linkedInLink && (
          <Alert severity='error' sx={{ marginBottom: MARGIN_LARGE }}>
            Invalid Link (LinkedIn Link)
          </Alert>
        )}
        <TextField
          sx={{ marginBottom: MARGIN_LARGE }}
          fullWidth
          label='LinkedIn Link'
          name='linkedInLink'
          value={personalInfo.linkedInLink}
          onChange={handlePersonalInfoChanges}
          multiline
        />
        <DividerMarginBottom />
        <Button className='btn' type='submit'>
          Submit
        </Button>
      </form>
    </StyledPageBase>
  )
}

export default edit

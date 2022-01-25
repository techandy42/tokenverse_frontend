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
import default_account_image from '../../../images/default_account_image.jpg'
import isEmailValid from '../../../functions/isEmailValid'
import isUrlValid from '../../../functions/isUrlValid'
import FlexBox from '../../components/styles/FlexBox'
import FlexSpace from '../../components/styles/FlexSpace'
import Link from 'next/link'
import multimediaFileToMultimedia from '../../../functions/multimediaFileToMultimedia'

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
  verificationLink: 'https://google.com',
}

const edit = () => {
  const [personalInfo, setPersonalInfo] =
    useState<IPersonalInfo>(fetchedPersonalInfo)
  const [userNameValid, setUserNameValid] = useState<boolean>(true)
  const [emailValid, setEmailValid] = useState<boolean>(true)
  const [mainLinkValid, setMainLinkValid] = useState<boolean>(true)
  const [facebookLinkValid, setFacebookLinkValid] = useState<boolean>(true)
  const [instagramLinkValid, setInstagramLinkValid] = useState<boolean>(true)
  const [twitterLinkValid, setTwitterLinkValid] = useState<boolean>(true)
  const [linkedInLinkValid, setLinkedInLinkValid] = useState<boolean>(true)

  const handlePersonalInfoChanges = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value,
    })
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
      setUserNameValid(false)
    } else {
      if (userNameValid === false) setUserNameValid(true)
    }
  }

  const handleSubmit = (e: React.FormEventHandler<HTMLFormElement>) => {
    e.preventDefault()
    // validates userName, email, and the links
    let isFieldsValid = true
    if (!isUserNameValid(personalInfo.userName)) {
      isFieldsValid = false
      setUserNameValid(false)
    } else {
      if (userNameValid === false) setUserNameValid(true)
    }
    if (!isEmailValid(personalInfo.email)) {
      isFieldsValid = false
      setEmailValid(false)
    } else {
      if (emailValid === false) setEmailValid(true)
    }
    if (!isUrlValid(personalInfo.mainLink)) {
      isFieldsValid = false
      setMainLinkValid(false)
    } else {
      if (mainLinkValid === false) setMainLinkValid(true)
    }
    if (!isUrlValid(personalInfo.facebookLink)) {
      isFieldsValid = false
      setFacebookLinkValid(false)
    } else {
      if (facebookLinkValid === false) setFacebookLinkValid(true)
    }
    if (!isUrlValid(personalInfo.instagramLink)) {
      isFieldsValid = false
      setInstagramLinkValid(false)
    } else {
      if (instagramLinkValid === false) setInstagramLinkValid(true)
    }
    if (!isUrlValid(personalInfo.twitterLink)) {
      isFieldsValid = false
      setTwitterLinkValid(false)
    } else {
      if (twitterLinkValid === false) setTwitterLinkValid(true)
    }
    if (!isUrlValid(personalInfo.linkedInLink)) {
      isFieldsValid = false
      setLinkedInLinkValid(false)
    } else {
      if (linkedInLinkValid === false) setLinkedInLinkValid(true)
    }
    if (isFieldsValid) {
      // Send the data to the back-end
      const modifiedPersonalInfoFields = {
        image: personalInfo.image,
        userName: personalInfo.userName,
        companyName: personalInfo.companyName,
        description: personalInfo.description,
        email: personalInfo.email,
        mainLink: personalInfo.mainLink,
        facebookLink: personalInfo.facebookLink,
        instagramLink: personalInfo.instagramLink,
        twitterLink: personalInfo.twitterLink,
        linkedInLink: personalInfo.linkedInLink,
      }
      // send the info to the back-end
    } else {
      alert('Some of the input fields are invalid')
    }
  }

  return (
    <StyledPageBase>
      <form onSubmit={handleSubmit}>
        <FlexBox>
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
          <FlexSpace />
          <Link href='/account'>
            <Button className='btn'>Back</Button>
          </Link>
        </FlexBox>
        {/* Display Picture and Remove Button */}
        <Box sx={{ marginBottom: MARGIN_LARGE }}>
          <Box sx={{ marginLeft: '2.5rem', marginBottom: MARGIN_SMALL }}>
            <label htmlFor='file-input'>
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
              <input
                id='file-input'
                type='file'
                accept='image/*'
                hidden
                onChange={(e: any) =>
                  setPersonalInfo({
                    ...personalInfo,
                    image: e.target.files[0],
                  })
                }
                onClick={(e: any) => {
                  e.target.value = null
                }}
              />
            </label>
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
        {!userNameValid && (
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
        {!emailValid && (
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
        {!mainLinkValid && (
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
        {!facebookLinkValid && (
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
        {!instagramLinkValid && (
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
        {!twitterLinkValid && (
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
        {!linkedInLinkValid && (
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

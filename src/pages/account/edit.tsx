import React, { useState } from 'react'
import IPersonalInfo from '../../../interfaces/IPersonalInfo'
import StyledPageBase from '../../components/styles/StyledPageBase'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import { MARGIN_LARGE } from '../../../constants'
import DividerMarginBottom from '../../components/styles/DividerMarginBottom'

// Fetch the personal information of the back-end
const fetchedPersonalInfo: IPersonalInfo = {
  joinedDate: new Date(),
  image:
    'https://www.minuteschool.com/wp-content/uploads/2017/01/programming-technology-1080x630.jpg',
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
  email: boolean
  mainLink: boolean
  facebookLink: boolean
  instagramLink: boolean
  twitterLink: boolean
  linkedInLink: boolean
}

const initialAlertEmailLinkFields: IAlertEmailLinkFields = {
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
  const [alertEmailLinkFields, setAlertEmailLinkFields] =
    useState<IAlertEmailLinkFields>(initialAlertEmailLinkFields)

  const handlePersonalInfoChanges = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEventHandler<HTMLFormElement>) => {
    // check for email and links validity
    e.preventDefault()
    // send the personalInfo data to the back-end
  }

  return (
    <form onSubmit={handleSubmit}>
      <StyledPageBase>
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
        <DividerMarginBottom />
        <Typography variant='h5' sx={{ marginBottom: MARGIN_LARGE }}>
          Personal Information
        </Typography>
        <TextField
          sx={{ marginBottom: MARGIN_LARGE }}
          fullWidth
          label='Username'
          name='userName'
          value={personalInfo.userName}
          onChange={handlePersonalInfoChanges}
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
        {alertEmailLinkFields.email && (
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
        {alertEmailLinkFields.mainLink && (
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
        {alertEmailLinkFields.facebookLink && (
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
        {alertEmailLinkFields.instagramLink && (
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
        {alertEmailLinkFields.twitterLink && (
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
        {alertEmailLinkFields.linkedInLink && (
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
      </StyledPageBase>
    </form>
  )
}

export default edit

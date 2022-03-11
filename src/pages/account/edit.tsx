import React, { useState, useEffect } from 'react'
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
import isEmailValid from '../../../helperFunctions/isEmailValid'
import isUrlValid from '../../../helperFunctions/isUrlValid'
import FlexBox from '../../components/styles/FlexBox'
import FlexSpace from '../../components/styles/FlexSpace'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks'
import { selectAccountInfo } from '../../redux/features/accountInfoSlice'
import {
  updateAccountData,
  selectAccountData,
} from '../../redux/features/accountDataSlice'
import {
  usersPut,
  IUserNewInfo,
} from '../../../crudFunctions/users/usersRequests'
import { useRouter } from 'next/router'
import getFileUrl from '../../../tokenFunctions/getters/getFileUrl'
import { currentUrl } from '../../../constants/currentUrl'
import doesUserNameExist from '../../../helperFunctions/doesUserNameExist'
import removeWhitespaces from '../../../helperFunctions/removeWhitespaces'
import emptyAddress from '../../../constants/emptyAddress'
import AccountMetaMaskNotConnected from '../../components/account/AccountMetaMaskNotConnected'

const initialPersonInfo: IPersonalInfo = {
  joinedDate: new Date(0, 0, 0, 0, 0, 0),
  image: null,
  userName: '',
  companyName: '',
  description: '',
  email: '',

  mainLink: '',
  facebookLink: '',
  instagramLink: '',
  twitterLink: '',
  linkedInLink: '',

  verified: false,
  verificationDate: new Date(0, 0, 0, 0, 0, 0),
}

const edit = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  // To fetch accountInfo
  const accountInfo = useAppSelector(selectAccountInfo)
  // To fetch accountData
  const accountData = useAppSelector(selectAccountData)

  const [personalInfo, setPersonalInfo] =
    useState<IPersonalInfo>(initialPersonInfo)
  const [originalUserName, setOriginalUserName] = useState<string>('')
  const [userNameValid, setUserNameValid] = useState<boolean>(true)
  const [emailValid, setEmailValid] = useState<boolean>(true)
  const [mainLinkValid, setMainLinkValid] = useState<boolean>(true)
  const [facebookLinkValid, setFacebookLinkValid] = useState<boolean>(true)
  const [instagramLinkValid, setInstagramLinkValid] = useState<boolean>(true)
  const [twitterLinkValid, setTwitterLinkValid] = useState<boolean>(true)
  const [linkedInLinkValid, setLinkedInLinkValid] = useState<boolean>(true)

  /* MetaMask Connection Code Starts */
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState<boolean>(true)
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)

  useEffect(() => {
    if (!isInitialLoad) {
      if (accountInfo.account !== emptyAddress) {
        setIsMetaMaskConnected(true)
      } else {
        setIsMetaMaskConnected(false)
      }
    } else {
      setIsInitialLoad(false)
    }
  }, [accountInfo])
  /* MetaMask Connection Code Ends */

  useEffect(() => {
    const fetchedPersonalInfo: IPersonalInfo = {
      joinedDate: accountData.createdAt,
      image: accountData.image,
      userName: accountData.userName,
      companyName: accountData.companyName,
      description: accountData.description,
      email: accountData.email,

      mainLink: accountData.mainLink,
      facebookLink: accountData.facebookLink,
      instagramLink: accountData.instagramLink,
      twitterLink: accountData.twitterLink,
      linkedInLink: accountData.linkedInLink,

      verified: accountData.verified,
      verificationDate: accountData.verificationDate,
    }
    setOriginalUserName(accountData.userName)
    setPersonalInfo(fetchedPersonalInfo)
  }, [accountData])

  const handlePersonalInfoChanges = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEventHandler<HTMLFormElement>) => {
    e.preventDefault()
    try {
      /* pre-validation code */
      // get ipfs url for image
      let imageUrl = null
      const image: any = personalInfo.image
      if (image instanceof File) {
        imageUrl = await getFileUrl(personalInfo.image)
      } else {
        imageUrl = personalInfo.image
      }
      imageUrl = imageUrl === undefined ? null : imageUrl

      const userName = removeWhitespaces(personalInfo.userName)
      const companyName = removeWhitespaces(personalInfo.companyName)
      const description = removeWhitespaces(personalInfo.description)
      const email = removeWhitespaces(personalInfo.email)
      const mainLink = removeWhitespaces(personalInfo.mainLink)
      const facebookLink = removeWhitespaces(personalInfo.facebookLink)
      const instagramLink = removeWhitespaces(personalInfo.instagramLink)
      const twitterLink = removeWhitespaces(personalInfo.twitterLink)
      const linkedInLink = removeWhitespaces(personalInfo.linkedInLink)

      /* validation code for userName, email, and the links starts */
      let isFieldsValid = true
      if (accountData.userName === userName) {
        // userName hasn't changed
        if (userName === '') {
          // userName is empty (invalid)
          console.log('userName invalid, userName unchanged')
          isFieldsValid = false
          setUserNameValid(false)
        } else {
          // userName is valid
          console.log('userName valid, userName unchanged')
          if (userNameValid === false) setUserNameValid(true)
        }
      } else {
        // userName has changed
        if ((await doesUserNameExist(userName)) || userName === '') {
          // userName exists or it is empty (invalid)
          console.log('userName invalid, userName changed')
          isFieldsValid = false
          setUserNameValid(false)
        } else {
          // userName is valid
          console.log('userName valid, userName changed')
          if (userNameValid === false) setUserNameValid(true)
        }
      }

      if (!isEmailValid(email) && email !== '') {
        isFieldsValid = false
        setEmailValid(false)
      } else {
        if (emailValid === false) setEmailValid(true)
      }
      if (!isUrlValid(mainLink) && mainLink !== '') {
        isFieldsValid = false
        setMainLinkValid(false)
      } else {
        if (mainLinkValid === false) setMainLinkValid(true)
      }
      if (!isUrlValid(facebookLink) && facebookLink !== '') {
        isFieldsValid = false
        setFacebookLinkValid(false)
      } else {
        if (facebookLinkValid === false) setFacebookLinkValid(true)
      }
      if (!isUrlValid(instagramLink) && instagramLink !== '') {
        isFieldsValid = false
        setInstagramLinkValid(false)
      } else {
        if (instagramLinkValid === false) setInstagramLinkValid(true)
      }
      if (!isUrlValid(twitterLink) && twitterLink !== '') {
        isFieldsValid = false
        setTwitterLinkValid(false)
      } else {
        if (twitterLinkValid === false) setTwitterLinkValid(true)
      }
      if (!isUrlValid(linkedInLink) && linkedInLink !== '') {
        isFieldsValid = false
        setLinkedInLinkValid(false)
      } else {
        if (linkedInLinkValid === false) setLinkedInLinkValid(true)
      }
      if (isFieldsValid) {
        // Send the data to the back-end
        const modifiedPersonalInfoFields: IUserNewInfo = {
          image: imageUrl,
          userName: userName,
          companyName: companyName,
          description: description,
          email: email,
          mainLink: mainLink,
          facebookLink: facebookLink,
          instagramLink: instagramLink,
          twitterLink: twitterLink,
          linkedInLink: linkedInLink,
        }

        // send the info to the back-end
        const userInfo = await usersPut(
          accountInfo.account,
          modifiedPersonalInfoFields,
        )

        // Display unserInfo
        console.log('userInfo: ', userInfo)

        // Update accountData in Redux
        const data = {
          email: userInfo.data.email,
          address: userInfo.data.address,
          companyName: userInfo.data.companyName,
          createdAt: userInfo.data.createdAt,
          description: userInfo.data.description,
          facebookLink: userInfo.data.facebookLink,
          image: userInfo.data.image,
          instagramLink: userInfo.data.instagramLink,
          linkedInLink: userInfo.data.linkedInLink,
          mainLink: userInfo.data.mainLink,
          twitterLink: userInfo.data.twitterLink,
          userName: userInfo.data.userName,
          verified: userInfo.data.verified,
          verificationDate: userInfo.data.verificationDate,
          role: userInfo.data.role,
        }

        dispatch(updateAccountData(data))

        // push to account page
        router.push(`${currentUrl}/account`)
      } else {
        // some of the fields invalid
        alert('Some of the input fields are invalid')
      }
    } catch (error) {
      console.log(error)
    }
  }

  /* MetaMask Connection Code Starts */
  if (!isMetaMaskConnected) {
    // handle this code later
    // import AccountMetaMaskNotConnected from '../../../components/account/AccountMetaMaskNotConnected'
    return <AccountMetaMaskNotConnected />
  }
  /* MetaMask Connection Code Ends */

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
                    : typeof personalInfo.image === 'string'
                    ? personalInfo.image
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

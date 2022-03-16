import React, { useState, useEffect } from 'react'
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
import removeWhitespaces from '../../../helperFunctions/removeWhitespaces'
import emptyAddress from '../../../constants/emptyAddress'
import AccountMetaMaskNotConnected from '../../components/account/AccountMetaMaskNotConnected'
import {
  collectionsGet,
  collectionsChangeInfoPut,
  INewCollectionInfo,
} from '../../../crudFunctions/collections/collectionsRequests'
import { ICollectionInfo } from '../../pages/collection/[id]/edit'
import {
  selectCollections,
  updateCollections,
} from '../../redux/features/collectionsSlice'
import doesCollectionExist from '../../../helperFunctions/doesCollectionExist'

interface IProps {
  collectionInfo: ICollectionInfo
  setCollectionInfo: React.Dispatch<
    React.SetStateAction<ICollectionInfo | null>
  >
  originalCollectionName: string | null
  collectionId: string
  isCreator: boolean
}

const CollectionEdit: React.FC<IProps> = ({
  collectionInfo,
  setCollectionInfo,
  originalCollectionName,
  collectionId,
  isCreator,
}) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const collectionsState = useAppSelector(selectCollections)
  const collections = collectionsState.collections

  const [newNameValid, setNewNameValid] = useState<boolean>(true)

  console.log('collections: ', collections)

  const handleCollectionInfoChanges = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setCollectionInfo({
      ...collectionInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEventHandler<HTMLFormElement>) => {
    if (collectionInfo === null || originalCollectionName === null) {
      console.log('Error fetching some collection info')
      return
    }
    // validate if it is valid user
    e.preventDefault()
    try {
      /* pre-validation code */
      // get ipfs url for image
      let imageUrl = null
      const image: any = collectionInfo.image
      if (image instanceof File) {
        imageUrl = await getFileUrl(collectionInfo.image)
      } else {
        imageUrl = collectionInfo.image
      }
      imageUrl = imageUrl === undefined ? null : imageUrl

      // testing
      console.log('imageUrl: ', imageUrl)

      const newName = removeWhitespaces(collectionInfo.newName)
      const description = removeWhitespaces(collectionInfo.description)

      /* validation code for newName starts */
      let isFieldsValid = true
      let isSameName = true
      if (originalCollectionName === newName) {
        // newName hasn't changed
        if (newName === '') {
          // newName is empty (invalid)
          console.log('newName invalid, newName unchanged')
          isFieldsValid = false
          setNewNameValid(false)
        } else {
          // newName is valid
          console.log('newName valid, newName unchanged')
          setNewNameValid(true)
        }
      } else {
        // newName has changed
        isSameName = false
        const existingName = await doesCollectionExist(newName)
        console.log('existingName: ', existingName)
        if (existingName || newName === '') {
          // newName exists or it is empty (invalid)
          console.log('newName invalid, newName changed')
          isFieldsValid = false
          setNewNameValid(false)
        } else {
          // newName is valid
          console.log('newName valid, newName changed')
          setNewNameValid(true)
        }
      }
      /* validation code for newName ends */

      if (isFieldsValid) {
        const modifiedCollectionInfoFields: INewCollectionInfo = {
          newName: collectionInfo.newName,
          image: imageUrl,
          description: collectionInfo.description,
          isSameName,
        }

        const newCollectionInfo = await collectionsChangeInfoPut(
          originalCollectionName,
          modifiedCollectionInfoFields,
        )

        // update the collections
        dispatch(updateCollections(collections))

        // Display newCollectionInfo
        console.log('collectionInfo: ', newCollectionInfo)

        // push to current collection page
        router.push(`${currentUrl}/collection/${newName}`)
      } else {
        // the name field is invalid
        alert('The name field is invalid')
      }
    } catch (error) {
      console.log(error)
    }
  }

  console.log('newNameValid: ', newNameValid)

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
          <Link href={`/collection/${collectionId}`}>
            <Button className='btn'>Back</Button>
          </Link>
        </FlexBox>
        {/* Display Picture and Remove Button */}
        <Box sx={{ marginBottom: MARGIN_LARGE }}>
          <Box sx={{ marginLeft: '2.5rem', marginBottom: MARGIN_SMALL }}>
            <label htmlFor='file-input'>
              <img
                src={
                  collectionInfo.image === null
                    ? default_account_image.src
                    : typeof collectionInfo.image === 'string'
                    ? collectionInfo.image
                    : URL.createObjectURL(collectionInfo.image)
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
                  setCollectionInfo({
                    ...collectionInfo,
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
            {collectionInfo.image !== null && (
              <Button
                className='btn'
                sx={{ position: 'relative', transform: 'translateX(-50%)' }}
                onClick={() =>
                  setCollectionInfo({ ...collectionInfo, image: null })
                }
              >
                Remove Image
              </Button>
            )}
          </Box>
        </Box>
        <DividerMarginBottom />
        <Typography variant='h5' sx={{ marginBottom: MARGIN_LARGE }}>
          Collection Information
        </Typography>
        {!newNameValid && (
          <Alert severity='error' sx={{ marginBottom: MARGIN_LARGE }}>
            {collectionInfo.newName === ''
              ? 'The NewName cannot be empty'
              : 'The NewName Already Exists'}
          </Alert>
        )}
        <TextField
          sx={{ marginBottom: MARGIN_LARGE }}
          fullWidth
          label='Name'
          name='newName'
          value={collectionInfo.newName}
          onChange={handleCollectionInfoChanges}
          required
        />
        <TextField
          sx={{ marginBottom: MARGIN_LARGE }}
          fullWidth
          label='Description'
          name='description'
          value={collectionInfo.description}
          onChange={handleCollectionInfoChanges}
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

export default CollectionEdit

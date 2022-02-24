/* Creates a single token */
/* Tested, no bug */

import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import DividerMarginBottom from '../styles/DividerMarginBottom'
import FileUploadAndDisplay from './createSingle/FileUploadAndDisplay'
// import { collections } from '../../pages/create'
import { MARGIN_LARGE, MARGIN_SMALL } from '../../../constants'
import TokenTypeInputs from './createShared/TokenTypeInputs'
import Alert from '@mui/material/Alert'
import blockchainTypes from '../../../constants/blockchainTypes'
import ercTypes from '../../../constants/ercTypes'
import createItem from '../../../tokenFunctions/create_set_delete/createItem'
import getFileUrl from '../../../tokenFunctions/getters/getFileUrl'
import IData from '../../../interfaces/IData'
import IItem from '../../../interfaces/IItem'
import formatDataFields from '../../../helperFunctions/dataFields/formatDataFields'
import { BlockchainType, ErcType } from '../../../enums/nftMetadata'
import { nftsPost, INft } from '../../../crudFunctions/nfts/nftsRequests'
import fetchItemByTokenId from '../../../tokenFunctions/getters/fetchItemByTokenId'
import { selectAccountInfo } from '../../redux/features/accountInfoSlice'
import { useAppSelector } from '../../redux/app/hooks'

// Delete these
import ICollection from '../../../interfaces/schema/ICollection'
import emptyAddress from '../../../constants/emptyAddress'
import { usersGet } from '../../../crudFunctions/users/usersRequests'
import { collectionsPost } from '../../../crudFunctions/collections/collectionsRequests'

interface IProps {
  clearCounter: number
  setClearCounter: React.Dispatch<React.SetStateAction<number>>
}

const CreateSingle: React.FC<IProps> = ({ clearCounter, setClearCounter }) => {
  // To fetch accountInfo
  const accountInfo = useAppSelector(selectAccountInfo)
  const [collections, setCollections] = useState<string[]>([])
  const [collection, setCollection] = useState<string>('')
  const [blockchainType, setBlockchainType] = useState<string>(
    blockchainTypes[0],
  )
  const [ercType, setErcType] = useState<string>(ercTypes[0])
  const [name, setName] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [multimediaImageFile, setMultimediaImageFile] = useState<File | null>(
    null,
  )
  const [isFileErrorOpen, setIsFileErrorOpen] = useState<boolean>(false)
  const [isMultimediaImageFileErrorOpen, setIsMultimediaImageFileErrorOpen] =
    useState<boolean>(false)
  const [isSubmissionProcessing, setIsSubmissionProcessing] =
    useState<boolean>(false)
  const [collectionResetCounter, setCollectionResetCounter] =
    useState<number>(0)

  console.log('accountInfo: ', accountInfo)

  // bugs inside the function, rewrite the function
  // maybe fetch the collections when the account is first fetched at Main

  // useEffect(() => {
  //   const getCollections = async () => {
  //     try {
  //       // update collections and collection
  //       const fetchedUserInfo = await usersGet(accountInfo.account)
  //       if (fetchedUserInfo === undefined)
  //         throw { error: 'User info not found' }
  //       const fetchedCollections: ICollection[] =
  //         fetchedUserInfo.data.collections
  //       let isAtLeastOneCollectionNotModified = false
  //       for (const fetchedCollection of fetchedCollections) {
  //         if (fetchedCollection.isNameModified === false) {
  //           isAtLeastOneCollectionNotModified = true
  //         }
  //       }
  //       let collectionNames: string[] = fetchedCollections.map(
  //         (fetchedCollection) => fetchedCollection.name,
  //       )
  //       let collectionsIsNameModified: boolean[] = fetchedCollections.map(
  //         (fetchedCollection) => fetchedCollection.isNameModified,
  //       )
  //       /*
  //       if (!isAtLeastOneCollectionNotModified) {
  //         const newCollection = await collectionsPost(accountInfo.account)
  //         console.log('newCollection: ', newCollection)
  //         if (newCollection === undefined)
  //           throw { error: 'error while creating a new collection' }
  //         collectionNames = [newCollection.data.name, ...collectionNames]
  //         collectionsIsNameModified = [
  //           newCollection.data.isNameModified,
  //           ...collectionsIsNameModified,
  //         ]
  //       }
  //       */
  //       setCollections(collectionNames)
  //       setCollection(collectionNames[0])
  //       setCollectionsIsNameModified(collectionsIsNameModified)
  //     } catch (error) {
  //       console.log(error)
  //       alert(
  //         'User information has not been found. Please refresh the page, or use a different account.',
  //       )
  //     }
  //   }
  //   if (accountInfo.account !== emptyAddress) {
  //     getCollections()
  //   }
  // }, [accountInfo, collectionResetCounter])

  useEffect(() => {
    if (file !== null) setIsFileErrorOpen(false)
    if (multimediaImageFile !== null) setIsMultimediaImageFileErrorOpen(false)
  }, [file, multimediaImageFile])

  useEffect(() => {
    setCollection(collections[0])
    setBlockchainType(blockchainTypes[0])
    setErcType(ercTypes[0])
    setName('')
    setFile(null)
    setMultimediaImageFile(null)
    setIsFileErrorOpen(false)
    setIsMultimediaImageFileErrorOpen(false)
    setIsFileErrorOpen(false)
    setIsMultimediaImageFileErrorOpen(false)
    setIsSubmissionProcessing(false)
  }, [clearCounter])

  const validImageFile = () => {
    if (file === null) return false
    else return true
  }

  const validMultimediaImageFile = () => {
    if (
      file !== null &&
      file?.type.split('/')[0] !== 'image' &&
      multimediaImageFile === null
    )
      return false
    else return true
  }

  const handleSubmit = async (e: React.FormEventHandler<HTMLFormElement>) => {
    e.preventDefault()
    // set submission button to processing button
    setIsSubmissionProcessing(true)

    let validedImageFile = true
    let validedMultimediaImageFile = true
    let validFileUrl = true
    let validMultimediaFileUrl = true
    try {
      // format data (and set appropriate type(s))
      const imageFile =
        file.type.split('/')[0] === 'image' ? file : multimediaImageFile
      const fileUrl = await getFileUrl(imageFile)
      const multimediaFileUrl =
        file.type.split('/')[0] === 'image' ? null : await getFileUrl(file)
      validedImageFile = validImageFile()
      validedMultimediaImageFile = validMultimediaImageFile()
      validFileUrl = fileUrl !== undefined
      validMultimediaFileUrl = multimediaFileUrl !== undefined

      // validate data
      if (
        !validedImageFile ||
        !validedMultimediaImageFile ||
        !validFileUrl ||
        !validMultimediaFileUrl
      ) {
        throw {
          error:
            'Invalid image, multimedia image, file url, or multimedia file url',
        }
      }

      // format data (and set appropriate type(s))
      const typeCheckedBlockchainType: BlockchainType =
        BlockchainType.POLYGON === blockchainType
          ? BlockchainType.POLYGON
          : BlockchainType.POLYGON
      const typeCheckedErcType: ErcType =
        ErcType.ERC_721 === ercType
          ? ErcType.ERC_721
          : ErcType.ERC_1155 === ercType
          ? ErcType.ERC_1155
          : ErcType.ERC_721

      // format dataFields
      const dataFields: IData = formatDataFields(
        name,
        collection[0],
        typeCheckedBlockchainType,
        typeCheckedErcType,
        fileUrl,
        multimediaFileUrl,
      )
      let tokenId = 0
      let item: IItem | null = null
      if (typeCheckedErcType === ErcType.ERC_721) {
        // create item
        tokenId = await createItem(dataFields)

        // validate tokenId
        if (tokenId < 1) throw { error: `Invalid tokenId: ${tokenId}` }

        // fetch token
        item = await fetchItemByTokenId(tokenId, accountInfo.account)
      } else if (typeCheckedErcType === ErcType.ERC_1155) {
        // handle ERC_1155 functions
      } else {
        throw { error: `Erc Type invalid: ${typeCheckedErcType}` }
      }

      // validate item
      if (item === null) {
        throw { error: 'Item cannot be null' }
      }

      const crudItem: INft = {
        address: item?.creator.toLowerCase(),
        name: item?.name,
        blockchainType: item?.blockchainType,
        fileUrl: item?.fileUrl,
        multimediaFileUrl: item?.multimedia,
        tokenId: item?.tokenId,
        itemId: item?.itemId,
        collection: item?.collection,
        ercType: item?.ercType,
      }

      // send data to back-end
      const nft = await nftsPost(crudItem)
      console.log('nft: ', nft)
    } catch (error) {
      console.log('Something went wrong while creating single token', error)
    }

    // clear all states
    setClearCounter(clearCounter + 1)
    if (!validedImageFile) setIsFileErrorOpen(true)
    if (!validedMultimediaImageFile) setIsMultimediaImageFileErrorOpen(true)
    // increase collection reset counter, which triggers the collections to re-render
    setCollectionResetCounter(collectionResetCounter + 1)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Typography
        variant='h3'
        sx={{
          marginTop: MARGIN_LARGE,
          marginBottom: MARGIN_LARGE,
          fontWeight: 200,
        }}
        className='font-chakra'
      >
        Create Single Token
      </Typography>
      {isFileErrorOpen && (
        <Alert severity='error' sx={{ marginBottom: MARGIN_SMALL }}>
          No File Added
        </Alert>
      )}
      {isMultimediaImageFileErrorOpen && (
        <Alert severity='error' sx={{ marginBottom: MARGIN_SMALL }}>
          No Image Added
        </Alert>
      )}
      <FileUploadAndDisplay
        file={file}
        setFile={setFile}
        multimediaImageFile={multimediaImageFile}
        setMultimediaImageFile={setMultimediaImageFile}
      />
      <TextField
        sx={{ marginBottom: MARGIN_LARGE }}
        fullWidth
        label='Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TokenTypeInputs
        collections={collections}
        setCollections={setCollections}
        collection={collection}
        setCollection={setCollection}
        blockchainType={blockchainType}
        setBlockchainType={setBlockchainType}
        ercType={ercType}
        setErcType={setErcType}
      />
      <DividerMarginBottom />
      {!isSubmissionProcessing ? (
        <>
          <Button
            variant='contained'
            type='submit'
            sx={{
              marginBottom: MARGIN_LARGE,
              textTransform: 'none',
              width: '12rem',
            }}
          >
            Create Digital Asset
          </Button>
        </>
      ) : (
        <>
          <Button
            variant='outlined'
            sx={{
              marginBottom: MARGIN_LARGE,
              textTransform: 'none',
              width: '12rem',
            }}
          >
            Processing
          </Button>
        </>
      )}
    </form>
  )
}

export default CreateSingle

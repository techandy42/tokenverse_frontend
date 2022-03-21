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
import { selectAccountData } from '../../redux/features/accountDataSlice'
import { useAppSelector, useAppDispatch } from '../../redux/app/hooks'
import {
  updateCollections,
  selectCollections,
} from '../../redux/features/collectionsSlice'
import ICollection from '../../../interfaces/schema/ICollection'
import emptyAddress from '../../../constants/emptyAddress'
import { collectionsPost } from '../../../crudFunctions/collections/collectionsRequests'

interface IProps {
  clearCounter: number
  setClearCounter: React.Dispatch<React.SetStateAction<number>>
}

const CreateSingle: React.FC<IProps> = ({ clearCounter, setClearCounter }) => {
  /* global user state fetching code starts */
  const dispatch = useAppDispatch()

  // Fetching users' informations
  const accountInfo = useAppSelector(selectAccountInfo)
  const accountData = useAppSelector(selectAccountData)
  const fetchedCollectionsData = useAppSelector(selectCollections)
  const fetchedCollections: ICollection[] = fetchedCollectionsData.collections
  /* global user state fetching code ends */

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

  /* collections fetching code starts */
  const [fetchedCollectionsLoaded, setFetchedCollectionsLoaded] =
    useState<boolean>(false)
  const [userAddress, setUserAddress] = useState<string>(emptyAddress)

  // updates collections and collection when fetchedCollections and userAddress changes
  // creates a new collection if no collection exists for the user
  useEffect(() => {
    const createNewCollection = async () => {
      if (userAddress === emptyAddress) return

      // check if accountInfo exists
      const newCollectionData = await collectionsPost(userAddress)
      const newCollection: ICollection = {
        createdAt: newCollectionData.data.createdAt,
        description: newCollectionData.data.description,
        image: newCollectionData.data.image,
        isNameModified: newCollectionData.data.isNameModified,
        name: newCollectionData.data.name,
        uuid: newCollectionData.data.uuid,
      }

      const updatedCollections: ICollection[] = [
        ...fetchedCollections,
        newCollection,
      ]

      dispatch(updateCollections(updatedCollections))
    }

    if (!fetchedCollectionsLoaded) {
      setFetchedCollectionsLoaded(true)
      console.log('fetchedCollections loading...')
    } else {
      if (fetchedCollections.length === 0) {
        if (
          userAddress === emptyAddress ||
          accountInfo.account !== userAddress
        ) {
          console.log('fetchedCollections is empty. UserAccount is empty')
        } else {
          console.log('fetchedCollections is empty. Creating a new collection')

          createNewCollection()
        }
      } else {
        console.log('fetchedCollections: ', fetchedCollections)

        // true if there is a collection that hasn't been modified
        const indexIsNameNotModified = fetchedCollections
          .map((fetchedCollection) => fetchedCollection.isNameModified)
          .some((isNameModified) => isNameModified === false)
        if (!indexIsNameNotModified) {
          // if there isn't a collection that hasn't been modified

          console.log(
            'fetchedCollections only contain collections that has been modified. Creating a new collection',
          )

          createNewCollection()
        } else {
          // if there is a collection that hasn't been modified

          // update collections and collection state
          const fetchedCollectionsNames = fetchedCollections.map(
            (fetchedCollection) => fetchedCollection.name,
          )
          setCollections(fetchedCollectionsNames)
          setCollection(fetchedCollectionsNames[0])
        }
      }
    }
  }, [fetchedCollections, userAddress])

  // updates userAddress when accountData changes
  useEffect(() => {
    if (accountData.address !== emptyAddress) {
      setUserAddress(accountData.address)
    }
  }, [accountData])
  /* collections fetching code ends */

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
        alert('Invalid files')
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

      // fetch collection uuid and validate it
      let uuid = ''
      for (const fetchedCollection of fetchedCollections) {
        if (fetchedCollection.name === collection) {
          uuid = fetchedCollection.uuid
          break
        }
      }
      if (uuid === '') {
        alert("Collection's uuid does not exist")
        throw {
          error: `uuid for the collection name ${collection} does not exist`,
        }
      }

      // format dataFields
      // updated with new fields
      const dataFields: IData = formatDataFields(
        fileUrl,
        multimediaFileUrl,
        '',
        '',
        '',
        name,
        new Array(),
      )
      let tokenId = 0
      let item: IItem | null = null
      if (typeCheckedErcType === ErcType.ERC_721) {
        // create item
        tokenId = await createItem(dataFields)

        // validate tokenId
        if (tokenId < 1) throw { error: `Invalid tokenId: ${tokenId}` }

        // fetch token
        item = await fetchItemByTokenId(tokenId)
      } else if (typeCheckedErcType === ErcType.ERC_1155) {
        // handle ERC_1155 functions
      } else {
        alert('Erc Type is invalid')
        throw { error: `Erc Type invalid: ${typeCheckedErcType}` }
      }

      // validate item
      if (item === null) {
        alert('Item does not exist')
        throw { error: 'Item cannot be null' }
      }

      // updated with new fields
      const crudItem: INft = {
        address: item?.creator.toLowerCase(),
        name: item?.name,
        blockchainType: item?.blockchainType,
        image: item?.image,
        animationUrl: item?.animationUrl,
        tokenId: item?.tokenId,
        itemId: item?.itemId,
        collection,
        ercType: item?.ercType,
      }

      // send data to back-end
      const nft = await nftsPost(crudItem)
      console.log('nft: ', nft)
    } catch (error) {
      alert(
        'Something went wrong while creating the token. Please try with a different token settings or account',
      )
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

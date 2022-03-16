/* Creates multiple tokens */
/* Tested, no bug */

import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { MARGIN_LARGE, MARGIN_SMALL } from '../../../constants'
import FilesUploadAndDisplay from './createMultiple/FilesUploadAndDisplay'
import DividerMarginBottom from '../styles/DividerMarginBottom'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import blockchainTypes from '../../../constants/blockchainTypes'
import ercTypes from '../../../constants/ercTypes'
import TokenTypeInputs from './createShared/TokenTypeInputs'
import Names from './createMultiple/Names'
import createItems from '../../../tokenFunctions/create_set_delete/createItems'
import getFileUrl from '../../../tokenFunctions/getters/getFileUrl'
import IData from '../../../interfaces/IData'
import IItem from '../../../interfaces/IItem'
import { BlockchainType, ErcType } from '../../../enums/nftMetadata'
import formatDataFields from '../../../helperFunctions/dataFields/formatDataFields'
import fetchItemsByTokenIds from '../../../tokenFunctions/getters/fetchItemsByTokenIds'
import {
  nftsPostMultiple,
  INfts,
} from '../../../crudFunctions/nfts/nftsRequests'
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

const CreateMultiple: React.FC<IProps> = ({
  clearCounter,
  setClearCounter,
}) => {
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
  const [genericName, setGenericName] = useState<string>('')
  const [names, setNames] = useState<string[]>([])
  const [files, setFiles] = useState<[File, File | null][]>([])
  const [isFileErrorOpen, setIsFileErrorOpen] = useState<boolean>(false)
  const [isMultimediaImageFileErrorOpen, setIsMultimediaImageFileErrorOpen] =
    useState<boolean>(false)
  const [isSubmissionProcessing, setIsSubmissionProcessing] = useState(false)

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
    setCollection(collections[0])
    setBlockchainType(blockchainTypes[0])
    setErcType(ercTypes[0])
    setGenericName('')
    setNames([])
    setFiles([])
    setIsSubmissionProcessing(false)
  }, [clearCounter])

  const validImageFiles = () => {
    if (files.length === 0) return false
    else return true
  }

  const validMultimediaImageFiles = () => {
    let valid = true
    for (const file of files) {
      if (file[0].type.split('/')[0] !== 'image' && file[1] === null) {
        valid = false
        break
      }
    }
    return valid
  }

  const handleSubmit = async (e: React.FormEventHandler<HTMLFormElement>) => {
    e.preventDefault()
    // set submission button to processing button
    setIsSubmissionProcessing(true)

    let validedImageFiles = true
    let validedMultimediaImageFiles = true
    let validFileUrls = true
    let validMultimediaFileUrls = true
    const dataLength = files.length
    try {
      const fileUrls = []
      const multimedias = []

      // format data for the arrays
      for (let i = 0; i < dataLength; i++) {
        const imageFile = files[i][1] === null ? files[i][0] : files[i][1]
        const fileUrl = await getFileUrl(imageFile)
        const multimediaFileUrl =
          files[i][1] === null ? null : await getFileUrl(files[i][0])

        // validate fileUrl
        if (fileUrl === undefined) {
          validFileUrls = false
          break
        }
        if (multimediaFileUrl === undefined) {
          validMultimediaFileUrls = false
          break
        }

        // push to arrays
        fileUrls.push(fileUrl)
        multimedias.push(multimediaFileUrl)
      }

      validedImageFiles = validImageFiles()
      validedMultimediaImageFiles = validMultimediaImageFiles()

      // validate data
      if (
        !validedImageFiles ||
        !validedMultimediaImageFiles ||
        !validFileUrls ||
        !validMultimediaFileUrls
      ) {
        alert('Invalid files')
        throw {
          error:
            'Invalid images, multimedia images, file urls, or multimedia file urls',
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

      // format data into array of IData
      const dataFieldsList: IData[] = []
      for (let i = 0; i < dataLength; i++) {
        const dataFields: IData = formatDataFields(
          names[i],
          uuid,
          typeCheckedBlockchainType,
          typeCheckedErcType,
          fileUrls[i],
          multimedias[i],
        )
        dataFieldsList.push(dataFields)
      }

      let tokenIds: number[] | false | undefined = []
      let items: IItem[] | null = null

      if (typeCheckedErcType === ErcType.ERC_721) {
        // handle createItems and fetchItemsByTokenIds
        // create items
        tokenIds = await createItems(dataFieldsList)

        if (!tokenIds || tokenIds === undefined) {
          throw { error: 'Token ids are invalid' }
        }

        let validTokenIds = true
        let errorTokenIdsMsg = ''
        // validate tokenIds
        for (let i = 0; i < tokenIds.length; i++) {
          if (tokenIds[i] < 1) {
            validTokenIds = false
            errorTokenIdsMsg += `| Index: ${i} | Value: ${tokenIds[i]}|`
          }
        }

        if (!validTokenIds)
          throw { error: `Invalid tokenIds: ${errorTokenIdsMsg}` }

        // fetch tokens
        items = await fetchItemsByTokenIds(tokenIds, accountInfo.account)
      } else if (typeCheckedErcType === ErcType.ERC_1155) {
        // handle ERC_1155 functions
      } else {
        alert('Erc Type is invalid')
        throw { error: `Erc Type invalid: ${typeCheckedErcType}` }
      }

      // validate items
      if (items === null) {
        throw { error: 'Item cannot be null' }
      } else if (items.length !== tokenIds.length) {
        throw {
          error: 'The length of items does not match the length of tokenIds',
        }
      }

      const fetchedNames = []
      const fetchedFileUrls = []
      const fetchedMultimediaFiles = []
      const fetchedTokenIds = []
      const fetchedItemIds = []
      for (const item of items) {
        fetchedNames.push(item.name)
        fetchedFileUrls.push(item.fileUrl)
        const fetchedMultimediaFile = item.multimedia
        fetchedMultimediaFiles.push(fetchedMultimediaFile)
        fetchedTokenIds.push(item.tokenId)
        fetchedItemIds.push(item.itemId)
      }

      const crudItems: INfts = {
        address: items[0]?.creator.toLowerCase(),
        names: fetchedNames,
        blockchainType: items[0]?.blockchainType,
        fileUrls: fetchedFileUrls,
        multimediaFileUrls: fetchedMultimediaFiles,
        tokenIds: fetchedTokenIds,
        itemIds: fetchedItemIds,
        collection,
        ercType: items[0]?.ercType,
      }

      // send data to back-end
      const nfts = await nftsPostMultiple(crudItems)
      console.log('nfts: ', nfts)
    } catch (error) {
      alert(
        'Something went wrong while creating the tokens. Please try with a different token settings or account',
      )
      console.log('Something went wrong while creating multiple tokens', error)
    }

    // clear all states
    setClearCounter(clearCounter + 1)
    if (!validedImageFiles) setIsFileErrorOpen(true)
    if (!validedMultimediaImageFiles) setIsMultimediaImageFileErrorOpen(true)
  }

  const handleGenericNameChange = (e: any) => {
    setGenericName(e.target.value)
    const newNames = []
    for (let i = 0; i < files.length; i++) {
      newNames.push(e.target.value + ` #${i + 1}`)
    }
    setNames([...newNames])
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
        Create Multiple Tokens
      </Typography>
      {isFileErrorOpen && (
        <Alert severity='error' sx={{ marginBottom: MARGIN_SMALL }}>
          No Files Added
        </Alert>
      )}
      {isMultimediaImageFileErrorOpen && (
        <Alert severity='error' sx={{ marginBottom: MARGIN_SMALL }}>
          No Images Added
        </Alert>
      )}
      <FilesUploadAndDisplay
        files={files}
        setFiles={setFiles}
        names={names}
        setNames={setNames}
        genericName={genericName}
      />
      <Typography variant='h5' sx={{ marginBottom: MARGIN_LARGE }}>
        Generic Name
      </Typography>
      <TextField
        sx={{ marginBottom: MARGIN_LARGE }}
        fullWidth
        label='Generic Name'
        value={genericName}
        onChange={handleGenericNameChange}
      />
      <TokenTypeInputs
        collection={collection}
        setCollection={setCollection}
        collections={collections}
        setCollections={setCollections}
        blockchainType={blockchainType}
        setBlockchainType={setBlockchainType}
        ercType={ercType}
        setErcType={setErcType}
      />
      <DividerMarginBottom />
      <Names names={names} setNames={setNames} files={files} />
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
            Create Digital Assets
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

export default CreateMultiple

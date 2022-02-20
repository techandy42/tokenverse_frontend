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
import { collections } from '../../pages/create'
import TokenTypeInputs from './createShared/TokenTypeInputs'
import Names from './createMultiple/Names'
import createItems from '../../../tokenFunctions/create_set_delete/createItems'
import getFileUrl from '../../../tokenFunctions/getters/getFileUrl'
import IData from '../../../interfaces/IData'
import IItem from '../../../interfaces/IItem'
import { BlockchainType, ErcType } from '../../../enums/nftMetadata'
import formatDataFields from '../../../helperFunctions/formatDataFields'
import fetchItemsByTokenIds from '../../../tokenFunctions/getters/fetchItemsByTokenIds'
import {
  nftsPostMultiple,
  INfts,
} from '../../../crudFunctions/nfts/nftsRequests'

interface IProps {
  clearCounter: number
  setClearCounter: React.Dispatch<React.SetStateAction<number>>
}

const CreateMultiple: React.FC<IProps> = ({
  clearCounter,
  setClearCounter,
}) => {
  const [collection, setCollection] = useState<string>(collections[0])
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

  useEffect(() => {
    setCollection(collections[0])
    setBlockchainType(blockchainTypes[0])
    setErcType(ercTypes[0])
    setGenericName('')
    setNames([])
    setFiles([])
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

      // format data into array of IData
      const dataFieldsList: IData[] = []
      for (let i = 0; i < dataLength; i++) {
        const dataFields: IData = formatDataFields(
          names[i],
          collection,
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

        if (!tokenIds || tokenIds === undefined)
          throw { error: 'Token ids are invalid' }

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
        items = await fetchItemsByTokenIds(tokenIds)
      } else if (typeCheckedErcType === ErcType.ERC_1155) {
        // handle ERC_1155 functions
      } else {
        throw { error: `Erc Type invalid: ${typeCheckedErcType}` }
      }

      if (items === null) {
        throw { error: 'Item cannot be null' }
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
        collection: items[0]?.collection,
        ercType: items[0]?.ercType,
      }

      // send data to back-end
      const nfts = await nftsPostMultiple(crudItems)
      console.log('nfts: ', nfts)
    } catch (error) {
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
        blockchainType={blockchainType}
        setBlockchainType={setBlockchainType}
        ercType={ercType}
        setErcType={setErcType}
      />
      <DividerMarginBottom />
      <Names names={names} setNames={setNames} files={files} />
      <DividerMarginBottom />
      <Button
        variant='contained'
        sx={{ marginBottom: MARGIN_LARGE, textTransform: 'none' }}
        type='submit'
      >
        Create Digital Assets
      </Button>
    </form>
  )
}

export default CreateMultiple

/* Creates a single token */
/* Tested, no bug */

import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import DividerMarginBottom from '../styles/DividerMarginBottom'
import FileUploadAndDisplay from './createSingle/FileUploadAndDisplay'
import { collections } from '../../pages/create'
import { MARGIN_LARGE, MARGIN_SMALL } from '../../../constants'
import TokenTypeInputs from './createShared/TokenTypeInputs'
import Alert from '@mui/material/Alert'
import blockchainTypes from '../../../constants/blockchainTypes'
import ercTypes from '../../../constants/ercTypes'
import createItem from '../../../tokenFunctions/create_set_delete/createItem'
import getFileUrl from '../../../tokenFunctions/getters/getFileUrl'
import multimediaFileToMultimedia from '../../../helperFunctions/multimediaFileToMultimedia'
import IData from '../../../interfaces/IData'
import IItem from '../../../interfaces/IItem'
import formatDataFields from '../../../helperFunctions/formatDataFields'
import { BlockchainType, ErcType } from '../../../enums/nftMetadata'
import { nftsPost, INft } from '../../../crudFunctions/nfts/nftsRequests'
import fetchItemByTokenId from '../../../tokenFunctions/getters/fetchItemByTokenId'

interface IProps {
  clearCounter: number
  setClearCounter: React.Dispatch<React.SetStateAction<number>>
}

const CreateSingle: React.FC<IProps> = ({ clearCounter, setClearCounter }) => {
  const [collection, setCollection] = useState<string>(collections[0])
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
    let validedImageFile = true
    let validedMultimediaImageFile = true
    let validFileUrl = true
    try {
      // format data (and set appropriate type(s))
      const imageFile =
        file.type.split('/')[0] === 'image' ? file : multimediaImageFile
      const fileUrl = await getFileUrl(imageFile)
      const multimediaFile = file.type.split('/')[0] === 'image' ? null : file
      const multimedia =
        multimediaFile === null
          ? null
          : multimediaFileToMultimedia(multimediaFile)
      validedImageFile = validImageFile()
      validedMultimediaImageFile = validMultimediaImageFile()
      validFileUrl = fileUrl !== undefined

      // validate data
      if (!validedImageFile || !validedMultimediaImageFile || !validFileUrl) {
        throw { error: 'Invalid image, multimedia image, or file url' }
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
        collection,
        typeCheckedBlockchainType,
        typeCheckedErcType,
        fileUrl,
        multimedia,
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
        throw { error: `Erc Type invalid: ${typeCheckedErcType}` }
      }

      if (item === null) {
        throw { error: 'Item cannot be null' }
      }

      let multimediaFileAsJSON = null

      // format data for back-end
      if (item.multimedia !== null) {
        multimediaFileAsJSON = JSON.stringify(item.multimedia)
      }

      const crudItem: INft = {
        address: item?.creator,
        name: item?.name,
        blockchainType: item?.blockchainType,
        fileUrl: item?.fileUrl,
        multimediaFile: multimediaFileAsJSON,
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
        collection={collection}
        setCollection={setCollection}
        blockchainType={blockchainType}
        setBlockchainType={setBlockchainType}
        ercType={ercType}
        setErcType={setErcType}
      />
      <DividerMarginBottom />
      <Button variant='contained' type='submit' sx={{ textTransform: 'none' }}>
        Create Digital Asset
      </Button>
    </form>
  )
}

export default CreateSingle

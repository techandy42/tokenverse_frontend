import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import DividerMarginBottom from '../styles/DividerMarginBottom'
import FileUploadAndDisplay from './createSingle/FileUploadAndDisplay'
import { collections } from '../../pages/create'
import { MARGIN_LARGE, MARGIN_SMALL } from '../../../constants'
import CollectionAndBlockchainTypeInputs from './createShared/CollectionAndBlockchainTypeInputs'
import Alert from '@mui/material/Alert'
import blockchainTypes from '../../../constants/blockchainTypes'
import { getFileUrl, createItem } from '../../../tokenFunctions/createFunctions'
import multimediaFileToMultimedia from '../../../functions/multimediaFileToMultimedia'

interface IProps {
  clearCounter: number
  setClearCounter: Dispatch<SetStateAction<number>>
}

const CreateSingle: React.FC<IProps> = ({ clearCounter, setClearCounter }) => {
  const [collection, setCollection] = useState<string>(collections[0])
  const [blockchainType, setBlockchainType] = useState<string>(
    blockchainTypes[0],
  )
  const [name, setName] = useState<string>('')
  const [file, setFile] = useState<null | any>(null)
  const [multimediaImageFile, setMultimediaImageFile] = useState<null | any>(
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
    const validedImageFile = validImageFile()
    const validedMultimediaImageFile = validMultimediaImageFile()
    if (validedImageFile && validedMultimediaImageFile) {
      // Format Token and mint
      const imageFile =
        file.type.split('/')[0] === 'image' ? file : multimediaImageFile
      const fileUrl = await getFileUrl(imageFile)
      const multimediaFile = file.type.split('/')[0] === 'image' ? null : file
      const multimedia =
        multimediaFile === null
          ? null
          : multimediaFileToMultimedia(multimediaFile)
      await createItem(name, collection, blockchainType, fileUrl, multimedia)
      setClearCounter(clearCounter + 1)
    }
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
      <CollectionAndBlockchainTypeInputs
        collection={collection}
        setCollection={setCollection}
        blockchainType={blockchainType}
        setBlockchainType={setBlockchainType}
      />
      <DividerMarginBottom />
      <Button variant='contained' type='submit' sx={{ textTransform: 'none' }}>
        Create Digital Asset
      </Button>
    </form>
  )
}

export default CreateSingle

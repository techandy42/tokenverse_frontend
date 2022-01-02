import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { MARGIN_LARGE, MARGIN_SMALL } from '../../../constants'
import FilesUploadAndDisplay from './createMultiple/FilesUploadAndDisplay'
import DividerMarginBottom from '../styles/DividerMarginBottom'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import blockchainTypes from '../../../constants/blockchainTypes'
import { collections } from '../../pages/create'
import CollectionAndBlockchainTypeInputs from './createShared/CollectionAndBlockchainTypeInputs'
import Names from './createMultiple/Names'

interface IProps {
  clearCounter: number
  setClearCounter: Dispatch<SetStateAction<number>>
}

const CreateMultiple: React.FC<IProps> = ({
  clearCounter,
  setClearCounter,
}) => {
  const [collection, setCollection] = useState<string>(collections[0])
  const [blockchainType, setBlockchainType] = useState<string>(
    blockchainTypes[0],
  )
  const [genericName, setGenericName] = useState<string>('')
  const [names, setNames] = useState<string[]>([])
  const [files, setFiles] = useState<[any, any][]>([])
  const [isFileErrorOpen, setIsFileErrorOpen] = useState<boolean>(false)
  const [isMultimediaImageFileErrorOpen, setIsMultimediaImageFileErrorOpen] =
    useState<boolean>(false)

  useEffect(() => {
    setCollection(collections[0])
    setBlockchainType(blockchainTypes[0])
    setGenericName('')
    setNames([])
    setFiles([])
  }, [clearCounter])

  const validImageFile = () => {
    if (files.length === 0) return false
    else return true
  }

  const validMultimediaImageFile = () => {
    let valid = true
    for (const file of files) {
      if (file[0].type.split('/')[0] !== 'image' && file[1] === null) {
        valid = false
        break
      }
    }
    return valid
  }

  const handleSubmit = (e: React.FormEventHandler<HTMLFormElement>) => {
    e.preventDefault()
    const validedImageFile = validImageFile()
    const validedMultimediaImageFile = validMultimediaImageFile()
    if (validedImageFile && validedMultimediaImageFile) {
      // Format Token and mint
      setClearCounter(clearCounter + 1)
    }
    if (validedImageFile) setIsFileErrorOpen(false)
    else setIsFileErrorOpen(true)
    if (validedMultimediaImageFile) setIsMultimediaImageFileErrorOpen(false)
    else setIsMultimediaImageFileErrorOpen(true)
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
        }}
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
      <CollectionAndBlockchainTypeInputs
        collection={collection}
        setCollection={setCollection}
        blockchainType={blockchainType}
        setBlockchainType={setBlockchainType}
      />
      <DividerMarginBottom />
      <Names names={names} setNames={setNames} files={files} />
      <DividerMarginBottom />
      <Button
        variant='outlined'
        sx={{ marginBottom: MARGIN_LARGE }}
        type='submit'
      >
        Create Digital Assets
      </Button>
    </form>
  )
}

export default CreateMultiple

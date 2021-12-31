/**
 * Purpose:
 * Displays the following:
 * Title
 * Collection Field
 * Token Type Field
 * Blockchain Type Field
 */

import React, { useState } from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { collections } from '../pages/create'
import tokenTypes from '../../constants/tokenTypes'
import blockchainTypes from '../../constants/blockchainTypes'
import {
  FORM_MARGIN_BOTTOM_VALUE_LARGE,
  FORM_MARGIN_BOTTOM_VALUE_SMALL,
} from '../../constants/values'
import FileUploadAndDisplay from './createComponents/FileUploadAndDisplay'

interface IProps {
  isCreateMultiple: boolean
  collection: string
  setCollection(arg: string): string
  tokenType: string
  setTokenType(arg: string): string
  blockchainType: string
  setBlockchainType(arg: string): string
}

const CreateSettings: React.FC<IProps> = ({
  isCreateMultiple,
  collection,
  setCollection,
  tokenType,
  setTokenType,
  blockchainType,
  setBlockchainType,
  fileUrls,
  setFileUrls,
}) => {
  const [initialCollectionName, setInitialCollectionName] = useState(
    collections[0],
  )

  const handleRenameInitialCollection = (e: any) => {
    // Rename the initial collection
  }

  return (
    <div>
      <Typography
        variant='h3'
        sx={{
          marginTop: FORM_MARGIN_BOTTOM_VALUE_LARGE,
          marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE,
        }}
      >
        {!isCreateMultiple ? 'Create Single' : 'Create Multiple'}
      </Typography>
      <Typography sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}>
        Collection
      </Typography>
      <Select
        labelId='collection'
        value={collection}
        onChange={(e) => setCollection(e.target.value)}
        fullWidth
        sx={{
          marginBottom:
            collection === collections[0]
              ? FORM_MARGIN_BOTTOM_VALUE_SMALL
              : FORM_MARGIN_BOTTOM_VALUE_LARGE,
        }}
      >
        {collections.map((collection, i) => (
          <MenuItem value={collection}>{collection}</MenuItem>
        ))}
      </Select>
      {collection === collections[0] ? (
        <>
          <Typography sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}>
            Optional
          </Typography>
          <Box
            sx={{
              display: 'flex',
              marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE,
            }}
          >
            <TextField
              fullWidth
              multiline
              name='renameInitialCollection'
              label='Rename Initial Collection'
              value={initialCollectionName}
              onChange={(e) => setInitialCollectionName(e.target.value)}
            />
            <IconButton
              size='large'
              edge='end'
              color='inherit'
              disableRipple
              onClick={handleRenameInitialCollection}
            >
              <AddCircleOutlineIcon color='primary' />
            </IconButton>
          </Box>
        </>
      ) : null}
      <Typography sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}>
        Type
      </Typography>
      <Select
        labelId='tokenType'
        value={tokenType}
        onChange={(e) => setTokenType(e.target.value)}
        fullWidth
        sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
      >
        {tokenTypes.map((tokenType) => (
          <MenuItem value={tokenType}>{tokenType}</MenuItem>
        ))}
      </Select>
      <Typography sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}>
        Blockchain
      </Typography>
      <Select
        labelId='blockchain'
        value={blockchainType}
        onChange={(e) => setBlockchainType(e.target.value)}
        fullWidth
        sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
      >
        {blockchainTypes.map((blockchainType) => (
          <MenuItem value={blockchainType}>{blockchainType}</MenuItem>
        ))}
      </Select>
      <FileUploadAndDisplay
        fileUrls={fileUrls}
        setFileUrls={setFileUrls}
        isCreateMultiple={isCreateMultiple}
      />
    </div>
  )
}

export default CreateSettings

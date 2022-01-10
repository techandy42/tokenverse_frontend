import React, { useState } from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Autocomplete from '@mui/material/Autocomplete'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { collections } from '../../../pages/create'
import blockchainTypes from '../../../../constants/blockchainTypes'
import { MARGIN_LARGE, MARGIN_SMALL } from '../../../../constants'

interface IProps {
  collection: string
  setCollection: React.Dispatch<React.SetStateAction<string>>
  blockchainType: string
  setBlockchainType: React.Dispatch<React.SetStateAction<string>>
}

const CollectionAndBlockchainTypeInputs: React.FC<IProps> = ({
  collection,
  setCollection,
  blockchainType,
  setBlockchainType,
}) => {
  const [initialCollectionName, setInitialCollectionName] = useState(
    collections[0],
  )

  const handleRenameInitialCollection = (e: any) => {
    // Rename the initial collection
  }

  return (
    <div>
      <Typography sx={{ marginBottom: MARGIN_SMALL }}>Collection</Typography>
      <Autocomplete
        fullWidth
        value={collection}
        onChange={(e, newValue) => {
          newValue !== null
            ? setCollection(newValue)
            : setCollection(collections[0])
        }}
        onInputChange={(e, newInputValue) => {
          collections.includes(newInputValue)
            ? setCollection(newInputValue)
            : null
        }}
        options={collections}
        renderInput={(params) => (
          <TextField required {...params} label='Collection' />
        )}
        sx={{
          marginBottom:
            collection === collections[0] ? MARGIN_SMALL : MARGIN_LARGE,
        }}
      />
      {collection === collections[0] ? (
        <>
          <Typography sx={{ marginBottom: MARGIN_SMALL }}>Optional</Typography>
          <Box
            sx={{
              display: 'flex',
              marginBottom: MARGIN_LARGE,
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
              sx={{ marginRight: 0 }}
            >
              <AddCircleOutlineIcon color='primary' />
            </IconButton>
          </Box>
        </>
      ) : null}
      <Typography sx={{ marginBottom: MARGIN_SMALL }}>Blockchain</Typography>
      <Select
        value={blockchainType}
        onChange={(e) => setBlockchainType(e.target.value)}
        fullWidth
        sx={{ marginBottom: MARGIN_LARGE }}
      >
        {blockchainTypes.map((blockchainType) => (
          <MenuItem value={blockchainType}>{blockchainType}</MenuItem>
        ))}
      </Select>
    </div>
  )
}

export default CollectionAndBlockchainTypeInputs

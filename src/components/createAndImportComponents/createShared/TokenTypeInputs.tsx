/* Component with Token Fields */

import React from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'
import blockchainTypes from '../../../../constants/blockchainTypes'
import ercTypes from '../../../../constants/ercTypes'
import { MARGIN_LARGE, MARGIN_SMALL } from '../../../../constants'
import { BlockchainType, ErcType } from '../../../../enums/nftMetadata'

interface IProps {
  collections: string[]
  setCollections: React.Dispatch<React.SetStateAction<string[]>>
  collection: string
  setCollection: React.Dispatch<React.SetStateAction<string>>
  blockchainType: string
  setBlockchainType: React.Dispatch<React.SetStateAction<string>>
  ercType: string
  setErcType: React.Dispatch<React.SetStateAction<string>>
}

const TokenTypeInputs: React.FC<IProps> = ({
  collections,
  setCollections,
  collection,
  setCollection,
  blockchainType,
  setBlockchainType,
  ercType,
  setErcType,
}) => {
  const handleCollectionChange = (newValue: string | null) => {
    if (newValue !== null) {
      const index = collections.findIndex(
        (collection) => collection === newValue,
      )
      // if there is no newValue in collections, don't change anything
      if (index === -1) return
      setCollection(newValue)
    }
  }

  return (
    <div>
      <Typography sx={{ marginBottom: MARGIN_SMALL }}>Collection</Typography>
      <Autocomplete
        fullWidth
        value={collection}
        onChange={(e, newValue) => handleCollectionChange(newValue)}
        onInputChange={(e, newInputValue) => {
          collections.includes(newInputValue)
            ? handleCollectionChange(newInputValue)
            : null
        }}
        options={collections}
        renderInput={(params) => (
          <TextField required {...params} label='Collection' />
        )}
        sx={{
          marginBottom: MARGIN_LARGE,
        }}
      />
      <Typography sx={{ marginBottom: MARGIN_SMALL }}>Blockchain</Typography>
      <Select
        value={blockchainType}
        onChange={(e) => setBlockchainType(e.target.value)}
        fullWidth
        sx={{ marginBottom: MARGIN_LARGE }}
      >
        {blockchainTypes.map((blockchainType) => (
          <MenuItem value={blockchainType}>
            {blockchainType === BlockchainType.POLYGON ? 'Polygon' : null}
          </MenuItem>
        ))}
      </Select>
      <Typography sx={{ marginBottom: MARGIN_SMALL }}>ERC Types</Typography>
      <Select
        value={ercType}
        onChange={(e) => setErcType(e.target.value)}
        fullWidth
        sx={{ marginBottom: MARGIN_LARGE }}
      >
        {ercTypes.map((ercType) => (
          <MenuItem value={ercType}>
            {ercType === ErcType.ERC_721
              ? 'ERC-721'
              : ercType === ErcType.ERC_1155
              ? 'ERC-1155'
              : null}
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}

export default TokenTypeInputs

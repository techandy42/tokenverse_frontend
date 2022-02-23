/* Component with Token Fields */
/* Tested, no bug */

import React, { useState } from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Autocomplete from '@mui/material/Autocomplete'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import blockchainTypes from '../../../../constants/blockchainTypes'
import ercTypes from '../../../../constants/ercTypes'
import { MARGIN_LARGE, MARGIN_SMALL } from '../../../../constants'
import { BlockchainType, ErcType } from '../../../../enums/nftMetadata'
import { collectionsChangeNamePut } from '../../../../crudFunctions/collections/collectionsRequests'

interface IProps {
  collections: string[]
  setCollections: React.Dispatch<React.SetStateAction<string[]>>
  collectionsIsNameModified: boolean[]
  setCollectionsIsNameModified: React.Dispatch<React.SetStateAction<boolean[]>>
  collection: string
  setCollection: React.Dispatch<React.SetStateAction<string>>
  collectionIndex: number
  setCollectionIndex: React.Dispatch<React.SetStateAction<number>>
  blockchainType: string
  setBlockchainType: React.Dispatch<React.SetStateAction<string>>
  ercType: string
  setErcType: React.Dispatch<React.SetStateAction<string>>
}

const TokenTypeInputs: React.FC<IProps> = ({
  collections,
  setCollections,
  collectionsIsNameModified,
  setCollectionsIsNameModified,
  collection,
  setCollection,
  collectionIndex,
  setCollectionIndex,
  blockchainType,
  setBlockchainType,
  ercType,
  setErcType,
}) => {
  const [selectedCollectionName, setSelectedCollectionName] =
    useState<string>(collection)
  const [
    selectedCollectionIsNameModified,
    setSelectedCollectionIsNameModified,
  ] = useState<boolean>(collectionsIsNameModified[collectionIndex])

  const handleRenameSelectedCollection = async (
    selectedCollectionName: string,
  ) => {
    try {
      const newCollection = await collectionsChangeNamePut(collection, {
        newName: selectedCollectionName,
      })
      const newCollectionName = newCollection.data.name
      const newCollections = collections
      const newCollectionsIsNameModified = collectionsIsNameModified
      newCollections[collectionIndex] = newCollectionName
      newCollectionsIsNameModified[collectionIndex] = true

      setCollection(newCollectionName)
      setCollections(newCollections)
      setCollectionsIsNameModified(newCollectionsIsNameModified)
      setSelectedCollectionName(newCollectionName)
      setSelectedCollectionIsNameModified(true)
    } catch (error) {
      console.log(error)
      alert('Collection already exists.')
    }
  }

  const handleCollectionChange = (newValue: string | null) => {
    if (newValue !== null) {
      const index = collections.findIndex(
        (collection) => collection === newValue,
      )
      // if there is no newValue in collections, don't change anything
      if (index === -1) return
      setCollection(newValue)
      setCollectionIndex(index)
      setSelectedCollectionName(newValue)
      setSelectedCollectionIsNameModified(collectionsIsNameModified[index])
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
          marginBottom:
            collection === collections[0] ? MARGIN_SMALL : MARGIN_LARGE,
        }}
      />
      {!selectedCollectionIsNameModified && (
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
              name='renameSelectedCollection'
              label='Rename Selected Collection'
              value={selectedCollectionName}
              onChange={(e) => setSelectedCollectionName(e.target.value)}
            />
            <IconButton
              size='large'
              edge='end'
              color='inherit'
              disableRipple
              onClick={() =>
                handleRenameSelectedCollection(selectedCollectionName)
              }
              sx={{ marginRight: 0 }}
            >
              <AddCircleOutlineIcon color='primary' />
            </IconButton>
          </Box>
        </>
      )}
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

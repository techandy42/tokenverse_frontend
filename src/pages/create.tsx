import { useState } from 'react'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import {
  MARGIN_LARGE,
  CREATE_SINGLE,
  CREATE_MULTIPLE,
  CREATE_SFT,
  IMPORT_NFT,
  IMPORT_SFT,
  MARGIN_TOP,
} from '../../constants'
import FlexBox from '../components/styles/FlexBox'
import FlexSpace from '../components/styles/FlexSpace'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import CreateSingle from '../components/createAndImportComponents/CreateSingle'
import CreateMultiple from '../components/createAndImportComponents/CreateMultiple'
import CreateSFT from '../components/createAndImportComponents/CreateSFT'
import ImportNFT from '../components/createAndImportComponents/ImportNFT'
import ImportSFT from '../components/createAndImportComponents/ImportSFT'

// fetch collections from the back-end
// example:
const newlyGeneratedCollection = 'random-collection-#1234567890'
export const collections = [
  newlyGeneratedCollection,
  'Collection 1',
  'Collection 2',
  'Collection 3',
]

export default function Create() {
  const [createType, setCreateType] = useState<string>(CREATE_SINGLE)
  const [clearCounter, setClearCounter] = useState<number>(0)

  const StyledPageBase = styled('div')(({ theme }) => ({
    marginTop: MARGIN_TOP,
    marginBottom: MARGIN_LARGE,
    marginLeft: '5%',
    marginRight: '5%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: '10%',
      marginRight: '10%',
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: '20%',
      marginRight: '20%',
    },
  }))

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextCreateType: string,
  ) => {
    if (nextCreateType !== null) setCreateType(nextCreateType)
  }

  return (
    <StyledPageBase>
      <FlexBox>
        <ToggleButtonGroup value={createType} exclusive onChange={handleChange}>
          <ToggleButton value={CREATE_SINGLE} sx={{ fontWeight: 400 }}>
            Create Single
          </ToggleButton>
          <ToggleButton value={CREATE_MULTIPLE} sx={{ fontWeight: 400 }}>
            Create Multiple
          </ToggleButton>
          <ToggleButton value={CREATE_SFT} sx={{ fontWeight: 400 }}>
            Create SFT
          </ToggleButton>
          <ToggleButton value={IMPORT_NFT} sx={{ fontWeight: 400 }}>
            Import NFT
          </ToggleButton>
          <ToggleButton value={IMPORT_SFT} sx={{ fontWeight: 400 }}>
            Import SFT
          </ToggleButton>
        </ToggleButtonGroup>
        <FlexSpace />
        <Button onClick={(e) => setClearCounter(clearCounter + 1)}>
          Clear All
        </Button>
      </FlexBox>
      {createType === CREATE_SINGLE ? (
        <CreateSingle
          clearCounter={clearCounter}
          setClearCounter={setClearCounter}
        />
      ) : createType === CREATE_MULTIPLE ? (
        <CreateMultiple
          clearCounter={clearCounter}
          setClearCounter={setClearCounter}
        />
      ) : createType === CREATE_SFT ? (
        <CreateSFT
          clearCounter={clearCounter}
          setClearCounter={setClearCounter}
        />
      ) : createType === IMPORT_NFT ? (
        <ImportNFT
          clearCounter={clearCounter}
          setClearCounter={setClearCounter}
        />
      ) : createType === IMPORT_SFT ? (
        <ImportSFT
          clearCounter={clearCounter}
          setClearCounter={setClearCounter}
        />
      ) : null}
    </StyledPageBase>
  )
}

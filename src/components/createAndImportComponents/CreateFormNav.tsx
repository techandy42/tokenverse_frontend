import React from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Link from 'next/link'
import FlexBox from '../styles/FlexBox'
import FlexSpace from '../styles/FlexSpace'
import { MARGIN_SMALL } from '../../../constants'

interface IProps {
  formType: string
  clearCounter: number
  setClearCounter: React.Dispatch<SetStateAction<number>>
}

const CreateFormNav: React.FC<IProps> = ({
  formType,
  clearCounter,
  setClearCounter,
}) => {
  return (
    <>
      <FlexBox>
        <ButtonGroup sx={{ marginBottom: { xs: MARGIN_SMALL, sm: 0 } }}>
          <Link href='/create'>
            {formType === 'single' ? (
              <Button variant='contained'>Create Single</Button>
            ) : (
              <Button>Create Single</Button>
            )}
          </Link>
          <Link href='/create/multiple'>
            {formType === 'multiple' ? (
              <Button variant='contained'>Create Multiple</Button>
            ) : (
              <Button>Create Multiple</Button>
            )}
          </Link>
          <Link href='/create/sft'>
            {formType === 'sft' ? (
              <Button variant='contained'>Create SFT</Button>
            ) : (
              <Button>Create SFT</Button>
            )}
          </Link>
          <Link href='/create/import-nft'>
            {formType === 'import-nft' ? (
              <Button variant='contained'>Import NFT</Button>
            ) : (
              <Button>Import NFT</Button>
            )}
          </Link>
          <Link href='/create/import-sft'>
            {formType === 'import-sft' ? (
              <Button variant='contained'>Import SFT</Button>
            ) : (
              <Button>Import SFT</Button>
            )}
          </Link>
        </ButtonGroup>
        <FlexSpace />
        <Button
          sx={{ display: { xs: 'none', sm: 'block' } }}
          onClick={() => setClearCounter(clearCounter + 1)}
        >
          Clear
        </Button>
      </FlexBox>
      <Button
        sx={{ display: { xs: 'block', sm: 'none' } }}
        onClick={() => setClearCounter(clearCounter + 1)}
      >
        Clear
      </Button>
    </>
  )
}

export default CreateFormNav

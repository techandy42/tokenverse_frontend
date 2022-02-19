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
              <Button variant='contained' sx={{ textTransform: 'none' }}>
                Create Single
              </Button>
            ) : (
              <Button sx={{ textTransform: 'none' }}>Create Single</Button>
            )}
          </Link>
          <Link href='/create/multiple'>
            {formType === 'multiple' ? (
              <Button sx={{ textTransform: 'none' }} variant='contained'>
                Create Multiple
              </Button>
            ) : (
              <Button sx={{ textTransform: 'none' }}>Create Multiple</Button>
            )}
          </Link>
          <Link href='/create/import-nft'>
            {formType === 'import-nft' ? (
              <Button sx={{ textTransform: 'none' }} variant='contained'>
                Import NFT
              </Button>
            ) : (
              <Button sx={{ textTransform: 'none' }}>Import NFT</Button>
            )}
          </Link>
        </ButtonGroup>
        <FlexSpace />
        <Button
          sx={{ display: { xs: 'none', sm: 'block' }, textTransform: 'none' }}
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

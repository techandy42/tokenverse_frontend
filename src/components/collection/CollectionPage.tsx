import React from 'react'
import StyledWidePageBase from '../styles/StyledWidePageBase'
import ICollectionRelation from '../../../interfaces/schemaRelations/ICollectionRelation'
import CollectionDisplayNFTs from './CollectionDisplayNFTs'
import IItem from '../../../interfaces/IItem'
import FlexBox from '../styles/FlexBox'
import FlexSpace from '../styles/FlexSpace'
import Link from 'next/link'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import default_photo_image from '../../../images/default_photo_image.jpg'
import { styled } from '@mui/material/styles'
import { BREAKPOINT_SMALL, BREAKPOINT_LARGE } from '../../../constants'
import { Divider } from '@mui/material'
import DisplayPicture from '../styles/pageInformations/DisplayPicture'
import VerificationBoxUp750 from '../styles/pageInformations/VerificationBoxUp750'
import VerificationBoxDown750 from '../styles/pageInformations/VerificationBoxDown750'
import formatPersonalInfoString from '../../../helperFunctions/formatPersonalInfoString'

interface IProps {
  isCreator: boolean
  userName: string | undefined
  collectionId: null | string
  collectionData: ICollectionRelation
  nfts: IItem[]
}

const CollectionPage: React.FC<IProps> = ({
  isCreator,
  userName,
  collectionId,
  collectionData,
  nfts,
}) => {
  const isUserNameValid = () => {
    if (userName !== undefined) {
      if (userName !== '') {
        return true
      } else {
        return false
      }
    }
    return false
  }

  return (
    <StyledWidePageBase>
      <FlexBox sx={{ alignItems: 'normal', marginBottom: '4rem' }}>
        {/* Displaying picture */}
        <DisplayPicture>
          {isCreator ? (
            <Link href={`/collection/${collectionId}/edit`}>
              <Tooltip placement='bottom' title='Edit'>
                <img
                  src={
                    collectionData.image === null
                      ? default_photo_image.src
                      : collectionData.image
                  }
                  style={{
                    borderRadius: '50%',
                    width: '10rem',
                    height: '10rem',
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                  alt='No Image Found'
                />
              </Tooltip>
            </Link>
          ) : (
            <img
              src={
                collectionData.image === null
                  ? default_photo_image.src
                  : collectionData.image
              }
              style={{
                borderRadius: '50%',
                width: '10rem',
                height: '10rem',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
              alt='No Image Found'
            />
          )}
        </DisplayPicture>
        {/* Displaying information about the user */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <FlexBox
            sx={{
              marginBottom: '0.75rem',
              marginTop: '0.75rem',
            }}
          >
            <Typography
              className='font-chakra'
              variant='h4'
              sx={{
                marginRight: '2rem',
                fontSize: { xs: 18, sm: 26, md: 34 },
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>
                {formatPersonalInfoString(collectionData.name, 40)}
              </span>
            </Typography>
            {isCreator && (
              <VerificationBoxUp750>
                <Link href={`/collection/${collectionId}/edit`}>
                  <Button
                    variant='outlined'
                    size='small'
                    sx={{
                      textTransform: 'none',
                    }}
                  >
                    Edit
                  </Button>
                </Link>
              </VerificationBoxUp750>
            )}
          </FlexBox>
          <FlexBox>
            {isCreator && (
              <VerificationBoxDown750>
                <Link href={`/collection/${collectionId}/edit`}>
                  <Button
                    variant='outlined'
                    size='small'
                    sx={{ textTransform: 'none', marginBottom: '1rem' }}
                  >
                    Edit
                  </Button>
                </Link>
              </VerificationBoxDown750>
            )}
          </FlexBox>
          {isUserNameValid() ? (
            <Link href={`/user/${userName}`}>
              <Tooltip placement='left' title='Account'>
                <Typography
                  sx={{
                    marginBottom: '0.5rem',
                    fontWeight: 400,
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  {formatPersonalInfoString(userName, 40)}
                </Typography>
              </Tooltip>
            </Link>
          ) : (
            <Typography
              sx={{
                marginBottom: '0.5rem',
                fontWeight: 400,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              No User Name
            </Typography>
          )}
          <Typography
            sx={{
              marginBottom: '1rem',
              fontWeight: 300,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {collectionData.description !== '' &&
              formatPersonalInfoString(collectionData.description, 280)}
          </Typography>
        </Box>
      </FlexBox>
      <Divider sx={{ marginBottom: '2rem' }} />
      <CollectionDisplayNFTs NFTs={nfts} />
    </StyledWidePageBase>
  )
}

export default CollectionPage

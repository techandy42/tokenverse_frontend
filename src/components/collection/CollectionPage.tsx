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

interface IProps {
  isCreator: boolean
  collectionId: null | string
  collectionData: ICollectionRelation
  nfts: IItem[]
}

const CollectionPage: React.FC<IProps> = ({
  isCreator,
  collectionId,
  collectionData,
  nfts,
}) => {
  return (
    <StyledWidePageBase>
      <FlexBox sx={{ alignItems: 'normal', marginBottom: '4rem' }}>
        {/* Displaying picture */}
        <DisplayPicture>
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
              sx={{ marginRight: '2rem', fontSize: { xs: 18, sm: 26, md: 34 } }}
            >
              <span style={{ marginRight: '0.5rem' }}>
                {collectionData.name}
              </span>
            </Typography>
            <VerificationBoxUp750>
              <Link href='/account/edit'>
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
          </FlexBox>
          <FlexBox>
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
          </FlexBox>
        </Box>
        {/* 
          
          <Typography
            sx={{
              marginBottom: '0.5rem',
              fontWeight: 400,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {fetchedPersonalInfo.companyName !== '' &&
              formatPersonalInfoString(fetchedPersonalInfo.companyName, 40)}
          </Typography>
          <Typography
            sx={{
              marginBottom: '1rem',
              fontWeight: 300,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {fetchedPersonalInfo.description !== '' &&
              formatPersonalInfoString(fetchedPersonalInfo.description, 280)}
          </Typography>
          {fetchedPersonalInfo.mainLink !== '' && (
            <WebsiteLink
              link={fetchedPersonalInfo.mainLink}
              title={
                <FlexBox>
                  <WebAssetIcon sx={{ fontSize: 16, marginRight: '0.25rem' }} />
                  <span style={{ fontSize: 14 }}>
                    {fetchedPersonalInfo.mainLink}
                  </span>
                </FlexBox>
              }
            />
          )}
          {fetchedPersonalInfo.facebookLink !== '' && (
            <WebsiteLink
              link={fetchedPersonalInfo.facebookLink}
              title={
                <FlexBox>
                  <FacebookIcon sx={{ fontSize: 16, marginRight: '0.25rem' }} />
                  <span style={{ fontSize: 14 }}>Facebook Account</span>
                </FlexBox>
              }
            />
          )}
          {fetchedPersonalInfo.instagramLink !== '' && (
            <WebsiteLink
              link={fetchedPersonalInfo.instagramLink}
              title={
                <FlexBox>
                  <InstagramIcon
                    sx={{ fontSize: 16, marginRight: '0.25rem' }}
                  />
                  <span style={{ fontSize: 14 }}>Instagram Account</span>
                </FlexBox>
              }
            />
          )}
          {fetchedPersonalInfo.twitterLink !== '' && (
            <WebsiteLink
              link={fetchedPersonalInfo.twitterLink}
              title={
                <FlexBox>
                  <TwitterIcon sx={{ fontSize: 16, marginRight: '0.25rem' }} />
                  <span style={{ fontSize: 14 }}>Twitter Account</span>
                </FlexBox>
              }
            />
          )}
          {fetchedPersonalInfo.linkedInLink !== '' && (
            <WebsiteLink
              link={fetchedPersonalInfo.linkedInLink}
              title={
                <FlexBox>
                  <LinkedInIcon sx={{ fontSize: 16, marginRight: '0.25rem' }} />
                  <span style={{ fontSize: 14 }}>LinkedIn Account</span>
                </FlexBox>
              }
              lastItem={true}
            />
          )}
          {displayAccountInfo()}
        </Box>
            <Box sx={{ flexGrow: 4 }} /> */}
      </FlexBox>
      <Divider sx={{ marginBottom: '2rem' }} />
      <CollectionDisplayNFTs NFTs={nfts} />
    </StyledWidePageBase>
  )
}

export default CollectionPage

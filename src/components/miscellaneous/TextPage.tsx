import React from 'react'
import StyledPageBase from '../styles/StyledPageBase'
import StyledWidePageBase from '../styles/StyledWidePageBase'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import { PageWidth } from '../../../enums/PageType'

interface IProps {
  pageWidth: PageWidth
  hasBackButton: boolean
  message: string
}

const TextPage: React.FC<IProps> = ({ pageWidth, hasBackButton, message }) => {
  const router = useRouter()

  const getContent = () => {
    return (
      <>
        <Typography variant='h4' className='font-chakra'>
          {message}
        </Typography>
        {hasBackButton && (
          <Button onClick={() => router.back()}>Go Back</Button>
        )}
      </>
    )
  }

  if (pageWidth === PageWidth.NARROW) {
    return <StyledPageBase>{getContent()}</StyledPageBase>
  } else if (pageWidth === PageWidth.WIDE) {
    return <StyledWidePageBase>{getContent()}</StyledWidePageBase>
  }
}

export default TextPage

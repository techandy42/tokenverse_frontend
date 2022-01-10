import React from 'react'
import Typography from '@mui/material/Typography'

interface IProps {
  link: string
  title: React.ReactNode
  lastItem?: boolean
}

const WebsiteLink: React.FC<IProps> = ({ link, title, lastItem }) => {
  return (
    <a
      href={link}
      target='_blank'
      style={{ marginBottom: lastItem ? '1.5rem' : '0.25rem' }}
    >
      <Typography color='primary'>{title}</Typography>
    </a>
  )
}

export default WebsiteLink

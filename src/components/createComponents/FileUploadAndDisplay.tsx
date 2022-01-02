import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { FORM_MARGIN_BOTTOM_VALUE_LARGE } from '../../../constants/values'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const FileUploadAndDisplay = ({
  file,
  setFile,
  multimediaImageFile,
  setMultimediaImageFile,
}) => {
  const displayFile = (file) => {
    return (
      <>
        {file !== null && (
          <Box sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}>
            {file?.type.split('/')[0] === 'image' ? (
              <img
                width='400'
                height='300'
                style={{ borderRadius: '0.5rem', objectFit: 'cover' }}
                src={URL.createObjectURL(file)}
              />
            ) : file?.type.split('/')[0] === 'video' ? (
              <video
                autoPlay
                width='400'
                height='300'
                style={{ borderRadius: '0.5rem' }}
                controls
              >
                <source src={URL.createObjectURL(file)} type='video/ogg' />
                <source src={URL.createObjectURL(file)} type='video/mp4' />
              </video>
            ) : file?.type.split('/')[0] === 'audio' ? (
              <audio autoPlay controls>
                <source src={URL.createObjectURL(file)} type='audio/ogg' />
                <source src={URL.createObjectURL(file)} type='audio/mpeg' />
              </audio>
            ) : null}
          </Box>
        )}
      </>
    )
  }

  const handleMultimediaImageFile = (e) => {
    const file = e.target.files[0]
    if (file.type.split('/')[0] === 'image') {
      setMultimediaImageFile(file)
    } else {
      alert('Only images can be used for cover image of multimedia files')
    }
  }

  const multimediaImageFileHandler = () => {
    return (
      <Box sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}>
        <Box
          sx={{
            marginBottom:
              multimediaImageFile !== null ? FORM_MARGIN_BOTTOM_VALUE_LARGE : 0,
          }}
        >
          {multimediaImageFile === null && (
            <Button component='label' variant='outlined'>
              Add Image (Required)
              <input
                type='file'
                onChange={handleMultimediaImageFile}
                onClick={(e) => {
                  e.target.value = null
                }}
                hidden
              />
            </Button>
          )}
          {multimediaImageFile !== null && (
            <Button
              component='label'
              variant='outlined'
              onClick={(e) => setMultimediaImageFile(null)}
            >
              Remove Image
            </Button>
          )}
          <Tooltip
            placement='top'
            title='Multimedia file (non-image) requires an image as a cover'
            arrow
          >
            <IconButton size='large' edge='end' color='inherit' disableRipple>
              <HelpOutlineIcon color='primary' fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>
        {displayFile(multimediaImageFile)}
      </Box>
    )
  }

  return (
    <>
      {file === null && (
        <Button
          component='label'
          variant='outlined'
          sx={{
            marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE,
          }}
        >
          Add File
          <input
            type='file'
            onChange={(e) => setFile(e.target.files[0])}
            onClick={(e) => {
              e.target.value = null
            }}
            hidden
          />
        </Button>
      )}
      {file !== null && (
        <Button
          component='label'
          variant='outlined'
          sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
          onClick={(e) => {
            setFile(null)
            setMultimediaImageFile(null)
          }}
        >
          Remove File
        </Button>
      )}
      {displayFile(file)}
      {file?.type.split('/')[0] !== 'image' && file !== null
        ? multimediaImageFileHandler()
        : null}
    </>
  )
}

export default FileUploadAndDisplay

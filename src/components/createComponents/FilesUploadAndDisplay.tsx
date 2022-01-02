import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { FORM_MARGIN_BOTTOM_VALUE_LARGE } from '../../../constants/values'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import FlexSpace from '../styles/FlexSpace'
import FlexBox from '../styles/FlexSpace'
import { ButtonGroup, IconButton } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import Typography from '@mui/material/Typography'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Tooltip from '@mui/material/Tooltip'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const FilesUploadAndDisplay = ({ files, setFiles }) => {
  const [fileIndex, setFileIndex] = useState(0)
  const [viewMultimediaImageFiles, setViewMultimediaImageFiles] =
    useState(false)

  console.log(files)

  const handleAddFiles = (e) => {
    if (e.target.files.length > 10000) {
      alert('Please upload 1 - 10000 files')
    } else {
      // const uploadedFiles = e.target.files
      // const uploadedFilesAndMultimediaImageFiles = uploadedFiles.map((file) => [
      //   file,
      //   null,
      // ])
      const uploadedFilesAndMultimediaImageFiles = []
      for (const file of e.target.files) {
        uploadedFilesAndMultimediaImageFiles.push([file, null])
      }
      setFiles([...files, ...uploadedFilesAndMultimediaImageFiles])
    }
  }

  const handleDeleteFile = (e) => {
    setFiles([...files.slice(0, fileIndex), ...files.slice(fileIndex + 1)])
    if (files.length === fileIndex + 1 && fileIndex !== 0) {
      setFileIndex(fileIndex - 1)
    }
  }

  const handleDeleteFiles = (e) => {
    setFiles([])
    setFileIndex(0)
  }

  const handleNext = (e) => {
    if (fileIndex < files.length - 1) {
      setFileIndex(fileIndex + 1)
    }
  }

  const handlePrev = (e) => {
    if (fileIndex > 0) {
      setFileIndex(fileIndex - 1)
    }
  }

  const displayFiles = () => {
    return (
      <>
        {files.length > 0 ? (
          <Box sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}>
            {files[fileIndex][0]?.type.split('/')[0] === 'image' ? (
              <img
                width='400'
                height='300'
                style={{ borderRadius: '0.5rem', objectFit: 'cover' }}
                src={URL.createObjectURL(files[fileIndex][0])}
              />
            ) : files[fileIndex][0]?.type.split('/')[0] === 'video' ? (
              <video
                autoPlay
                width='400'
                height='300'
                style={{ borderRadius: '0.5rem' }}
                controls
              >
                <source
                  src={URL.createObjectURL(files[fileIndex][0])}
                  type='video/ogg'
                />
                <source
                  src={URL.createObjectURL(files[fileIndex][0])}
                  type='video/mp4'
                />
              </video>
            ) : files[fileIndex][0]?.type.split('/')[0] === 'audio' ? (
              <audio autoPlay controls>
                <source
                  src={URL.createObjectURL(files[fileIndex][0])}
                  type='audio/ogg'
                />
                <source
                  src={URL.createObjectURL(files[fileIndex][0])}
                  type='audio/mpeg'
                />
              </audio>
            ) : null}
            {files.length > 0 && (
              <Box
                sx={{
                  marginLeft:
                    files[fileIndex][0]?.type.split('/')[0] === 'audio'
                      ? '6.4rem'
                      : '9.4rem',
                }}
              >
                <IconButton
                  size='large'
                  edge='end'
                  color='inherit'
                  onClick={handlePrev}
                  sx={{ marginRight: '0.1rem' }}
                >
                  <ArrowBackIosIcon />
                </IconButton>
                <IconButton
                  size='large'
                  edge='end'
                  color='inherit'
                  onClick={handleNext}
                  sx={{ marginLeft: '0.1rem' }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        ) : null}
      </>
    )
  }

  const displayFile = (file) => {
    return (
      <>
        {file !== null && (
          <span style={{ marginRight: '0.5rem' }}>
            {file?.type.split('/')[0] === 'image' ? (
              <img
                width='200'
                height='150'
                style={{ borderRadius: '0.25rem', objectFit: 'cover' }}
                src={URL.createObjectURL(file)}
              />
            ) : file?.type.split('/')[0] === 'video' ? (
              <video
                width='200'
                height='150'
                style={{ borderRadius: '0.25rem' }}
                controls
              >
                <source src={URL.createObjectURL(file)} type='video/ogg' />
                <source src={URL.createObjectURL(file)} type='video/mp4' />
              </video>
            ) : file?.type.split('/')[0] === 'audio' ? (
              <audio controls>
                <source src={URL.createObjectURL(file)} type='audio/ogg' />
                <source src={URL.createObjectURL(file)} type='audio/mpeg' />
              </audio>
            ) : null}
          </span>
        )}
      </>
    )
  }

  const handleAddMultimediaImageFileHandler = (file, i) => {
    setFiles([...files.slice(0, i), [files[i][0], file], ...files.slice(i + 1)])
  }

  const handleRemoveMultimediaImageFileHandler = (i) => {
    setFiles([...files.slice(0, i), [files[i][0], null], ...files.slice(i + 1)])
  }

  const multimediaImageFileHandler = (file, i) => {
    return (
      <>
        <Box
          sx={{
            marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE,
          }}
        >
          {file[1] === null && (
            <Button component='label' variant='outlined'>
              Add Files
              <input
                type='file'
                multiple
                onChange={(e) =>
                  handleAddMultimediaImageFileHandler(e.target.files[0], i)
                }
                onClick={(e) => {
                  e.target.value = null
                }}
                hidden
              />
            </Button>
          )}
          {file[1] !== null && (
            <Button
              component='label'
              variant='outlined'
              onClick={(e) => handleRemoveMultimediaImageFileHandler(i)}
            >
              Remove File
            </Button>
          )}
          <Tooltip
            placement='top'
            title={`Image cover for - ${file[0].name}`}
            arrow
          >
            <IconButton size='large' edge='end' color='inherit' disableRipple>
              <InsertDriveFileIcon color='primary' fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>
        <FlexBox sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}>
          {displayFile(file[0])}
          {displayFile(file[1])}
        </FlexBox>
      </>
    )
  }

  const multimediaImageFilesViewer = () => {
    return (
      <>
        <Box sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}>
          <Button
            variant='outlined'
            onClick={(e) =>
              setViewMultimediaImageFiles(!viewMultimediaImageFiles)
            }
          >
            {viewMultimediaImageFiles ? 'Hide Images' : 'Show Images'}
          </Button>
          <Tooltip
            placement='top'
            title='Each Multimedia file (non-image) requires an image as a cover'
            arrow
          >
            <IconButton size='large' edge='end' color='inherit' disableRipple>
              <HelpOutlineIcon color='primary' fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>
        {viewMultimediaImageFiles ? (
          <>
            {files.map((file, i) =>
              file[0].type.split('/')[0] !== 'image'
                ? multimediaImageFileHandler(file, i)
                : null,
            )}
          </>
        ) : null}
      </>
    )
  }

  const hasMultimediaFile = (files) => {
    if (files.length > 0) {
      let multimediaFileExists = false
      for (const file of files) {
        if (file[0].type.split('/')[0] !== 'image') {
          multimediaFileExists = true
          break
        }
      }
      return multimediaFileExists
    } else {
      return false
    }
  }

  return (
    <>
      <ButtonGroup>
        <Button
          component='label'
          variant='outlined'
          sx={{
            marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE,
          }}
        >
          Add Files
          <input
            type='file'
            multiple
            onChange={handleAddFiles}
            onClick={(e) => {
              e.target.value = null
            }}
            hidden
          />
        </Button>
        {files.length > 0 && (
          <>
            <Button
              component='label'
              variant='outlined'
              sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
              onClick={handleDeleteFile}
            >
              Remove File
            </Button>
            <Button
              component='label'
              variant='outlined'
              sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
              onClick={handleDeleteFiles}
            >
              Remove Files
            </Button>
          </>
        )}
      </ButtonGroup>
      {displayFiles()}
      {hasMultimediaFile(files) ? multimediaImageFilesViewer() : null}
    </>
  )
}

export default FilesUploadAndDisplay

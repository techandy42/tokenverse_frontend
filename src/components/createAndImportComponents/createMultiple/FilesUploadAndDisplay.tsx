import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { MARGIN_LARGE } from '../../../../constants'
import IconButton from '@mui/material/IconButton'
import ButtonGroup from '@mui/material/ButtonGroup'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import Tooltip from '@mui/material/Tooltip'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import FlexBox from '../../styles/FlexBox'

interface IProps {
  files: [File, File | null][]
  setFiles: React.Dispatch<React.SetStateAction<[File, File | null][]>>
  names: string[]
  setNames: React.Dispatch<React.SetStateAction<string[]>>
  genericName: string
}

const FilesUploadAndDisplay: React.FC<IProps> = ({
  files,
  setFiles,
  names,
  setNames,
  genericName,
}) => {
  const [fileIndex, setFileIndex] = useState<number>(0)
  const [viewMultimediaImageFiles, setViewMultimediaImageFiles] =
    useState<boolean>(true)

  const handleAddFiles = (e: React.ChangeEventHandler<HTMLInputElement>) => {
    if (e.target.files.length > 100) {
      alert('Please upload 1 - 100 files')
    } else {
      const uploadedFiles: [File, File | null][] = []
      for (const file of e.target.files) {
        uploadedFiles.push([file, null])
      }
      const newNames = []
      for (let i = 0; i < e.target.files.length; i++) {
        const listNumHeader = genericName === '' ? '#' : ' #'
        newNames.push(genericName + listNumHeader + `${i + 1 + names.length}`)
      }
      setNames([...names, ...newNames])
      setFiles([...files, ...uploadedFiles])
    }
  }

  const handleDeleteFile = (e: React.MouseEventHandler<HTMLLabelElement>) => {
    setNames([...names.slice(0, fileIndex), ...names.slice(fileIndex + 1)])
    setFiles([...files.slice(0, fileIndex), ...files.slice(fileIndex + 1)])
    if (files.length === fileIndex + 1 && fileIndex !== 0) {
      setFileIndex(fileIndex - 1)
    }
  }

  const handleDeleteFiles = (e: React.MouseEventHandler<HTMLLabelElement>) => {
    setNames([])
    setFiles([])
    setFileIndex(0)
  }

  const handleNext = () => {
    if (fileIndex < files.length - 1) {
      setFileIndex(fileIndex + 1)
    }
  }

  const handlePrev = () => {
    if (fileIndex > 0) {
      setFileIndex(fileIndex - 1)
    }
  }

  const displayFiles = () => {
    return (
      <>
        {files.length > 0 ? (
          <Box sx={{ marginBottom: MARGIN_LARGE }}>
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
                  onClick={() => handlePrev()}
                  sx={{ marginRight: '0.1rem' }}
                >
                  <ArrowBackIosIcon />
                </IconButton>
                <IconButton
                  size='large'
                  edge='end'
                  color='inherit'
                  onClick={() => handleNext()}
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

  const displayFile = (file: File) => {
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

  const handleAddMultimediaImageFileHandler = (file: File, i: number) => {
    setFiles([...files.slice(0, i), [files[i][0], file], ...files.slice(i + 1)])
  }

  const handleRemoveMultimediaImageFileHandler = (i: number) => {
    setFiles([...files.slice(0, i), [files[i][0], null], ...files.slice(i + 1)])
  }

  const multimediaImageFileHandler = (file: File, i: number) => {
    return (
      <>
        <Box
          sx={{
            marginBottom: MARGIN_LARGE,
          }}
        >
          {file[1] === null && (
            <Button
              component='label'
              variant='contained'
              sx={{ textTransform: 'none' }}
            >
              Add Image (Required)
              <input
                type='file'
                multiple
                onChange={(e) =>
                  handleAddMultimediaImageFileHandler(e.target.files[0], i)
                }
                onClick={(e) => {
                  e.target.value = null
                }}
                accept='image/*'
                hidden
              />
            </Button>
          )}
          {file[1] !== null && (
            <Button
              component='label'
              variant='contained'
              sx={{ textTransform: 'none' }}
              onClick={() => handleRemoveMultimediaImageFileHandler(i)}
            >
              Remove Image
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
        <FlexBox sx={{ marginBottom: MARGIN_LARGE }}>
          {displayFile(file[0])}
          {displayFile(file[1])}
        </FlexBox>
      </>
    )
  }

  const multimediaImageFilesViewer = () => {
    return (
      <>
        <Box sx={{ marginBottom: MARGIN_LARGE }}>
          <Button
            variant='contained'
            sx={{ textTransform: 'none' }}
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

  const hasMultimediaFile = (files: [File, File | null][]) => {
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
          variant='contained'
          sx={{
            marginBottom: MARGIN_LARGE,
            textTransform: 'none',
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
              variant='contained'
              sx={{ marginBottom: MARGIN_LARGE, textTransform: 'none' }}
              onClick={handleDeleteFile}
            >
              Remove File
            </Button>
            <Button
              component='label'
              variant='contained'
              sx={{ marginBottom: MARGIN_LARGE, textTransform: 'none' }}
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

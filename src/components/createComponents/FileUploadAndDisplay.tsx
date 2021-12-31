import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { FORM_MARGIN_BOTTOM_VALUE_LARGE } from '../../../constants/values'
import { create as ipfsHttpClient } from 'ipfs-http-client'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const FileUploadAndDisplay = ({ fileUrls, setFileUrls, isCreateMultiple }) => {
  const [fileIndex, setFileIndex] = useState(0)

  const onChangeFile = async (e) => {
    const files = e.target.files
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        const added = await client.add(file, {
          progress: (prog) => console.log(`received: ${prog}`),
        })
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        console.log(fileUrls)
        setFileUrls([...fileUrls, { url, type: file.type.split('/')[0] }])
      } catch (e) {
        console.log(e)
      }
    }
  }

  const displayFiles = () => {
    console.log(fileUrls)
    return (
      <>
        {fileUrls[fileIndex] ? (
          <Box sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}>
            {fileUrls[fileIndex].type === 'image' ? (
              <img
                width='400'
                height='300'
                style={{ borderRadius: '0.5rem', objectFit: 'cover' }}
                src={fileUrls[0]?.url}
              />
            ) : fileUrls[fileIndex].type === 'video' ? (
              <video
                width='400'
                height='300'
                style={{ borderRadius: '0.5rem' }}
                controls
              >
                <source src={fileUrls[fileIndex]?.url} type='video/ogg' />
                <source src={fileUrls[fileIndex]?.url} type='video/mp4' />
              </video>
            ) : fileUrls[fileIndex].type === 'audio' ? (
              <audio controls>
                <source src={fileUrls[fileIndex]?.url} type='audio/ogg' />
                <source src={fileUrls[fileIndex]?.url} type='audio/mpeg' />
              </audio>
            ) : null}
          </Box>
        ) : null}
      </>
    )
  }

  return (
    <>
      {!fileUrls[0] ? (
        <Button
          variant='contained'
          component='label'
          variant='outlined'
          sx={{
            marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE,
          }}
        >
          {isCreateMultiple ? 'Add Files' : 'Add File'}
          {isCreateMultiple ? (
            <input type='file' multiple onChange={onChangeFile} hidden />
          ) : (
            <input type='file' onChange={onChangeFile} hidden />
          )}
        </Button>
      ) : null}
      {fileUrls[0] ? (
        <Button
          variant='contained'
          component='label'
          variant='outlined'
          sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
          onClick={(e) => setFileUrls([])}
        >
          {isCreateMultiple ? 'Remove Files' : 'Remove File'}
        </Button>
      ) : null}
      {displayFiles()}
      {isCreateMultiple && fileUrls[0] ? (
        <Button onClick={(e) => setFileIndex(fileIndex + 1)} variant='outlined'>
          Next
        </Button>
      ) : null}
    </>
  )
}

export default FileUploadAndDisplay

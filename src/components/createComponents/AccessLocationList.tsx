import React from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import {
  FORM_MARGIN_BOTTOM_VALUE_LARGE,
  FORM_MARGIN_BOTTOM_VALUE_SMALL,
} from '../../../constants/values'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Tooltip from '@mui/material/Tooltip'
import Alert from '@mui/material/Alert'
import urlValidityChecker from '../../../constants/urlValidityChecker'

const AccessLocationList = ({ form, setForm }) => {
  const handleAddAccessLocation = (e) => {
    setForm({
      ...form,
      accessLocations: [...form.accessLocations, ['', '', '']],
    })
  }

  const handleRemoveAccessLocation = (i: number) => {
    setForm({
      ...form,
      accessLocations: [
        ...form.accessLocations.slice(0, i),
        ...form.accessLocations.slice(i + 1),
      ],
    })
  }

  const handleAccessLocationChange = (e, i: number) => {
    let newAccessLocation = form.accessLocations[i]
    if (e.target.name === 'accessLocationName') {
      newAccessLocation = [
        e.target.value,
        form.accessLocations[i][1],
        form.accessLocations[i][2],
      ]
    } else if (e.target.name === 'accessLocationDescription') {
      newAccessLocation = [
        form.accessLocations[i][0],
        e.target.value,
        form.accessLocations[i][2],
      ]
    } else if (e.target.name === 'accessLocationUrl') {
      newAccessLocation = [
        form.accessLocations[i][0],
        form.accessLocations[i][1],
        e.target.value,
      ]
    } else {
      newAccessLocation = [
        e.target.value,
        form.accessLocations[i][1],
        form.accessLocations[i][2],
      ]
    }
    const newAccessLocations = [
      ...form.accessLocations.slice(0, i),
      newAccessLocation,
      ...form.accessLocations.slice(i + 1),
    ]
    setForm({ ...form, accessLocations: newAccessLocations })
  }

  return (
    <Box
      sx={{
        marginTop: FORM_MARGIN_BOTTOM_VALUE_LARGE,
        marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE,
      }}
    >
      <Box
        sx={{
          marginBottom:
            form.accessLocations.length > 0
              ? FORM_MARGIN_BOTTOM_VALUE_SMALL
              : 0,
        }}
      >
        <Button variant='contained' onClick={handleAddAccessLocation}>
          Add Access Location
        </Button>
        <Tooltip
          placement='top'
          title='Virtual properties or events accessible through the NFT (ex: aespa concert - virtual aespa concert held at metaverse - https://*.*)'
          arrow
        >
          <IconButton size='large' edge='end' color='inherit' disableRipple>
            <HelpOutlineIcon color='primary' fontSize='small' />
          </IconButton>
        </Tooltip>
      </Box>
      {form.accessLocations.map((accessLocation, i) => (
        <>
          <Box
            sx={{
              display: 'flex',
              marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL,
            }}
          >
            <TextField
              fullWidth
              name='accessLocationName'
              label={`Access Location Name #${i + 1}`}
              value={accessLocation[0]}
              onChange={(e) => handleAccessLocationChange(e, i)}
            />
            <TextField
              fullWidth
              name='accessLocationDescription'
              label={`Access Location Description #${i + 1}`}
              value={accessLocation[1]}
              onChange={(e) => handleAccessLocationChange(e, i)}
            />
            <TextField
              fullWidth
              name='accessLocationUrl'
              label={`Access Location Url #${i + 1}`}
              value={accessLocation[2]}
              onChange={(e) => handleAccessLocationChange(e, i)}
            />
            <IconButton
              size='large'
              edge='end'
              color='inherit'
              disableRipple
              onClick={(e) => handleRemoveAccessLocation(i)}
            >
              <RemoveCircleOutlineIcon color='primary' />
            </IconButton>
          </Box>
          {accessLocation[2] !== '' && !urlValidityChecker(accessLocation[2]) && (
            <Alert
              severity='error'
              sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL }}
            >
              Invalid URL
            </Alert>
          )}
        </>
      ))}
    </Box>
  )
}

export default AccessLocationList

import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { MARGIN_SMALL, MARGIN_LARGE } from '../../../../constants'

interface IProps {
  names: string[]
  setNames: React.Dispatch<React.SetStateAction<string[]>>
  files: [File, File | null][]
}

const Names: React.FC<IProps> = ({ names, setNames, files }) => {
  const [showNames, setShowNames] = useState<boolean>(true)

  return (
    <div>
      <Button
        variant='contained'
        sx={{ marginBottom: MARGIN_LARGE, textTransform: 'none' }}
        onClick={() => setShowNames(!showNames)}
      >
        {showNames ? 'Hide Names' : 'Show Names'}
      </Button>
      {showNames && (
        <>
          {names.length === 0 && (
            <Typography variant='subtitle1' sx={{ marginBottom: MARGIN_LARGE }}>
              No files added
            </Typography>
          )}
          {names.map((name, i) => (
            <>
              <TextField
                sx={{
                  marginBottom:
                    i === names.length - 1 ? MARGIN_LARGE : MARGIN_SMALL,
                }}
                variant='outlined'
                label={`Name - #${files[i][0].name}`}
                value={name}
                fullWidth
                required
                onChange={(e) =>
                  setNames([
                    ...names.slice(0, i),
                    e.target.value,
                    ...names.slice(i + 1),
                  ])
                }
              />
            </>
          ))}
        </>
      )}
    </div>
  )
}

export default Names

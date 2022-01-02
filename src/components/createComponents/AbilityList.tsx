import React from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Input from '@mui/material/Input'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import {
  FORM_MARGIN_BOTTOM_VALUE_LARGE,
  FORM_MARGIN_BOTTOM_VALUE_SMALL,
} from '../../../constants/values'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Tooltip from '@mui/material/Tooltip'

const AbilityList = ({ form, setForm }) => {
  const handleAddAbility = (e) => {
    setForm({ ...form, abilities: [...form.abilities, ['', 0]] })
  }

  const handleRemoveAbility = (i) => {
    setForm({
      ...form,
      abilities: [
        ...form.abilities.slice(0, i),
        ...form.abilities.slice(i + 1),
      ],
    })
  }

  const handleAbilityChange = (e, i) => {
    let newAbility = form.abilities[i]
    if (e.target.name === 'abilityName') {
      newAbility = [e.target.value, form.abilities[i][1]]
    } else if (e.target.name === 'abilityValue') {
      newAbility = [form.abilities[i][0], e.target.value]
    } else {
      newAbility = [e.target.value, form.abilities[i][1]]
    }
    const newAbilities = [
      ...form.abilities.slice(0, i),
      newAbility,
      ...form.abilities.slice(i + 1),
    ]
    setForm({ ...form, abilities: newAbilities })
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
            form.abilities.length > 0 ? FORM_MARGIN_BOTTOM_VALUE_SMALL : 0,
        }}
      >
        <Button variant='contained' onClick={handleAddAbility}>
          Add Ability
        </Button>
        <Tooltip
          placement='top'
          title='Abilities of the object that the NFT represents (ex: health - 100)'
          arrow
        >
          <IconButton size='large' edge='end' color='inherit' disableRipple>
            <HelpOutlineIcon color='primary' fontSize='small' />
          </IconButton>
        </Tooltip>
      </Box>
      {form.abilities.map((ability, i) => (
        <Box
          sx={{
            display: 'flex',
            marginBottom: FORM_MARGIN_BOTTOM_VALUE_SMALL,
          }}
        >
          <TextField
            fullWidth
            name='abilityName'
            label={`Ability Name #${i + 1}`}
            value={ability[0]}
            onChange={(e) => handleAbilityChange(e, i)}
          />
          <Box sx={{ width: '2rem' }} />
          <Input
            type='number'
            fullWidth
            name='abilityValue'
            value={ability[1]}
            onChange={(e) => handleAbilityChange(e, i)}
          />
          <IconButton
            size='large'
            edge='end'
            color='inherit'
            disableRipple
            onClick={(e) => handleRemoveAbility(i)}
          >
            <RemoveCircleOutlineIcon color='primary' />
          </IconButton>
        </Box>
      ))}
    </Box>
  )
}

export default AbilityList

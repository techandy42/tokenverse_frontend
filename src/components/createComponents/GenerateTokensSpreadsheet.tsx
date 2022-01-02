import React from 'react'
import TextField from '@mui/material/TextField'

const GenerateTokensSpreadsheet = ({
  names,
  setNames,
  descriptions,
  setDescriptions,
  topColorOnes,
  setTopColorOnes,
  topFeatureOnes,
  setTopFeatureOnes,
  topColorTwos,
  setTopColorTwos,
  topFeatureTwos,
  setTopFeatureTwos,
  domainNames,
  setDomainNames,
  propertiesList,
  setPropertiesList,
  accessLocationsList,
  setAccessLocationsList,
  points,
  setPoints,
  levelPoints,
  setLevelPoints,
  levelSteps,
  setLevelSteps,
  abilitiesList,
  setAbilitiesList,
  isSensitives,
  setIsSensitives,
}) => {
  return (
    <div>
      {names.map((name, i) => (
        <>
          <TextField
            variant='outlined'
            label={`Name #${i}`}
            value={name}
            fullWidth
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
    </div>
  )
}

export default GenerateTokensSpreadsheet

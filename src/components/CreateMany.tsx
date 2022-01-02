import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { FORM_MARGIN_BOTTOM_VALUE_LARGE, FORM } from '../../constants/values'
import FilesUploadAndDisplay from './createComponents/FilesUploadAndDisplay'
import TokenNameDescription from './createComponents/TokenNameDescription'
import DividerMarginBottom from './styles/DividerMarginBottom'
import AccessLocationList from './createComponents/AccessLocationList'
import SensitiveContent from './createComponents/SensitiveContent'
import { Divider } from '@mui/material'
import Typography from '@mui/material/Typography'
import GenerateTokensSpreadsheet from './createComponents/GenerateTokensSpreadsheet'
import KeyFeatures from './createComponents/KeyFeatures'

const CreateMany = ({
  collection,
  tokenType,
  blockchainType,
  clearCounter,
}) => {
  const [form, setForm] = useState(FORM)
  const [files, setFiles] = useState([])
  const [names, setNames] = useState([])
  const [descriptions, setDescriptions] = useState([])
  const [topColorOnes, setTopColorOnes] = useState([])
  const [topFeatureOnes, setTopFeatureOnes] = useState([])
  const [topColorTwos, setTopColorTwos] = useState([])
  const [topFeatureTwos, setTopFeatureTwos] = useState([])
  const [domainNames, setDomainNames] = useState([])
  const [propertiesList, setPropertiesList] = useState([])
  const [accessLocationsList, setAccessLocationsList] = useState([])
  const [points, setPoints] = useState([])
  const [levelPoints, setLevelPoints] = useState([])
  const [levelSteps, setLevelSteps] = useState([])
  const [abilitiesList, setAbilitiesList] = useState([])
  const [isSensitives, setIsSensitives] = useState([])
  const [isTokensSpreadsheetVisible, setIsTokensSpreadsheetVisible] =
    useState(false)

  console.log(names)

  useEffect(() => {
    setForm(FORM)
    setFiles([])
    setNames([])
    setDescriptions([])
    setTopColorOnes([])
    setTopFeatureOnes([])
    setTopColorTwos([])
    setTopFeatureTwos([])
    setDomainNames([])
    setPropertiesList([])
    setAccessLocationsList([])
    setPoints([])
    setLevelPoints([])
    setLevelSteps([])
    setAbilitiesList([])
    setIsSensitives([])
    setIsTokensSpreadsheetVisible(false)
  }, [clearCounter])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const handleUpdateTokensSpreadsheet = () => {
    const len = files.length
    if (len > 0) {
      const tempNames = []
      for (let i = 0; i < len; i++) {
        tempNames.push(`${form.name} #${i}`)
      }
      setNames(tempNames)
      setDescriptions(Array(len).fill(form.description))
      setTopFeatureOnes(Array(len).fill(form.topFeatureOne))
      setTopFeatureTwos(Array(len).fill(form.topFeatureTwo))
      setAccessLocationsList(Array(len).fill(form.accessLocations))
      setIsSensitives(Array(len).fill(form.isSensitives))
    } else {
      alert('Please have at least one file uploaded')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FilesUploadAndDisplay files={files} setFiles={setFiles} />
      <Typography
        variant='h5'
        sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
      >
        Generic Name & Description
      </Typography>
      <TokenNameDescription form={form} handleChange={handleChange} />
      <DividerMarginBottom />
      {tokenType !== 'Domain Names' && (
        <>
          <Typography
            variant='h5'
            sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
          >
            Generic Features
          </Typography>
          <KeyFeatures form={form} handleChange={handleChange} />
          <DividerMarginBottom />
        </>
      )}
      <AccessLocationList form={form} setForm={setForm} />
      <Divider />
      <SensitiveContent form={form} setForm={setForm} />
      <DividerMarginBottom />
      <DividerMarginBottom />
      <Button
        variant='outlined'
        sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
        type='submit'
      >
        Create Digital Assets
      </Button>
    </form>
  )
}

export default CreateMany

import React, { useState, useEffect } from 'react'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { FORM_MARGIN_BOTTOM_VALUE_LARGE, FORM } from '../../constants/values'
import AccessLocationList from './createComponents/AccessLocationList'
import AbilityList from './createComponents/AbilityList'
import PropertyList from './createComponents/PropertyList'
import Point from './createComponents/Point'
import Level from './createComponents/Level'
import SensitiveContent from './createComponents/SensitiveContent'
import KeyFeatureColors from './createComponents/KeyFeatureColors'
import DomainName from './createComponents/DomainName'
import TokenNameDescription from './createComponents/TokenNameDescription'
import DividerMarginBottom from './styles/DividerMarginBottom'
import FileUploadAndDisplay from './createComponents/FileUploadAndDisplay'
import urlValidityChecker from '../../constants/urlValidityChecker'

const CreateOne = ({
  collection,
  tokenType,
  blockchainType,
  clearCounter,
  // form,
  // setForm,
  // file,
  // setFile,
  // multimediaImageFile,
  // setMultimediaImageFile,
}) => {
  const [form, setForm] = useState(FORM)
  const [file, setFile] = useState(null)
  const [multimediaImageFile, setMultimediaImageFile] = useState(null)

  useEffect(() => {
    setForm(FORM)
    setFile(null)
  }, [clearCounter])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validUrls = () => {
    const isDomainNameValid =
      form.domainName === '' ? true : urlValidityChecker(form.domainName)
    let isAccessLocationUrlsValid = true
    let invalidAccessLocationUrlIndexes = []
    for (let i = 0; i < form.accessLocations.length; i++) {
      if (
        form.accessLocations[i][2] === ''
          ? false
          : !urlValidityChecker(form.accessLocations[i][2])
      ) {
        console.log(form.accessLocations[i][2])
        isAccessLocationUrlsValid = false
        invalidAccessLocationUrlIndexes.push(i)
      }
    }
    if (isDomainNameValid && isAccessLocationUrlsValid) return true
    else {
      let errorMessage = ''
      if (!isDomainNameValid) errorMessage += `\nDomain Name is invalid URL`
      for (const invalidAccessLocationUrlIndex of invalidAccessLocationUrlIndexes) {
        errorMessage += `\nAccess Location Url #${
          invalidAccessLocationUrlIndex + 1
        } is invalid URL`
      }
      return errorMessage
    }
  }

  const validMultimediaImageFile = () => {
    if (file?.type.split('/')[0] === 'image') return true
    else if (file?.type.split('/') !== 'image' && multimediaImageFile !== null)
      return true
    else return 'No image cover file added for multimedia (non-image) main file'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validedUrls = validUrls()
    const validedMultimediaImageFile = validMultimediaImageFile()
    let errorMessage = 'Errors:'
    if (validedUrls === true && validedMultimediaImageFile === true) {
      // Format Token
      // Format Following:
      // collection
      // tokenType
      // blockchainType
      // file
      // multimediaImageFile?
      // form
      // empty the unnecessary properties of form during formatting
      // get the url of the file during formatting
    } else {
      if (validedUrls !== true) errorMessage += `\n${validedUrls}`
      if (validedMultimediaImageFile !== true)
        errorMessage += `\n${validedMultimediaImageFile}`
      alert(errorMessage)
    }
  }

  // Use before minting

  const getFileUrl = async (file) => {
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      })
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      return url
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FileUploadAndDisplay
        file={file}
        setFile={setFile}
        multimediaImageFile={multimediaImageFile}
        setMultimediaImageFile={setMultimediaImageFile}
      />
      <TokenNameDescription form={form} handleChange={handleChange} />
      <DividerMarginBottom />
      {tokenType === 'Domain Names' ? (
        <DomainName form={form} handleChange={handleChange} />
      ) : (
        <>
          <Typography
            variant='h5'
            sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }}
          >
            Key Features & Colors
          </Typography>
          <KeyFeatureColors
            form={form}
            setForm={setForm}
            handleChange={handleChange}
          />
        </>
      )}
      <DividerMarginBottom />
      <PropertyList form={form} setForm={setForm} />
      <DividerMarginBottom />
      <AccessLocationList form={form} setForm={setForm} />
      {tokenType === 'Trading Cards' ||
      tokenType === 'Virtual Reality - Real Estates' ||
      tokenType === 'Virtual Reality - Accessories' ||
      tokenType === 'Virtual Reality - Avatar' ? (
        <>
          <DividerMarginBottom />
          <Point form={form} handleChange={handleChange} />
          <Level form={form} handleChange={handleChange} />
          <AbilityList form={form} setForm={setForm} />
        </>
      ) : null}
      <Divider />
      <SensitiveContent form={form} setForm={setForm} />
      <DividerMarginBottom />
      <Button variant='outlined' type='submit'>
        Create Digital Asset
      </Button>
    </form>
  )
}

export default CreateOne

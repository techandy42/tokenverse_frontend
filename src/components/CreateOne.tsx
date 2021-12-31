import React, { useState, useEffect } from 'react'
import Divider from '@mui/material/Divider'
import { FORM_MARGIN_BOTTOM_VALUE_LARGE, FORM } from '../../constants/values'
import AccessLocationList from './createComponents/AccessLocationList'
import AbilityList from './createComponents/AbilityList'
import PropertyList from './createComponents/PropertyList'
import Point from './createComponents/Point'
import Level from './createComponents/Level'
import SensitiveContent from './createComponents/SensitiveContent'
import KeyFeatures from './createComponents/KeyFeatures'
import DomainName from './createComponents/DomainName'
import TokenNameDescription from './createComponents/TokenNameDescription'

const CreateOne = ({
  isCreateMultiple,
  tokenType,
  forms,
  setForms,
  fileUrls,
  setFileUrls,
  clearCounter,
}) => {
  const [form, setForm] = useState(FORM)

  useEffect(() => {
    setForm(FORM)
  }, [clearCounter])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <>
      <TokenNameDescription form={form} handleChange={handleChange} />
      <Divider sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }} />
      {tokenType === 'Domain Names' ? (
        <DomainName form={form} handleChange={handleChange} />
      ) : (
        <KeyFeatures form={form} handleChange={handleChange} />
      )}
      <Divider sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }} />
      <PropertyList form={form} setForm={setForm} />
      <Divider sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }} />
      <AccessLocationList form={form} setForm={setForm} />
      {tokenType === 'Trading Cards' ||
      tokenType === 'Virtual Reality - Real Estates' ||
      tokenType === 'Virtual Reality - Accessories' ||
      tokenType === 'Virtual Reality - Avatar' ? (
        <>
          <Divider sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }} />
          <Point form={form} handleChange={handleChange} />
          <Level form={form} handleChange={handleChange} />
          <AbilityList form={form} setForm={setForm} />
        </>
      ) : null}
      <Divider />
      <SensitiveContent form={form} setForm={setForm} />
      <Divider sx={{ marginBottom: FORM_MARGIN_BOTTOM_VALUE_LARGE }} />
    </>
  )
}

export default CreateOne

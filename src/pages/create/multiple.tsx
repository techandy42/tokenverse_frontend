import { useState } from 'react'
import CreateMultiple from '../../components/createAndImportComponents/CreateMultiple'
import StyledPageBase from '../../components/styles/StyledPageBase'
import CreateFormNav from '../../components/createAndImportComponents/CreateFormNav'

export default function multiple() {
  const [clearCounter, setClearCounter] = useState<number>(0)

  return (
    <StyledPageBase>
      <CreateFormNav
        formType='multiple'
        clearCounter={clearCounter}
        setClearCounter={setClearCounter}
      />
      <CreateMultiple
        clearCounter={clearCounter}
        setClearCounter={setClearCounter}
      />
    </StyledPageBase>
  )
}

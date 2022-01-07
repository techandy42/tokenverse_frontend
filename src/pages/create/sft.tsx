import { useState } from 'react'
import CreateSFT from '../../components/createAndImportComponents/CreateSFT'
import StyledPageBase from '../../components/styles/StyledPageBase'
import CreateFormNav from '../../components/createAndImportComponents/CreateFormNav'

export default function SFT() {
  const [clearCounter, setClearCounter] = useState<number>(0)

  return (
    <StyledPageBase>
      <CreateFormNav
        formType='sft'
        clearCounter={clearCounter}
        setClearCounter={setClearCounter}
      />
      <CreateSFT
        clearCounter={clearCounter}
        setClearCounter={setClearCounter}
      />
    </StyledPageBase>
  )
}

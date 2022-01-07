import { useState } from 'react'
import ImportSFT from '../../components/createAndImportComponents/ImportSFT'
import StyledPageBase from '../../components/styles/StyledPageBase'
import CreateFormNav from '../../components/createAndImportComponents/CreateFormNav'

export default function importSFT() {
  const [clearCounter, setClearCounter] = useState<number>(0)

  return (
    <StyledPageBase>
      <CreateFormNav
        formType='import-sft'
        clearCounter={clearCounter}
        setClearCounter={setClearCounter}
      />
      <ImportSFT
        clearCounter={clearCounter}
        setClearCounter={setClearCounter}
      />
    </StyledPageBase>
  )
}

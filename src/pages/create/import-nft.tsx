import { useState } from 'react'
import ImportNFT from '../../components/createAndImportComponents/ImportNFT'
import StyledPageBase from '../../components/styles/StyledPageBase'
import CreateFormNav from '../../components/createAndImportComponents/CreateFormNav'

export default function importNFT() {
  const [clearCounter, setClearCounter] = useState<number>(0)

  return (
    <StyledPageBase>
      <CreateFormNav
        formType='import-nft'
        clearCounter={clearCounter}
        setClearCounter={setClearCounter}
      />
      <ImportNFT
        clearCounter={clearCounter}
        setClearCounter={setClearCounter}
      />
    </StyledPageBase>
  )
}

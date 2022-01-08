import { useState } from 'react'
import CreateSingle from '../components/createAndImportComponents/CreateSingle'
import StyledPageBase from '../components/styles/StyledPageBase'
import CreateFormNav from '../components/createAndImportComponents/CreateFormNav'

// fetch collections from the back-end
// example:
const newlyGeneratedCollection = 'random-collection-#1234567890'
export const collections = [
  newlyGeneratedCollection,
  'Collection 1',
  'Collection 2',
  'Collection 3',
  'Collection 4',
  'Collection 5',
]

export default function Create() {
  const [clearCounter, setClearCounter] = useState<number>(0)

  return (
    <StyledPageBase>
      <CreateFormNav
        formType='single'
        clearCounter={clearCounter}
        setClearCounter={setClearCounter}
      />
      <CreateSingle
        clearCounter={clearCounter}
        setClearCounter={setClearCounter}
      />
    </StyledPageBase>
  )
}

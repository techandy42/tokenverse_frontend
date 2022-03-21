type DisplayType = 'boost_number' | 'boost_percentage' | 'number' | 'date'

interface IStringAttribute {
  trait_type?: string
  value: string
}

interface INumericAttribute {
  display_type?: DisplayType
  trait_type: string
  value: number
}

type Attribute = IStringAttribute | INumericAttribute

export default Attribute

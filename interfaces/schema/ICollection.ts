export default interface ICollection {
  uuid: string
  image: string | null
  description: string
  createdAt: Date
  name: string
  isNameModified: boolean
}

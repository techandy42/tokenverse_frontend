export default interface IPersonalInfo {
  joinedDate: Date
  image: File | null
  userName: string
  companyName: string
  description: string

  email: string
  mainLink: string
  facebookLink: string
  instagramLink: string
  twitterLink: string
  linkedInLink: string

  verified: boolean
  verificationDate: Date | null
  verificationFile: File | null
}
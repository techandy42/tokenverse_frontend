export default interface IPersonalInfo {
  joinedDate: Date
  image: File | null
  userName: string
  companyName: string | null
  description: string | null

  email: string | null
  mainLink: string | null
  facebookLink: string | null
  instagramLink: string | null
  twitterLink: string | null
  linkedInLink: string | null

  verified: boolean
  verificationDate: Date | null
  verificationFile: File | null
}

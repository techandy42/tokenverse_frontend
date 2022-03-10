const formatPersonalInfoString = (
  fetchedPersonalInfoString: string,
  limit: number,
) => {
  if (fetchedPersonalInfoString.length > limit) {
    return fetchedPersonalInfoString.slice(0, limit - 2) + '..'
  } else {
    return fetchedPersonalInfoString
  }
}

export default formatPersonalInfoString

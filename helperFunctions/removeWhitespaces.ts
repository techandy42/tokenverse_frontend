export default function removeWhitespaces(str: string) {
  const isOnlyWhitespace = /^\s*$/.test(str)
  if (isOnlyWhitespace) {
    // return empty string if the str is only whitespace
    return ''
  } else {
    // trim the string if the str has non-whitespace characters
    return str.trim()
  }
}

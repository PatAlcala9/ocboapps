export default (firstname: string, middleinitial: string, lastname: string) => {
  let result
  if (firstname.length > 0) {
    if (middleinitial.length > 0) {
      result = `${firstname} ${middleinitial}. ${lastname}`
    } else {
      result = `${firstname} ${lastname}`
    }
  } else {
    result = lastname
  }
  return result
}

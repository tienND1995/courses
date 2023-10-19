export const handleTypePassword = (inputType, setInputType) => {
  inputType === 'password' ? setInputType('text') : setInputType('password')
}

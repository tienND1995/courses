export const handleClick = (e, lessionRef) => {
  if (lessionRef.current.className.includes('active')) {
    lessionRef.current.classList.remove('active')
    e.target.classList.remove('fa-circle-minus')
    e.target.classList.add('fa-circle-plus')
  } else {
    lessionRef.current.classList.add('active')
    e.target.classList.add('fa-circle-minus')
    e.target.classList.remove('fa-circle-plus')
  }
}

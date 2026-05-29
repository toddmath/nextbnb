function tryCatch({ tryer, catcher = console.log }) {
  return props => {
    try {
      return tryer(props)
    } catch (e) {
      return catcher(props, e.message)
    }
  }
}

module.exports = tryCatch

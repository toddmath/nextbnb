const conditionally = config => props => {
  return config.if(props) ? config.then(props) : config.else(props)
}

module.exports = conditionally

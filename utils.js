

exports.print = async (data) => {
  if (typeof data === 'string') {
    console.log(data)
  } else {
    console.log(JSON.stringify(data, null, 2))
  }
}
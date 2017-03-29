let uid = -1
const result = window.location.search.match(/uid=(\d+)/)

if (result) {
  uid = result[1]
}

export default uid

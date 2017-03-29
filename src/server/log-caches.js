let caches = {}

const initCacheWithReq = req => {
  let id = req.params.id.toUpperCase()
  if (caches[id] === undefined) {
    let { ip, headers: { ['user-agent']: ua } } = req
    caches[id] = {
      hash: new Buffer(ip + ua).toString('base64').substr(0, 5).toUpperCase(),
      logs: [],
      ip, ua
    }
  }

  return caches[id]
}

const getCacheByClientId = id => caches[id]

const deleteCacheByClientId = id => Reflect.deleteProperty(caches, id)

const getAll = () => caches

export default { getAll, getCacheByClientId, initCacheWithReq, deleteCacheByClientId }

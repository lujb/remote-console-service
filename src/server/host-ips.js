import os from 'os'

let publicIPs = []
let vmIPs = []
let internalIPs = []
let netifs = []

const pushIP = (netif, array) => {
  array.push({
    name: netif.name,
    ip: netif.addr.address
  })
}

if (os.networkInterfaces) {
  netifs = os.networkInterfaces()
} else {
  netifs = os.getNetworkInterfaces()
}

_.map(netifs, (addrs, name) => {
  let addr = false

  addrs.forEach(_addr => {
    if (_addr.family === 'IPv4') {
      addr = _addr
    }
  })

  return { name, addr }
}).filter(netif => netif.addr)
  .forEach(netif => {
    if (netif.addr.mac === '00:00:00:00:00:00') {
      pushIP(netif, internalIPs)
    } else {
      if (/vmware|vboxnet|virtualbox|docker/i.test(netif.name)) {
        pushIP(netif, vmIPs)
      } else {
        pushIP(netif, publicIPs)
      }
    }
  })

export default _.concat(publicIPs, vmIPs, internalIPs)

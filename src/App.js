import { useEffect, useState } from 'react'
import protobuf from 'protobufjs'
const { Buffer } = require('buffer/')

function formatPrice(price) {
  return `$${price.toFixed(2)}`
}

function App() {
  const [currentPrice, setCurrentPrice] = useState(null)

  useEffect(() => {
    const ws = new WebSocket('wss://streamer.finance.yahoo.com')
    protobuf.load('./YPricingData.proto', (error, root) => {
      if (error) {
        console.log(error)
      }
      const Yaticker = root.lookupType('yaticker')

      ws.onopen = function open() {
        console.log('connected')

        ws.send(
          JSON.stringify({
            subscribe: ['GME'],
          })
        )
      }

      ws.onclose = function close() {
        console.log('disconnected')
      }

      ws.onmessage = function incoming(message) {
        const next = Yaticker.decode(new Buffer(message.data, 'base64'))
        setCurrentPrice(next)
      }
    })
  }, [])

  return (
    <div>
      <h1>RTST</h1>
      {(currentPrice && <h2>{formatPrice(currentPrice.price)}</h2>) || <h2>Waiting for update signal...</h2>}
    </div>
  )
}

export default App

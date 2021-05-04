import { useEffect } from 'react'
import protobuf from 'protobufjs'
const { Buffer } = require('buffer/')

function App() {
  useEffect(() => {
    const ws = new WebSocket('wss://streamer.finance.yahoo.com')
    // const root = protobuf.loadSync('./YPricingData.proto')
    protobuf.load('./YPricingData.proto', (error, root) => {
      if (error) {
        console.log(error)
      }
      const Yaticker = root.lookupType('yaticker')

      ws.onopen = function open() {
        console.log('connected')

        ws.send(
          JSON.stringify({
            subscribe: ['MSFT'],
          })
        )
      }

      ws.onclose = function close() {
        console.log('disconnected')
      }

      ws.onmessage = function incoming(message) {
        // console.log('incoming data')
        // console.log(message.data)
        // console.log(Yaticker.decode(new ArrayBuffer(message.data, 'base64')))
        console.log(Yaticker.decode(new Buffer(message.data, 'base64')))
      }
    })
  }, [])

  return (
    <div>
      <h1>RTST</h1>
    </div>
  )
}

export default App

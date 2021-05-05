import { useEffect, useState } from 'react'
import protobuf from 'protobufjs'
const { Buffer } = require('buffer/')

function formatPrice(price) {
  return `$${price.toFixed(2)}`
}

function App() {
  // const timezone = new Date().toString().split('GMT')
  const timezone = new Date().toString().split(' ')[5]
  const [currentPrice, setCurrentPrice] = useState(null)
  const [currentTime, setCurrentTime] = useState('')
  const [ticker, setTicker] = useState('')

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
            subscribe: [`${ticker}`],
          })
        )
      }

      ws.onclose = function close() {
        console.log('disconnected')
      }

      ws.onmessage = function incoming(message) {
        const next = Yaticker.decode(new Buffer(message.data, 'base64'))
        setCurrentPrice(next)
        const utc = new Date().getTime()
        const time = new Date(utc).toLocaleTimeString().toString()
        setCurrentTime(time)
      }
    })
  }, [ticker])

  const submitHandler = (e) => {
    e.preventDefault()
  }

  const tickerHandler = (e) => {
    setTicker(e.target.value)
    console.log(ticker)
  }

  return (
    <div>
      <h1>RTST: RealTime StockTicker</h1>
      <form onSubmit={submitHandler}>
        <label>
          Ticker:
          <input type='text' name='ticker' value={ticker} onChange={tickerHandler} />
        </label>
        <input type='submit' value='Submit' />
      </form>

      {(currentPrice && <h2>{formatPrice(currentPrice.price)}</h2>) || <h2>Loading...</h2>}
      {currentTime && (
        <p>
          {currentTime}, {timezone.replace('-', ' -').replaceAll('0', '')}
        </p>
      )}
    </div>
  )
}

export default App

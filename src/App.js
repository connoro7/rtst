import { useEffect } from 'react'

function App() {
  useEffect(() => {
    const ws = new WebSocket('wss://streamer.finance.yahoo.com')

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
      console.log('incoming data')
      console.log(message.data)
    }
  }, [])

  return (
    <div>
      <h1>RTST</h1>
    </div>
  )
}

export default App

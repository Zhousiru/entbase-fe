import { Routes } from '@generouted/react-router/lazy'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider>
      <Routes />
    </MantineProvider>
  </React.StrictMode>,
)

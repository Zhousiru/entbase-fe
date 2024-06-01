import { Routes } from '@generouted/react-router/lazy'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <Routes />
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>,
)

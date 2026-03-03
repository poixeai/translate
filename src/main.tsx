import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ThemeProvider from './providers/ThemeProvider.tsx'
import "./i18n";
import "./styles/globals.css";
import { seedDbOnce } from "./db/seeds";

seedDbOnce().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  )
})

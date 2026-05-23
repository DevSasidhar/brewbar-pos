import { BrowserRouter, Route, Routes } from 'react-router-dom'
import WorkerHome from './pages/WorkerHome'
import AdminHome from './pages/AdminHome'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-brew-cream text-brew-ink">
        {/* Nav is hidden from workers. Only the POS is visible. */}
        <div className="border-b border-brew-line bg-white px-4 py-3 shadow-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <div className="font-black text-lg">Brewbar Cafe</div>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<WorkerHome />} />
          <Route path="/brewbar-mass" element={<AdminHome />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

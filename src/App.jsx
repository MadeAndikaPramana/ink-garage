import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Team from './pages/Team'
import Portfolio from './pages/Portfolio'
import Pricing from './pages/Pricing'
import Book from './pages/Book'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team/:branch" element={<Team />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:category" element={<Portfolio />} />
        <Route path="/gallery" element={<Navigate to="/portfolio" replace />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faq" element={<Navigate to="/pricing" replace />} />
        <Route path="/book" element={<Book />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<Navigate to="/#about" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

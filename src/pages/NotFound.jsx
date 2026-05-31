import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-black text-slate-300">404</h1>
        <p className="mt-4 text-lg text-slate-500">पेज नहीं मिला</p>
        <Link to="/" className="btn-primary mt-6 inline-block">
          होम पर जाएं
        </Link>
      </div>
    </div>
  )
}

import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="text-balance text-4xl font-extrabold tracking-tight text-slate-100 sm:text-5xl">
          StreetScore
        </h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Live scores, match stats, and cricket updates in one place.
        </p>
      </main>
    </>
  )
}

export default App

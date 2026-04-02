import { useState } from 'react'

const links = [
  { label: 'Home', href: '#' },
  { label: 'Live Scores', href: '#' },
  { label: 'Teams', href: '#' },
  { label: 'Schedule', href: '#' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-4 z-20 mx-4 md:mx-auto md:max-w-6xl">
      <div className="relative z-50 rounded-full border border-[#454242] bg-white backdrop-blur-md">
        <nav
          className="mx-auto flex min-h-[68px] w-full items-center justify-between gap-3 px-4 sm:px-6"
          aria-label="Main navigation"
        >
          <a
            className="text-xl font-bold tracking-tight text-[#00a79d]"
            href="#"
            aria-label="StreetScore home"
          >
            Street<span className="text-black">Score</span>
          </a>

          <button
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-400/60 bg-white text-slate-900 transition-all duration-300 active:scale-95 md:hidden"
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
          >
            <span className="sr-only">Toggle navigation</span>
            <span
              className={`absolute h-0.5 w-5 rounded-full bg-slate-900 transition-all duration-300 ${
                isOpen ? 'translate-y-0 rotate-45' : '-translate-y-[6px] rotate-0'
              }`}
            />
            <span
              className={`absolute h-0.5 w-5 rounded-full bg-slate-900 transition-all duration-300 ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute h-0.5 w-5 rounded-full bg-slate-900 transition-all duration-300 ${
                isOpen ? 'translate-y-0 -rotate-45' : 'translate-y-[6px] rotate-0'
              }`}
            />
          </button>

          <ul className="hidden items-center gap-5 md:flex">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  className="text-md relative cursor-pointer font-medium text-[#454242] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-green-500 after:transition-all after:duration-300 after:content-[''] hover:after:w-full"
                  href={link.href}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            className="hidden rounded-full border border-cyan-300/70 bg-[#00a79d] px-4 py-2 text-sm font-semibold text-[#454242] shadow-[6px_6px_0px_0px_black] transition-shadow duration-300 hover:shadow-[4px_4px_0px_0px_black] md:inline-block"
            type="button"
          >
            Sign In
          </button>
        </nav>
      </div>

   <div
  id="mobile-nav"
  className={`fixed inset-0 z-40 flex h-[100dvh] flex-col overflow-hidden bg-[#f5f2ed] md:hidden
    transition-transform duration-[450ms] ease-[cubic-bezier(0.77,0,0.18,1)]
    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
  style={{ paddingTop: '104px', paddingBottom: '16px' }}
>
  <ul className="flex min-h-0 flex-1 flex-col">
    {links.map((link, index) => (
      <li
        key={link.label}
        className={`group relative flex flex-1 flex-col justify-center px-5
          transition-all duration-[450ms]
          ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
        style={{ transitionDelay: isOpen ? `${70 + index * 60}ms` : '0ms' }}
      >
        <a
          href={link.href}
          onClick={() => setIsOpen(false)}
          className="font-['Syne'] text-[30px] font-bold leading-none tracking-tight text-[#111]
            flex items-center gap-2.5 w-fit
            transition-all duration-200 hover:text-[#00a79d] hover:gap-4"
        >
          <span className="font-['DM_Sans'] text-[11px] font-medium text-[#aaa] self-start mt-1.5">
            0{index + 1}
          </span>
          {link.label}
        </a>

        <div className="absolute bottom-0 left-0 right-0 h-px flex items-center overflow-hidden">
          <div className="h-px bg-[#ddd] flex-[2] transition-all duration-400 group-hover:flex-[1]" />
          <div className="h-px bg-[#00a79d] rounded-full flex-[0.3] mx-0 transition-all duration-400 group-hover:flex-[1.2]" />
          <div className="h-px bg-[#ddd] flex-1" />
          <div className="h-px bg-[#111] rounded-full flex-[0.15] transition-all duration-400 group-hover:flex-[0.5]" />
          <div className="h-px bg-[#ddd] flex-[1.5]" />
        </div>
      </li>
    ))}
  </ul>

  <div
    className={`px-5 transition-all duration-400 pt-2
      ${isOpen ? 'translate-y-0 opacity-100 delay-[350ms]' : 'translate-y-4 opacity-0'}`}
  >
    <button
      className="w-full flex items-center justify-center gap-2 rounded-full
        bg-[#00a79d] px-7 py-3.5 font-['Syne'] text-[15px] font-bold text-white
        shadow-[5px_5px_0px_#005f5b] transition-all duration-200
        hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0px_#005f5b]"
      type="button"
    >
      Sign In <span className="text-lg">→</span>
    </button>
  </div>
</div>
    </header>
  )
}

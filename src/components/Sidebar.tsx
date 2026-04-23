
import { useTheme } from '../context/ThemeContext'


import { Sun, Moon } from 'lucide-react'

export default function Sidebar() {
  
  const { darkMode, toggleTheme } = useTheme()

  return (
   
    <aside className="
      fixed top-0 left-0 z-50
      w-full h-[72px]
      flex flex-row items-center justify-between
      lg:w-[103px] lg:h-screen
      lg:flex-col lg:justify-between
      lg:rounded-r-[20px]
      bg-[#373B53] dark:bg-[#1E2139]
      transition-colors duration-300
    ">

      <div className="
        relative overflow-hidden flex-shrink-0
        w-[72px] h-[72px]
        lg:w-[103px] lg:h-[103px]
        bg-[#7C5DFA]
        rounded-br-[20px] lg:rounded-br-[20px] lg:rounded-tr-[20px]
        flex items-center justify-center
      ">
        
        <div className="
          absolute bottom-0 left-0
          w-full h-1/2
          bg-[#9277FF]
          rounded-tl-[20px]
        " />

        
        <svg
          className="relative z-10"
          width="28"
          height="26"
          viewBox="0 0 28 26"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.513 0L28 13L20.513 26H7.487L0 13L7.487 0H20.513Z"
            fill="white"
            fillOpacity="0.3"
          />
          <path
            d="M20.513 0L28 13H14L20.513 0Z"
            fill="white"
          />
        </svg>
      </div>

      
      <div className="
        flex flex-row lg:flex-col
        items-center gap-2
        pr-4 lg:pr-0 lg:pb-6
      ">

       
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="
            p-4
            text-[#7E88C3] hover:text-white
            transition-colors duration-200
          "
        >

          {darkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

        
        <div className="
          bg-[#494E6E]
          w-px h-8
          lg:w-full lg:h-px
          lg:my-2
        " />

        {/* AVATAR */}
        {/* Just a placeholder profile picture */}
        <div className="p-4">
          <div className="
            w-8 h-8 rounded-full
            overflow-hidden
            ring-2 ring-[#7C5DFA]
          ">
            <img
              src="https://i.pravatar.cc/32"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
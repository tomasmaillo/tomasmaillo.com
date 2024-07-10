'use client'
import { useEffect } from 'react'

const StartupConsoleLog = () => {
  useEffect(() => {
    setTimeout(() => {
      console.log(
        `%c 









        




dP                dP dP          
88                88 88          
88d888b. .d8888b. 88 88 .d8888b. 
88'   88 88ooood8 88 88 88'   88 
88    88 88.  ... 88 88 88.  .88 
dP    dP  88888P' dP dP  88888P
      
Having a look at the console, huh? 🧐

I also love checking what is running under the hood. Here is how this website is built:
- Next.js for the frontend
- Vercel for the deployment
- TypeScript for the typing
- Tailwind CSS for the styling

If you have any questions or just want to say hi, send me a message! 💌

Lots of love,
Tomas






`,
        'color: #EB5D31'
      )
    }, 1000)
  }, [])

  return null
}

export default StartupConsoleLog

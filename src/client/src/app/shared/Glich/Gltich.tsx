import { useEffect } from 'react'
import { getGlitchHTML } from './glitchHelpers'

export function Glitch() {
    const strips = getGlitchHTML(16).map((strip, i) => <div key={i}>{strip}</div>)

    useEffect(() => {
        import('./Glitch.css').catch(console.error)
    }, [])


    return (
        <div className='glitch-wrap'>
            {strips}
        </div>
    )
}
import './Glitch.css'
import { getGlitchHTML } from './glitchHelpers'

export function Glitch() {
    const strips = getGlitchHTML(16).map((strip, i) => <div key={i}>{strip}</div>)

    return (
        <div className='glitch-wrap'>
            {strips}
        </div>
    )
}
export type Mode = 'cafe' | 'plain'

export const isPlain = () => document.documentElement.dataset.mode === 'plain'

// Recruiter Mode lives on <html data-mode> and in ?mode=plain so the link is shareable
export function setMode(mode: Mode) {
  const root = document.documentElement
  const url = new URL(window.location.href)
  if (mode === 'plain') {
    root.dataset.mode = 'plain'
    url.searchParams.set('mode', 'plain')
  } else {
    delete root.dataset.mode
    url.searchParams.delete('mode')
  }
  url.hash = ''
  window.history.replaceState(null, '', url)
}

// runs before paint so there is no flash of the wrong theme or mode
export const bootScript = `try{var d=document.documentElement,t=localStorage.getItem('theme');if(t==='dark'||t==='light')d.dataset.theme=t;if(new URLSearchParams(location.search).get('mode')==='plain')d.dataset.mode='plain'}catch(e){}`

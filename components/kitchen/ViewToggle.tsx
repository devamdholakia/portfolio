import { Segmented } from './Segmented'
import type { View } from './terms'

// swaps every label between the cafe story and the real systems terms
export function ViewToggle({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return (
    <Segmented
      label="Labels"
      value={view}
      onChange={onChange}
      options={[
        { value: 'cafe', label: 'Café View' },
        { value: 'engineer', label: 'Engineer View' },
      ]}
    />
  )
}

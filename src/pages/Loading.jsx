export default function Loading({ label = 'Loading…' }) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'var(--sans, system-ui)',
        color: '#5a5a66',
      }}
    >
      {label}
    </div>
  )
}

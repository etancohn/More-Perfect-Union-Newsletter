import { useReveal } from '../hooks/useReveal'

// Wrapper that applies the `.reveal` scroll-in animation to any element.
// `as` picks the tag, `delay` (1–4) staggers via the .d1–.d4 classes.
export default function Reveal({ as: Tag = 'div', className = '', delay, children, ...rest }) {
  const [ref, inView] = useReveal()
  const cls = ['reveal', delay ? `d${delay}` : '', inView ? 'in' : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <Tag ref={ref} className={cls} {...rest}>
      {children}
    </Tag>
  )
}

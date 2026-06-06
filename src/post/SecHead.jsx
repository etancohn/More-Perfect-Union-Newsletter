import Reveal from '../components/Reveal'

// The numbered "NN — Title ———" header shared by every content section.
export default function SecHead({ num, title }) {
  return (
    <Reveal className="sec-head">
      <span className="sec-num">{num}</span>
      <h2 className="sec-title">{title}</h2>
      <span className="rule" />
    </Reveal>
  )
}

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react'
const TiltImage = ({ src, alt }) => {
  const reducir = useReducedMotion()

  const px = useMotionValue(0) // -0.5 a 0.5
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 180, damping: 18 })
  const sy = useSpring(py, { stiffness: 180, damping: 18 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12])
  const rotateX = useTransform(sy, [-0.5, 0.5], [12, -12])

  const mover = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }

  const reset = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <div
      className="tilt-stage"
      onPointerMove={reducir ? undefined : mover}
      onPointerLeave={reset}
    >
      <motion.div
        className="image-wrapper"
        style={reducir ? undefined : { rotateX, rotateY }}
        whileHover={reducir ? undefined : { y: -12, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <img src={src} alt={alt} />
      </motion.div>
    </div>
  )
}

export default TiltImage

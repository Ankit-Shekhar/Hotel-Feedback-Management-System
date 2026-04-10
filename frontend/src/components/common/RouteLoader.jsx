import { AnimatePresence, motion as Motion } from 'framer-motion'

function RouteLoader({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible ? (
        <Motion.div
          key="route-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="pointer-events-none fixed left-0 right-0 top-0 z-[140]"
          role="status"
          aria-live="polite"
          aria-label="Loading next page"
        >
          <div className="h-[3px] w-full bg-black/20">
            <Motion.div
              initial={{ x: '-40%' }}
              animate={{ x: '100%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.72, ease: 'easeInOut' }}
              className="h-full w-[42%] rounded-r-full bg-gradient-to-r from-gold via-goldSoft to-[#FFF2C6] shadow-[0_0_14px_rgba(212,175,55,0.75)]"
            />
          </div>

          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.72, ease: 'easeOut' }}
            className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold/55 to-transparent"
          />
        </Motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default RouteLoader

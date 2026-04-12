import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { Card, LuxuryButton } from '../../components/ui'
import Container from '../../components/layout/Container'
import { fadeInUp } from '../../utils/motion'

function HomePage() {
  const heroImage = '/background.jfif'
  const galleryImages = ['/bar1.avif', '/bar2.jpg', '/bar3.jpg']
  const galleryCaptions = ['Crafted', 'Ambient', 'Signature']

  return (
    <main className="relative overflow-hidden bg-primary text-ivory">
      <div className="absolute inset-0 z-0">
        <video
          className="h-full w-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={heroImage}
        >
          <source src="/backVideo.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(11,11,11,0.62)_0%,rgba(11,11,11,0.76)_100%),radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_24%)]" />

      <Container className="relative z-20 py-10 sm:py-14 lg:py-16">
        <Motion.section
          {...fadeInUp}
          className="relative overflow-hidden rounded-[3rem] border border-gold/20 bg-secondary/80 shadow-[0_25px_70px_rgba(0,0,0,0.35)]"
        >
          <img
            src={heroImage}
            alt="Rendezvous ambience"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.96]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,11,11,0.78)_0%,rgba(11,11,11,0.42)_45%,rgba(11,11,11,0.78)_100%),linear-gradient(180deg,rgba(11,11,11,0.22)_0%,rgba(11,11,11,0.75)_100%)]" />

          <div className="relative z-10 grid min-h-[78vh] gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:px-12 lg:py-16 lg:items-end">
            <div className="space-y-7">
              <div className="inline-flex rounded-full border border-gold/30 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-goldSoft">
                Rendezvous Feedback Lounge
              </div>

              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.32em] text-ivory/65">Crafted Evenings, Curated Voices</p>
                <h1 className="max-w-2xl text-4xl font-semibold leading-[1.03] text-ivory sm:text-5xl lg:text-6xl">
                  Share your Rendezvous experience.
                  <span className="mt-2 block text-goldSoft">Your moments shape our next pour.</span>
                </h1>
                <p className="max-w-2xl text-base leading-8 text-ivory/72 sm:text-lg">
                  Rate your ambience, food, service, and overall vibe in one refined flow built for Rendezvous guests.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <LuxuryButton as={Link} to="/feedback" className="sm:min-w-44">
                  Leave Feedback
                </LuxuryButton>
              </div>
            </div>
          </div>
        </Motion.section>

        <Motion.section {...fadeInUp} className="mt-8">
          <Card className="group relative overflow-hidden flex flex-col gap-4 border border-gold/45 bg-secondary/90 p-6 shadow-[0_12px_34px_rgba(201,165,90,0.16)] transition duration-300 hover:-translate-y-0.5 hover:border-gold/65 hover:shadow-[0_18px_44px_rgba(201,165,90,0.24)] md:flex-row md:items-center md:justify-between">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.14),transparent_32%)] opacity-80 transition duration-300 group-hover:opacity-100" />
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.32em] text-goldSoft">Admin Access</p>
              <h2 className="text-2xl font-semibold text-ivory">Review insights, response quality, and trends.</h2>
              <p className="max-w-2xl text-sm leading-7 text-ivory/70">
                Login as admin to monitor live feedback trends, inspect guest sentiment, and steer the Rendezvous experience with clarity.
              </p>
            </div>
            <LuxuryButton as={Link} to="/admin-login" className="relative animate-[pulse_1.8s_ease-in-out_infinite] whitespace-nowrap">
              Login as Admin
            </LuxuryButton>
          </Card>
        </Motion.section>

        <Motion.section {...fadeInUp} className="mt-24 space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-goldSoft">Visual Gallery</p>
              <h2 className="mt-3 text-3xl font-semibold text-ivory sm:text-4xl">Three frames of the Rendezvous atmosphere.</h2>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {galleryImages.map((imagePath, index) => (
              <Card key={imagePath} className={`overflow-hidden border border-gold/15 bg-secondary/85 p-4 ${index === 1 ? 'lg:translate-y-8' : ''}`}>
                <div className="relative overflow-hidden rounded-[1.4rem]">
                  <img
                    src={imagePath}
                    alt={`Rendezvous detail ${index + 1}`}
                    className="h-[340px] w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/52 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full border border-gold/28 bg-primary/70 px-4 py-2 backdrop-blur-sm">
                    <p className="text-[0.68rem] uppercase tracking-[0.34em] text-goldSoft">{galleryCaptions[index]}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Motion.section>
      </Container>
    </main>
  )
}

export default HomePage

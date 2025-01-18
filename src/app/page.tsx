import Hero from '../components/Hero'
import Head from 'next/head'
export default function Home() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>PruebaTecnica - Lorem ipsum dolor sit amet consectetur adipisicing</title>
        <meta name="description" content="Tecnología de detección de cáncer con IA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
    </div>
  )
}
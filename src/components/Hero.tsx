export default function Hero() {
  return (
    <div className="hero min-h-screen relative text-white">
      <div className="hero-overlay bg-opacity-80"></div>
      <div 
        className="absolute inset-0 z-0"
        style={{	
          backgroundImage: 'url("https://i.imgur.com/vJY7jOA.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)'
        }}
      ></div>
      <div className="hero-content text-center text-white z-10">
        <div className="max-w-3xl">
          <h1 className="mb-5 text-5xl font-bold text-white">
            Detección temprana de cáncer con IA
          </h1>
          <p className="mb-8 text-lg text-white">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti eligendi nemo numquam accusantium exercitationem magni, voluptas, sed, quae fugiat sequi quo quisquam impedit veritatis minima repudiandae odio. Praesentium, cum voluptates?
          </p>
          <a href="https://www.sitiodelaprueba.com/" target="_blank" rel="noopener noreferrer">
            <button className="btn btn-primary">Conoce</button>
          </a>
        </div>
      </div>
    </div>
  )
}
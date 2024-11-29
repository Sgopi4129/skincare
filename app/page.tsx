'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Home() {

  const router=useRouter()
  
  function HandleRedirect(){
    return router.push('/auth')
  }
  return (
    <div>
      <main>
        <div className="bg-black text-center p-16 text-balance ">
          <h1 className="text-white text-4xl ">Detect and Treat Skin Disease with Ease</h1>
          <h3 className="text-white p-5">Upload an image of your skin condition and get instant diagonsis and treatment options</h3>
          <button 
          onClick={HandleRedirect} 
          className="px-6 py-3 bg-white text-black font-medium text-lg rounded-lg shadow hover:bg-light-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
          Get Started
          </button>
        </div>
      </main>
      <section className="flex">
        <div className="flex-1 bg-white shadow-lg text-black rounded-lg p-40 text-2xl">
          <Image 
          alt="camera"
          src="/camera.svg"
          width={100}
          height={100}/>
          <h1 className="text-lg font-bold">Easy Image Upload</h1>
          <p className="text-gray-600">Upload images of your skin condition easily and securely</p>
        </div>
        <div className="flex-1 bg-white shadow-lg text-black rounded-lg p-40 ">
          <Image
          alt="stethoscope"
          src="/stethoscope.svg"
          height={100}
          width={100}/>
          <h1 className="text-lg font-bold">Instant Diagonsis</h1>
          <p>Get instant diagonsis with advanced AI technology</p>
        </div>
        <div className="flex-1 bg-white shadow-lg text-black rounded-lg p-40">
          <Image
          alt="pills"
          src="/pills.svg"
          height={100}
          width={100}/>
          <h1 className="text-lg font-bold">Treatment Options</h1>
          <p className="text-gray-600">Recieve presonalized treatment options based on your diagonsis</p>
        </div>
      </section> 
    </div>
  );
}


import { Link } from "react-router-dom";

export default function DashHome() {
  return (
    <div className='min-h-screen flex flex-col items-center'>
      <img
        src='https://incture.com/wp-content/uploads/2022/02/Incture-Logo-Blue-150x34-px.svg'
        className='mr-3 h-24 p-1 mt-10'
        alt='Incture Logo'
      />
      <div className='flex flex-col items-center justify-center w-full mt-5 bg-[#CFEBF3] min-h-[40vh]'>
        <h1 className='text-4xl text-gray-800 font-medium text-center'>
          Enhancing people&apos;s lives
        </h1>
        <h1 className='text-4xl text-gray-800 font-medium text-center'>
          with digital systems
        </h1>
        <h3 className='text-xl  text-gray-800 text-center mt-5'>
          Incture is on a mission to build digital systems to drive business
          outcomes
        </h3>
      </div>
      <div className='flex mt-10 mx-auto p-5'>
        <div className='flex-1 ml-10'>
          <h1 className='text-xl font-medium text-gray-600 mt-40'>OUR STORY</h1>
          <h1 className='text-3xl font-medium'>We’re all about digital</h1>
          <p>
            Incture is a leading provider of digital and AI solutions and
            products to SAP customers. Founded in 2006, we deliver digital and
            AI solutions on SAP BTP and hyperscale platforms to customers across
            North America, EMEA, and APJ. Developed jointly with end users, 
            <a className="text-blue-500" href={'https://www.cherrywork.com/'}> Cherrywork®</a> is one of the largest suites of packaged applications
            and products powered by AI and digital technologies, delivering
            hyper-automation for future-ready enterprises.
          </p>
        </div>
        <div className='flex-1'>
          <img
            src='https://incture.com/wp-content/uploads/2022/02/About_incture-copy.webp'
            alt='cover'
            className="ml-32 h-96"
          />
        </div>
      </div>
    </div>
  )
}

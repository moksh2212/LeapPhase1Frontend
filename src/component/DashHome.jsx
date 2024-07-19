import { Link } from "react-router-dom";

export default function DashHome() {
  return (
    <div className='min-h-screen flex flex-col items-center bg-gray-100'>
      {/* Hero Section */}
      <section className='w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-5xl font-bold mb-4'>
            Welcome to Campus Program Management
          </h1>
          <p className='text-2xl mb-8'>
            Your all-in-one solution for campus recruitment, talent management, and training
          </p>
        </div>
      </section>

      {/* Process Overview */}
      <section className='container mx-auto px-4 py-16'>
        <h2 className='text-3xl font-bold text-center mb-12'>Our Comprehensive Process</h2>
        <div className='flex flex-wrap justify-center items-start gap-4'>
          {[
            "College Database", "→", "Candidate Pool", "→", "5-Stage Interviews", 
            "→", "Talent Selection", "→", "Training & Development"
          ].map((step, index) => (
            <div key={index} className={`text-center ${step === "→" ? "flex items-center" : "bg-white p-4 rounded-lg shadow-md"}`}>
              <p className={step === "→" ? "text-2xl text-gray-400" : "font-semibold"}>{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className='container mx-auto px-4 py-16'>
        <h2 className='text-3xl font-bold text-center mb-12'>Key Features</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[
            { title: 'College Management', description: 'Maintain a comprehensive database of partner colleges' },
            { title: 'Candidate Tracking', description: 'Centralized database for candidates from all colleges' },
            { title: 'Interview Scheduling', description: 'Create interviewers and schedule multi-stage interviews' },
            { title: 'Talent Database', description: 'Track selected candidates as they become talents' },
            { title: 'Attendance & Leave', description: 'Record and manage attendance and leave for talents' },
            { title: 'Training Management', description: 'Schedule trainings, assign trainers, and create assignments' },
            { title: 'Performance Evaluation', description: 'Monitor and assess talent performance comprehensively' },
            { title: 'User Portal', description: 'Allow talents to view attendance, submit assignments, and see feedback' },
            { title: 'Reporting & Analytics', description: 'Generate insights from the entire recruitment and training process' },
          ].map((feature, index) => (
            <div key={index} className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
              <p className='text-gray-600'>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* User Roles */}
      <section className='bg-gray-800 text-white py-16 w-full'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12'>Tailored for Every Role</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-gray-700 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold mb-4'>Administrators</h3>
              <ul className='list-disc list-inside'>
                <li>Manage college and candidate databases</li>
                <li>Oversee interview process</li>
                <li>Monitor overall system performance</li>
              </ul>
            </div>
            <div className='bg-gray-700 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold mb-4'>HR Managers</h3>
              <ul className='list-disc list-inside'>
                <li>Schedule interviews and trainings</li>
                <li>Manage talent database</li>
                <li>Handle attendance and leave requests</li>
              </ul>
            </div>
            <div className='bg-gray-700 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold mb-4'>Talents</h3>
              <ul className='list-disc list-inside'>
                <li>View attendance and feedback</li>
                <li>Submit assignments</li>
                <li>Track personal performance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className='container mx-auto px-4 py-16 text-center'>
        <h2 className='text-3xl font-bold mb-4'>Quick Access</h2>
        <p className='text-xl text-gray-600 mb-8'>
          Jump to your most frequently used sections
        </p>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <Link to="/dashboard?tab=college-and-contact" className='bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300'>
            Colleges
          </Link>
          <Link to="/dashboard?tab=candidates" className='bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300'>
            Candidates
          </Link>
          <Link to="/dashboard?tab=campus-calendar" className='bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300'>
            Interviews
          </Link>
          <Link to="/dashboard?tab=talent" className='bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300'>
            Talents
          </Link>
        </div>
      </section>

      {/* Help and Support */}
      <section className='bg-gray-200 w-full py-8'>
        <div className='container mx-auto px-4 text-center'>
          <h3 className='text-xl font-semibold mb-4'>Need Help?</h3>
          <p className='mb-4'>Check out our user guide</p>
          <div className='space-x-4'>
            <Link to="#" className='bg-gray-800 text-white font-medium py-2 px-6 rounded-full hover:bg-gray-700 transition duration-300'>
              User Guide
            </Link>
            
          </div>
        </div>
      </section>
    </div>
  );
}
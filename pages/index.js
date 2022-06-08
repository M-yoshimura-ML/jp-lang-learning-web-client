import "../helpers/firebase";
import Layout from "../components/Layout";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Link from "next/link";


export default function Home() {

  let {user, logoutUser} = useContext(AuthContext);

  return (
    <Layout title='TOP'>
      <div className='mt-4 mb-10 text-xl font-bold'>Welcome to JP Lang Learning</div>
      {user && <p className='mb-10'>hello {user.username}</p>}
      <div className='mb-12'>
        <div className='mb-5 mr-4 ml-4 px-1 py-2'>
          <p>This web site is Japanese language learning platform.<br/>
            This site will help you study Japanese and pass JLPT N5 level.
          </p>
        </div>
        <div className='mb-2 mr-4 ml-4 px-1 py-2'>
          <p className='px-1 py-2 w-full'>What you can do in this web site?</p>
          <ol className='list-none pl-2'>
            <li>1.You can start learning Japanese language from menu.</li>
            <li>2.You can check pronunciations for word and phrase.</li>
            <li>3.You can check how to read Kanji and its meanings.</li>
            <li>4.You can learn basic grammar.</li>
            <li>5.You can try answering questions at each section.</li>
          </ol>
        </div>
      </div>
      <Link href='/lesson-list'>
        <div className='flex cursor-pointer mt-2'>
            <a className='bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-6 rounded'>
                Visit Lesson List
            </a>
        </div>
      </Link>
      
      {user ? (
          <div className='flex cursor-pointer mt-12'>
            <svg 
                  className="mr-1 w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={logoutUser}
              >
                  <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
              </svg>
              <span>Logout</span>
            </div>
        ): (<></>)
      }
    </Layout>
  );
  
}

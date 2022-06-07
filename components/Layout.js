import Head from 'next/head';
import Navigation from './navigation';


export default function Layout({children, title = ''}) {
    return (
        <div className='flex justify-center items-center flex-col 
            min-h-screen text-white font-mono bg-gray-800'
        >
            <Head>
                <title>{title}</title>
            </Head>
            <Navigation />
            
            <main className='flex flex-1 justify-center items-center w-screen flex-col'>
                {children}
            </main>
            <footer className='mt-10 mb-4 w-full h-6 flex justify-center items-center text-gray-500 text-sm'>               
                <a href='https://github.com/M-yoshimura-ML' className='border-b'>@M-yoshimura-ML 2022</a>
            </footer>
        </div>
    )
}
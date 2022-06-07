import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { getAllLessonIds, getLessonData } from '../../lib/lessons';
import ReactAudioPlayer from "react-audio-player";


export default function LessonContent({ lesson }) {
    const router = useRouter();

    const lbToBr = (txt='') => {
        return (
            txt.split(/(\n)/g).map((t,i) => 
                <span key={i}>
                    { (t === '\n') ? <br/> : t }
                </span>
            )
        )
    }

    if(router.isFallback || !lesson) {
        return (
            <div>loading...</div>
        );
    }

    return (
        <Layout title={lesson.id}>
            <p className='m-4'>
                {"level : "}
                {lesson.level}
            </p>
            <div className="mb-5 mr-4 ml-4 px-1 py-2">
                <p className='m-2 px-1 py-2 w-full text-xl font-bold'>{lesson.title}</p>
            </div>
            <div className="mb-5 mr-4 ml-4 px-1 py-2">
                {lbToBr(lesson.description)}
            </div>   
            <div className='mb-12'>
                {lesson.contents.map((item, i) => {
                    return (
                        <div key={i} className="mb-5">
                            <div className="flex justify-center items-center mb-5 mr-4 ml-4 px-1 py-2  max-w-screen-lg">
                                {item.type ==="HEADER" && (
                                    <p className="m-2 px-1 py-2 w-full text-white">{item.content}</p>
                                )}
                                {item.type ==="BODY" && (
                                    <p className="m-2 px-1 py-2 w-full text-white">
                                       {lbToBr(item.content)}
                                    </p>
                                )}
                                {item.type ==="IMAGE" && (
                                    <img className="flex w-4/5 h-auto" src={item.content} />
                                )}
                                {item.type ==="AUDIO" && (
                                    <ReactAudioPlayer src={item.content} controls />
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
            <Link href='/lesson-list'>
                <div className='flex cursor-pointer mt-12'>
                    <svg 
                        className="w-6 h-6 mr-3" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M11 19l-7-7 7-7m8 14l-7-7 7-7" 
                        />
                    </svg>
                    <span>Back to Lesson List page</span>
                </div>
            </Link>
        </Layout>
    )
}

export async function getStaticPaths () {
    const paths = await getAllLessonIds();

    return {
        paths,
        fallback: true,
    };
}

export async function getStaticProps ({ params }) {
    const {lesson: lesson} = await getLessonData(params.id);
    return {
        props: {
            lesson,
        },
        notFound: !lesson,
        revalidate: 3,
    };
}



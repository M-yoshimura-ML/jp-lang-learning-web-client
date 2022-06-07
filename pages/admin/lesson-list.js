import Layout from "../../components/Layout";
import { getAllLessonsData } from "../../lib/lessons";
import AdminLesson from '../../components/AdminLesson';
import { useRouter } from "next/router";
import { useEffect } from "react";
import jwtDecode from "jwt-decode"


export default function AdminLessonList({ filteredLessons }) {
    const router = useRouter();

    useEffect(()=> {
      const authToken = localStorage.getItem('authToken')
      if(authToken == null){
        router.push('/');
      } else {
        const admin = jwtDecode(authToken)['isSuperuser'];
        if(!admin) {
          router.push('/');
        }
      }
    },[])

    return (
        <Layout title="Lesson List">
          <div className="mb-5 mr-4 ml-4 px-1 py-2">
                <p className='m-2 px-1 py-2 w-full text-xl font-bold'>Admin Lesson List</p>
          </div>
          <ul>
            {filteredLessons && filteredLessons.map((lesson) => <AdminLesson key={lesson.id} lesson={lesson} />) }
          </ul>
        </Layout>
      );
}

export async function getStaticProps() {
    const filteredLessons = await getAllLessonsData();
    return {
        props: { filteredLessons },
        revalidate: 3,
    };
}
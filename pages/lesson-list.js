import Layout from "../components/Layout";
import Link from "next/link";
import { getAllLessonsData } from "../lib/lessons";
import Lesson from '../components/Lesson';


export default function LessonList({ filteredLessons }) {
    return (
        <Layout title="Lesson List">
          {/* <p className="m-4 text-xl font-bold">Lesson List</p> */}
          <div className="mb-5 mr-4 ml-4 px-1 py-2">
                <p className='m-2 px-1 py-2 w-full text-xl font-bold'>Lesson List</p>
          </div>
          <ul>
            {filteredLessons && filteredLessons.map((lesson) => <Lesson key={lesson.id} lesson={lesson} />) }
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
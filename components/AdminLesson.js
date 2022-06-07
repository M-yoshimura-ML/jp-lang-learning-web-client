import Link from 'next/link';


export default function AdminLesson({ lesson }) {
    return (
        <div className='mb-2'>
            <span>{lesson.id}</span>
            {" : "}
            <Link href={`/admin/lesson/${lesson.id}`}>
                <span className="cursor-pointer text-white border-b border-gray-500 hover:bg-gray-500">
                    {lesson.title}
                </span>
            </Link>
        </div>
    );
}
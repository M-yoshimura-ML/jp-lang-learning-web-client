import Link from 'next/link';
import { useState, useContext, useEffect } from "react";
import { useRouter } from 'next/router';
import { LessonContext } from "../../../context/LessonContext";
import Layout from '../../../components/Layout';
import { getAllLessonIds, getLessonData } from '../../../lib/lessons';
import ReactAudioPlayer from "react-audio-player";
import { uploadFile } from "../../api/lesson";
import jwtDecode from "jwt-decode"


export default function UpdateLessonContent({ lesson }) {
    // const { selectedLesson, setSelectedLesson } = useContext(LessonContext);
    const router = useRouter();
    

    const [lessonContent, setLessonContent] = useState({
        title: '',
        description: '',
        level: 1
        // contents:lesson.contents
    });
    // console.log(lesson);
    const [inputList, setInputList] = useState([
        // ...lesson.contents
    ]);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken')
        if(authToken == null){
          router.push('/');
        } else {
          const admin = jwtDecode(authToken)['isSuperuser'];
          if(!admin) {
            router.push('/');
          }
        }

        setLessonContent({title:lesson.title, description:lesson.description, level:lesson.level})
        setInputList(lesson.contents)
    },[])


    const handleLessonChange = (e) => {
        console.log("e.target.value",e.target.value)
        const { name, value } = e.target;
        const List = lessonContent;
        List[name] = value;
        console.log(List);
        setLessonContent(List);
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
    
        const list2 = [...inputList];
        list2[index][name] = value;
        console.log("name:", name, "value", value);
        console.log("list", list2);

        setInputList(list2);
    };

    const uploadFileToStorage = async (event) => {
        if (event.target.files[0]) {
          const file = event.target.files[0];
          const type = event.currentTarget.getAttribute("content-type");
          console.log(type);
          
          let uploadedFileUrl = "";
          try {
            uploadedFileUrl = await uploadFile(type, file);
          } catch (error) {
            console.log(error);
          }
    
          console.log(uploadedFileUrl);
    
          const list = [...inputList];
 
          list.push({
            type: type,
            content: uploadedFileUrl,
            order_num: inputList.length + 1,
          });
          setInputList(list);
        }
    };

    const handleAddInput = (event) => {
        // setInputList([...inputList, { firstName: "", lastName: "" }]);
        const type = event.currentTarget.getAttribute("content-type");
        console.log(type);
        const list = [...inputList];
        list.push({ type: type, content: "", order_num: inputList.length + 1 });
    
        setInputList(list);
    };

    const handleRemoveInput = (index) => {
        const list = [...inputList];
        list.splice(index, 1);
    
        for (let index = 0; index < list.length; index++) {
          list[index].order_num = index + 1;
        }
        // console.log(list)
        setInputList(list);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
    
        const lessonContentOj2 = { ...lessonContent, contents: inputList };
        console.log(lessonContentOj2);
        console.log(JSON.stringify(lessonContentOj2, null, 2));
    
        const authToken = localStorage.getItem('authToken')
        const data = JSON.parse(authToken);
        console.log(data.access);
        
        await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/lesson/${lesson.id}/`, {
            method: 'PUT',
            body: JSON.stringify(lessonContentOj2, null, 2),
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${data.access}`
            },
        }).then((res) => {
            if (res.status === 401) {
              alert("JWT Token is not valid");
            } else {
                alert("success to update");
            }
        });
    };

    if(router.isFallback || !lesson) {
        return (
            <div>loading...</div>
        );
    }

    return (
        <Layout title={lesson.id}>
          <div className="create lesson"> 
            <p className='mb-4'>this is admin update lesson page</p>
            <p className='m-4'>
                {"ID : "}
                {lesson.id}
            </p>
            <form onSubmit={handleSubmit}>
                <div className="mb-5 mr-4 ml-4 px-1 py-2">
                    <label>title</label>
                    <input
                        name="title"
                        type="text"
                        defaultValue={lesson.title}
                        onChange={(e) => handleLessonChange(e) }
                        className="m-2 px-1 py-2 w-full text-black"
                    />
                </div>
                <div className="mb-5 mr-4 ml-4 px-1 py-2">
                    <label>description</label>
                    <textarea
                        name="description"
                        defaultValue={lesson.description}
                        onChange={(e) => handleLessonChange(e)}
                        className="m-2 px-1 py-2 w-full text-black"
                    />
                </div>
                {/* <p className='px-10'>level {lesson.level}</p> */}
                <div className="mb-5 mr-4 ml-4 px-1 py-2">
                    <label>level</label>
                    <input
                        name="level"
                        type="number"
                        defaultValue={lesson.level}
                        onChange={(e) => handleLessonChange(e)}
                        className="m-2 px-1 py-2 text-black"
                    />
                </div>
            
                {inputList.map((item, i) => {
                    return (
                        <div key={i} className="mb-5">
                            <div className="flex justify-center items-center mb-5 mr-4 ml-4 px-1 py-2  max-w-screen-lg">
                                {item.type ==="HEADER" && (
                                    <input
                                        className="m-2 px-1 py-2 w-full text-black"
                                        type="text"
                                        name="content"
                                        placeholder="content"
                                        value={item.content}
                                        onChange={(e) => handleChange(e, i)}
                                    />
                                )}
                                {item.type ==="BODY" && (
                                    <textarea
                                        className="m-2 px-1 py-2 w-full text-black"
                                        type="text"
                                        name="content"
                                        placeholder="content"
                                        value={item.content}
                                        onChange={(e) => handleChange(e, i)}
                                    />
                                )}
                                {item.type ==="IMAGE" && (
                                    <img className="flex w-4/5 h-auto" src={item.content} />
                                )}
                                {item.type ==="AUDIO" && (
                                    <ReactAudioPlayer src={item.content} controls />
                                )}
                                {inputList.length !== 1 && (
                                    <svg
                                        onClick={() => handleRemoveInput(i)}
                                        className="w-6 h-6 mr-4 cursor-pointer hover:bg-red-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M20 12H4"
                                        />
                                    </svg>
                                )}
                            </div>
                            {inputList.length - 1 === i && (
                                <div className="flex justify-center container mx-auto mb-6">
                                    <svg
                                        onClick={handleAddInput}
                                        content-type="HEADER"
                                        className="w-10 h-10 mt-2 cursor-pointer hover:bg-blue-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    {/* textarea add button */}
                                    <svg
                                        onClick={handleAddInput}
                                        content-type="BODY"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-10 w-10 mt-2 hover:cursor-pointer hover:bg-blue-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                    {/* image add button */}
                                    <label htmlFor="file-input" className="px-4 py-2 rounded">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-10 w-10 hover:cursor-pointer hover:bg-blue-300"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </label>
                                    <input id="file-input" className="hidden" type="file" accept="image/*" name="myImage"
                                        onChange={uploadFileToStorage}
                                        content-type="IMAGE"
                                    />
                                    {/* Audio add button */}
                                    <label htmlFor="audio-input" className="px-4 py-2 rounded">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-10 w-10 hover:cursor-pointer hover:bg-blue-300"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                                            />
                                        </svg>
                                    </label>
                                    <input id="audio-input" className="hidden" type="file" accept="audio/*" name="myAudio"
                                        onChange={uploadFileToStorage}
                                        content-type="AUDIO"
                                    />
                                </div>
                            )}
                        </div>
                    )
                })}
                <button
                    type="submit"
                    className="group relative w-3/12 flex justify-center container mx-auto py-2 px-4
                        bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                    update
                </button>
            </form>
          </div>
          <Link href='/admin/lesson-list'>
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
        revalidate: 3,
    };
}

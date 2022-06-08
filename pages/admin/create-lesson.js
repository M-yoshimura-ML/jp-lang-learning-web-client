import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import ReactAudioPlayer from "react-audio-player";
import { uploadFile } from "../api/lesson";
import Image from "next/image";
import jwtDecode from "jwt-decode";

export default function CreateLesson() {
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    // console.log('authToken',authToken);
    if (authToken == null) {
      router.push("/");
    } else {
      const admin = jwtDecode(authToken)["isSuperuser"];
      if (!admin) {
        router.push("/");
      }
    }
  }, []);

  const [lessonList, setLessonList] = useState({
    title: "",
    description: "",
    level: 1,
  });

  const [inputList, setInputList] = useState([
    {
      type: "HEADER",
      content: "",
      order_num: 1,
    },
  ]);

  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    const List = lessonList;
    List[name] = value;
    setLessonList(List);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    const list2 = [...inputList];
    list2[index][name] = value;

    // setInputList({...inputList,[name]:value})
    setInputList(list2);
  };

  const uploadFileToStorage = async (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const type = event.currentTarget.getAttribute("content-type");

      let uploadedFileUrl = "";
      try {
        uploadedFileUrl = await uploadFile(type, file);
      } catch (error) {
        console.log(error);
      }
      // console.log(uploadedFileUrl);

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
    const type = event.currentTarget.getAttribute("content-type");

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
    setInputList(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const lessonContentOj2 = { ...lessonList, contents: inputList };

    console.log(JSON.stringify(lessonContentOj2, null, 2));

    const authToken = localStorage.getItem("authToken");
    const data = JSON.parse(authToken);
    console.log(data.access);

    await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/lesson/`, {
      method: "POST",
      body: JSON.stringify(lessonContentOj2, null, 2),
      headers: {
        "Content-type": "application/json",
        // Authorization: `JWT ${cookie.get('jwt')}`,
        Authorization: `Bearer ${data.access}`,
      },
    }).then((res) => {
      if (res.status === 401) {
        alert("JWT Token is not valid.");
      } else if (res.status === 400) {
        alert("filled texts have something wrong.");
      } else {
        alert("success to register");
        router.push("/admin/lesson-list");
      }
    });
  };

  return (
    <Layout title="Admin Create Lesson">
      <div className="Admin Create Lesson">
        <div className="mb-5 mr-4 ml-4 px-1 py-2 w-full text-xl font-bold">
          Admin Create Lesson
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-5 mr-4 ml-4 px-1 py-2">
            <label>title</label>
            <input
              name="title"
              type="text"
              onChange={(e) => handleLessonChange(e)}
              className="m-2 px-1 py-2 w-full text-black"
            />
          </div>
          <div className="mb-5 mr-4 ml-4 px-1 py-2">
            <label>description</label>
            <textarea
              name="description"
              onChange={(e) => handleLessonChange(e)}
              className="m-2 px-1 py-2 w-full text-black"
            />
          </div>
          <div className="mb-5 mr-4 ml-4 px-1 py-2">
            <label>level</label>
            <input
              name="level"
              type="number"
              onChange={(e) => handleLessonChange(e)}
              className="m-2 px-1 py-2 text-black"
            />
          </div>

          {inputList.map((item, i) => {
            return (
              <div key={i} className="mb-5">
                <div className="flex justify-center items-center mb-5 mr-4 ml-4 px-1 py-2  max-w-screen-lg">
                  {item.type == "HEADER" && (
                    <input
                      className="m-2 px-1 py-2 w-full text-black"
                      type="text"
                      name="content"
                      placeholder="content"
                      value={item.content}
                      onChange={(e) => handleChange(e, i)}
                    />
                  )}

                  {item.type == "BODY" && (
                    <textarea
                      className="m-2 px-1 py-2 w-full text-black"
                      type="text"
                      name="content"
                      placeholder="content"
                      value={item.content}
                      onChange={(e) => handleChange(e, i)}
                    />
                  )}

                  {item.type == "IMAGE" && (
                    <img className="flex w-4/5 h-auto" src={item.content} />
                  )}

                  {item.type == "AUDIO" && (
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
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 mt-2 mr-4 cursor-pointer hover:bg-blue-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    {/* textarea add button */}
                    <svg
                      onClick={handleAddInput}
                      content-type="BODY"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 mt-2 mr-2 hover:cursor-pointer hover:bg-blue-300"
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
                    <input
                      id="file-input"
                      className="hidden"
                      type="file"
                      accept="image/*"
                      name="myImage"
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
                    <input
                      id="audio-input"
                      className="hidden"
                      type="file"
                      accept="audio/*"
                      name="myAudio"
                      onChange={uploadFileToStorage}
                      content-type="AUDIO"
                    />
                  </div>
                )}
              </div>
            );
          })}
          <button
            type="submit"
            className="group relative w-3/12 flex justify-center container mx-auto py-2 px-4
                 bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            register
          </button>
        </form>
      </div>
    </Layout>
  );
}

import { createContext, useState } from "react";


export const LessonContext = createContext();

export const LessonProvider = ({props}) => {
    let [selectedLesson, setSelectedLesson] = useState({id:1,title:'',description:'',level:1,contents:[]});

    
    return (
        <LessonContext.Provider
            value={{
                selectedLesson,
                setSelectedLesson
            }}
        >
            {props.children}
        </LessonContext.Provider>
    )
}
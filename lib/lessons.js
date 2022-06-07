export async function getAllLessonsData(){
    const res = await fetch (
        new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/lesson-list/`)
    );
    const lessons = await res.json();
    const filteredLessons = lessons.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    return filteredLessons;
}



export async function getAllLessonIds() {
    const res = await fetch (
        new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/lesson-list/`)
    );
    const lessons = await res.json();
    return lessons.map((lesson) => {
        return { 
            params: {
                id: String(lesson.id)
            },
        }
    });
}


export async function getLessonData(id) {
    try {
        const data = await fetch(
            new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/lesson-detail/${id}`)
        )
        .then((res) => {
            if(res.status === 200){
                return res.json();
            } else {
                throw new Error(`${res.status}`)
            };
        })
        // const lesson = data.json();
        const lesson = data;
        return {
            lesson,
        };
    } catch (err){
        console.log('err', err);
        // if(err instanceof Error) {
        //     return {props:{status:err.message}}
        // }
        // throw err;
        return {err, message:"data not found"}
    }

}
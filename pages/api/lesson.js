import { storage } from "../../helpers/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export const uploadFile = async(type='', file=null) => {  
    let uploadResult = '';
    console.log('type', type);

    if(file.name){
        const storageRef = ref(storage);
        const ext = file.name.split('.').pop();
        const hashName = Math.random().toString(36).slice(-8);
        let fullPath = '';
        if(type=='IMAGE') {
            fullPath = '/images/' + hashName + '.' + ext;
        }
        if(type=='AUDIO') {
            fullPath = '/audios/' + hashName + '.' + ext;
        }
        
        const uploadRef = ref(storageRef, fullPath);

        // 'file' comes from the Blob or File API
        await uploadBytes(uploadRef, file).then(async function(result) {
            console.log(result);
            console.log('Uploaded a blob or file!');

            await getDownloadURL(uploadRef).then(function(url){
                uploadResult = url;
            });
        });
    }
    return uploadResult;
}


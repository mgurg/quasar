// https://daily.dev/blog/a-guide-to-writing-clean-api-calls-using-axios
// https://blog.openreplay.com/making-api-calls-in-vue-with-axios/


import { authApi } from "boot/axios";


export function getGuide(){
    return authApi.get('/guides/');
}

export function addGuide(data){
    return authApi.post('/guides/1', data);
}

export function editGuide(uuid, data){
    return authApi.post('/guides/'+uuid, JSON.stringify(data));
}
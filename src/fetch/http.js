/**
 * http 请求配置
 */
import axios from 'axios'
import qs from 'qs'
import {Loading,Message} from 'element-ui'
import { resolve } from 'dns';

axios.defaults.baseURL='';
axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded'

//超时时间
//axios.defaults.timeout=2000

//http请求拦截器
var loadinginstace;
axios.interceptors.request.use(config => {
    //每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求手动添加
    //即使本地存在token 也有可能是过期的 所以在响应拦截器中要对返回的状态进行判断
    const token = localStorage.getItem('token');
    token && (config.headers.Authorization = taoken);

    loadinginstace = Loading.service({ fullscreen : true });
    return config
},error => {
    loadinginstace.close();
    Message.error({
        message : '加载超时！'
    })
    return Promise.reject(error);
})

//http响应拦截器
axios.interceptors.response.use(data => {//响应成功关闭loading
    loadinginstace.close();
    return data;
},error => {
    loadinginstace.close();
    Message.error({
        message : '加载失败！'
    })
    return Promise.reject(error);
})

//封装get请求
export function get(url,data){
    return new Promise((resolve,reject) => {
        axios.get(url,data).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

//封装post请求
export function post(url,data){
    return new Promise((resolve,reject) => {
        axios.post(url,data).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}


//封装http_get请求
export function httpGet(url,data){
    return new Promise((resolve,reject) => {
        this.$http.get(url,data).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
import axios from 'axios'

 export function request(config){
     // 1、创建实例
     const instance = axios.create({
         baseURL:'http://152.136.185.210:8000/api/n3',
         timeout:20000
       })

       //2.1、axios拦截器，请求拦截
       instance.interceptors.request.use(config => {
         // console.log(config)
         //这里究竟是干嘛的，1、比如config中一些信息不符合服务器要求
         //（比如头部信息什么什么的，当然也可以在58行里面修改，也是行的）
         //2、比如在发送网络请求时显示一个正在请求的图表
         return config
       },err => {
         console.log(err)
       })

       //2.2响应拦截
       instance.interceptors.response.use(res => {
         // console.log(res)
         return res.data
       },err =>{
         console.log(err)
       })


       //3、发送请求
       return instance(config)
 }

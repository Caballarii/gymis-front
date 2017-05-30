import Qs from 'qs';
import axios from 'axios';

export var FetchUtil=async (url,method='get',param={})=>{
  let config={};
  if(method=='get'){
    config={
      //请求的接口，在请求的时候，如axios.get(url,config);这里的url会覆盖掉config中的url
      url: url,

      // 请求方法同上
      method: method, // default
      // 基础url前缀
      baseURL: '/api/v1/',
    　　
    　　　　
      // transformRequest: [function (data) {
      //   // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
      //   data = Qs.stringify({});
      //   return data;
      // }],

      // transformResponse: [function (data) {
      //   // 这里提前处理返回的数据

      //   return data;
      // }],
    // 请求头信息
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },

      // //parameter参数
      // params: {
      //   //ID: 12345
      // },

      //post参数，使用axios.post(url,{},config);如果没有额外的也必须要用一个空对象，否则会报错
      data: param,

      //设置超时时间
      timeout: 20000,
      //返回数据类型
      responseType: 'json', // default
    }
  }
  else{
    config={
          // 请求方法同上
        method: method, // default
        // 基础url前缀
        baseURL: '/api/v1/',
        url: url,
        data:JSON.stringify(param),
        headers: {'Accept': 'application/json',
        'Content-Type': 'application/json'},
        requestHeader:{'Content-Type':'application/json; charset=utf-8'},
        responseType: 'json'
    }
  }
  let result=await axios.request(config)
  return result.data;
}


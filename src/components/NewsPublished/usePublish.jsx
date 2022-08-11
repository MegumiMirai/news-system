import {useEffect, useState} from "react";
import axios from "axios";

export default function usePublish(type){
  const [dataSource, setDateSource] = useState([])

  //从localStorage中获取数据
  const {username} = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    getData()
  }, [username])

  const getData = async () => {
    let res = await axios.get(`/news?author=${username}&publishState=${type}&_expand=category`)
    if(res.status === 200){
      setDateSource(res.data)
    }
  }

  return {
    dataSource,
    getData
  }
}

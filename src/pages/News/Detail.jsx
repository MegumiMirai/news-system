import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import { Descriptions, PageHeader } from 'antd';
import { HeartTwoTone } from '@ant-design/icons'
import axios from "axios";
import dayjs from "dayjs";

export default function Detail() {
  //从params中获取id
  const [newsId, setNewsId] = useState(useParams().id)
  //新闻信息
  const [newsInfo, setNewsInfo] = useState({})
  //从新闻信息对象中解构出信息
  const {title,content, category, author, createTime, region, view, star} = newsInfo || []


  useEffect(() => {
    axios.get(`/news/${newsId}?_expand=category&_expand=role`).then(
        res => {
          return res.data.view
        }
    ).then(
        res => {
          axios.patch(`/news/${newsId}`, {
            view: res + 1
          })
        }
    ).then(
        res => {
          axios.get(`/news/${newsId}?_expand=category&_expand=role`).then(
              res => {
                setNewsInfo(res.data)
              }
          )
        }
    )
  }, [])

  const getNewsInfo = async () => {
    // 根据id发送请求，获取news数据
    let res = await axios.get(`/news/${newsId}?_expand=category&_expand=role`)
    if(res.status === 200){
      setNewsInfo(res.data)
      let view = res.data.view
      console.log(view)
      return view
    }
  }

  const addView = async (view) => {
    console.log('view', view)
    let res = await axios.patch(`/news/${newsId}`, {
      view: view + 1
    })
    if(res.status === 200){
      getNewsInfo()
    }
  }

  const addStar = async () => {
    let res = await axios.patch(`/news/${newsId}`, {
      star: star + 1
    })
    if(res.status === 200){
      getNewsInfo()
    }
  }

  return (
      <div className="site-page-header-ghost-wrapper">
        <PageHeader
            onBack={() => window.history.back()}
            title={title}
            subTitle={<div>
              {category?.title}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <HeartTwoTone twoToneColor="#eb2f96" onClick={() => {addStar()}} />
            </div>}
        >
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="创建者">{author}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{dayjs(createTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
            <Descriptions.Item label="区域">{region}</Descriptions.Item>
            <Descriptions.Item label="访问数量"><span >{view}</span></Descriptions.Item>
            <Descriptions.Item label="点赞数量"><span >{star}</span></Descriptions.Item>
            <Descriptions.Item label="评论数量"><span >0</span></Descriptions.Item>
          </Descriptions>
        </PageHeader>
        {/*文本内容*/}
        <div dangerouslySetInnerHTML={{ __html:content }} style={{border: '1px solid #ccc', margin: '0 20px'}}></div>
      </div>
  )
}
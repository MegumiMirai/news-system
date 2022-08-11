import React from 'react'
import {useNavigate} from "react-router-dom";
import {Button, message, Table} from "antd";
import axios from "axios";

export default function NewsPublished(props) {

  const navigate = useNavigate()

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <Button type="link" onClick={() => { navigate(`/news-manage/preview/${item.id}`)} }>{title}</Button>
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
            <span>
              {
                item.publishState === 1 && <Button onClick={() => handlePublished(item)} type="primary">发布</Button>
              }
              {
                item.publishState === 2 && <Button onClick={() => handleSunset(item)} type="primary">下线</Button>
              }
              {
                item.publishState === 3 && <Button onClick={() => handleDelete(item)} type="primary">删除</Button>
              }
            </span>
        )
      }
    }
  ];

  const handlePublished = async (item) => {
    let res = await axios.patch(`/news/${item.id}`, { publishState: 2, publishTime: Date.now() })
    if(res.status === 200){
      message.success('发布成功')
      props.getData()
    }
  }

  const handleSunset = async (item) => {
    let res = await axios.patch(`/news/${item.id}`, { publishState: 3 })
    if(res.status === 200){
      message.success('下线成功')
      props.getData()
    }
  }

  const handleDelete = async (item) => {
    let res = await axios.delete(`/news/${item.id}`)
    if(res.status === 200){
      message.success('删除成功')
      props.getData()
    }
  }

  return (
      <Table dataSource={props.dataSource} columns={columns}
             pagination={{
               pageSize: 5
             }}
             rowKey={item => item.id}
      />
  )
}
import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Button, Table, notification} from "antd";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';


export default function Audit(){
  const navigate = useNavigate()
  //新闻列表
  const [auditList, setAuditList] = useState([])
  //从localStorage中获取数据
  const {roleId, username, region} = JSON.parse(localStorage.getItem('token'))

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <Button onClick={() => {navigate(`/news-manage/preview/${item.id}`)}} type="link">{title}</Button>
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
        return <span>{category.title}</span>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <span>
             <Button onClick={() => handleNews(item, 2, 1)} type="primary" shape="circle" icon={<CheckOutlined />} />
             <Button onClick={() => handleNews(item, 3, 0)} type="danger" shape="circle" icon={<CloseOutlined />} />
          </span>
        )
      }
    }
  ];

  useEffect(() => {
    getAuditList()
  }, [])

  //获取新闻列表
  const getAuditList = async () => {
    let res = await axios.get(`/news?auditState=1&_expand=category`)
    if(res.status === 200){
      const data = roleId === 1 ? res.data : [
          ...res.data.filter(item => item.author === username),
          ...res.data.filter(item => item.region === region && item.roleId > roleId)
      ]
      setAuditList(data)
    }
  }

  //通过或驳回新闻
  const handleNews = async (item, auditState, publishState) => {
    let res = await axios.patch(`/news/${item.id}`, {publishState, auditState})
    console.log(res)
    if(res.status === 200){
      getAuditList()
      notification.info({
        message: `提示`,
        description:'您可以到【审核管理/审核列表】中查看',
        placement: "bottomRight"
      });
    }
  }

  return (
      <div>
        <Table dataSource={auditList} columns={columns} rowKey={item => item.id} />
      </div>
  )
}
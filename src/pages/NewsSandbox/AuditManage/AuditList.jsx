import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Button, message, Table, Tag, notification} from 'antd'

export default function AuditList(){

  //审核列表数据
  const [auditList, setAuditList] = useState([])
  //从localStorage中获取数据
  const {username} = JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate()

  useEffect(() => {
    getAuditList()
  }, [])

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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
      //  2:通过 1：审核中 3：未通过
        return <span>
            {
              auditState === 1 && <Tag color="orange">审核中</Tag>
            }
            {
              auditState === 2 && <Tag color="green">已通过</Tag>
            }
            {
              auditState === 3 && <Tag color="red">未通过</Tag>
            }
          </span>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <span>
            {
              item.auditState === 1 && <Button onClick={() => { reset(item) }} type="primary">撤销</Button>
            }
            {
              item.auditState === 2 && <Button onClick={() => {handlePublish(item)}} type="primary">发布</Button>
            }
            {
              item.auditState === 3 && <Button onClick={() => handleUpdate(item)} type="primary">修改</Button>
            }
          </span>
        )
      }
    }
  ];

  //获取审核列表数据
  const getAuditList = async () => {
    let res = await axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`)
    if(res.status === 200){
      setAuditList(res.data)
    }
  }

  //撤销新闻
  const reset = async (item) => {
    let res = await axios.patch(`/news/${item.id}`, {
      auditState: 0
    })
    if(res.status === 200){
      message.success('撤销成功')
    //  重新获取数据
      getAuditList()
    }else{
      message.error('撤销失败')
    }
  }

  //修改新闻
  const handleUpdate = (item) => {
    navigate(`/news-manage/update/${item.id}`)
  }

  //发布新闻
  const handlePublish = async (item) => {
    let res = await axios.patch(`/news/${item.id}`, { publishState: 2, publishTime:Date.now() })
    if(res.status === 200){
    //  发布成功
      notification.info({
        message: `提示`,
        description:'发布成功，可以前往【发布管理/已发布】查看',
        placement: 'bottomRight'
      })
    //  重新获取新闻
      getAuditList()
    }else{
      message.error('发布失败')
    }
  }

  return (
      <div>
        <Table dataSource={auditList} columns={columns} rowKey={item => item.id} />
      </div>
  )
}
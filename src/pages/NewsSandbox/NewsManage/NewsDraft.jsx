import React, {useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import {Table, Button, Modal, message} from "antd";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined, VerticalAlignTopOutlined} from '@ant-design/icons'
import axios from "axios";
const { confirm } = Modal;

export default function NewsDraft(){
  //草稿箱数据
  const [draft, setDraft] = useState([])
  //从localStorage获取数据
  const {username} = JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate()
  //页面初始化，获取草稿箱
  useEffect(() => {
    getDrafts()
  }, [])

  //表格的列信息
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <Button type="link" onClick={() => navigate(`/news-manage/preview/${item.id}`)}>{title}</Button>
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
            <div>
              <Button onClick={() => deleteDraft(item)} danger shape="circle" icon={<DeleteOutlined />} />
              <Button onClick={() => navigate(`/news-manage/update/${item.id}`)} shape="circle" style={{margin: '0 10px'}} icon={<EditOutlined />} />
              <Button onClick={() => submit(item)} type="primary" shape="circle" icon={<VerticalAlignTopOutlined />} />
            </div>
        )
      }
    }
  ];

  //获取草稿箱数据
  const getDrafts = async () => {
    let res = await axios.get(`/news?username=${username}&auditState=0&_expand=category`)
    if(res.status === 200){
      setDraft(res.data)
    }
  }

  //删除草稿箱数据
  const deleteDraft = (item) => {
    confirm({
      title: '你确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
      //  发送请求
        axios.delete(`/news/${item.id}`).then(
            res => {
              if(res.status === 200){
                message.success('删除成功')
                //重新获取数据
                getDrafts()
              }
            }
        ).catch(err => {
          message.error(err.message)
        })
      },
      onCancel() {
        message.info('取消删除')
      },
    });
  }

  //提交审核
  const submit = async (item) => {
    let res = await axios.patch(`/news/${item.id}`, {
      auditState: 1
    })
    if(res.status === 200){
      message.success('提交成功')
    //  重新获取草稿数据
      getDrafts()
    }else{
      message.error(res.message)
    }
  }

  return (
      <Table dataSource={draft} columns={columns} rowKey={'id'} />
  )
}
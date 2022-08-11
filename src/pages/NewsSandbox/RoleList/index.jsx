import React, {useState, useEffect} from 'react'
import {Table, Button, message, Modal, Tree} from 'antd'
import { DeleteOutlined,UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal;

export default function RoleList() {
  // 角色列表信息
  const [roleList, setRoleList] = useState([])
  // 权限信息
  const [rights, setRights] = useState([])
  // 对话框是否展示
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 树形结构中选中的数据
  const [checkedKeys, setCheckedKeys] = useState([])
  // 展示对话框时对应角色的id
  const [roleId, setRoleId] = useState('')

  // 页面初始化获取权限列表和角色列表
  useEffect(() => {
    getRoleList()
    getRights()
  }, [])

  // 表格的列数据
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: item => {
        return <b>{item}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render: item => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(item)} />
            <Button type='primary' shape="circle" icon={<UnorderedListOutlined />} onClick={() => { showModal(item) }}  />
          </div>
        )
      }
    },
  ];

  // 获取角色信息
  const getRoleList = () => {
    axios.get('http://localhost:5000/roles').then(
      res => {
        if(res.status === 200){
          // console.log(res.data);
          setRoleList(res.data)
        }
      }
    )
  }

  // 获取权限信息
  const getRights = () => {
    axios.get('http://localhost:5000/rights?_embed=children').then(
      res => {
        if(res.status === 200){
          // console.log(res.data);
          setRights(res.data)
        }
      }
    )
  }

  // 点击删除的回调
  const showConfirm = (item) => {
    confirm({
      title: '你确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteRight(item)
      }
    });
  }

  // 删除角色
  const deleteRight = (item) => {
    axios.delete(`http://localhost:5000/roles/${item.id}`).then(
      res => {
        // 重新获取数据
        getRoleList(res.data)
        message.success('删除成功', 3);
      },
      err => {
        message.error(err.message)
      }
    )
  }

  // 展示对话框时的回调
  const showModal = (item) => {
    // 显示对话框
    setIsModalVisible(true);
    // 给selectkeys赋值，让对应的复选框选中
    let res = roleList.find(data => {
      return data.id === item.id
    })
    setRoleId(res.id)
    setCheckedKeys(res.rights)
  };

  // 对话框点击确认，发送请求
  const handleOk = () => {
    // 关闭对话框
    setIsModalVisible(false);
    // 发送请求，patch对应的数据
    axios.patch(`http://localhost:5000/roles/${roleId}`, {rights: checkedKeys}).then(
      res => {
        if(res.status === 200){
          message.success('修改成功')
          // 重新获取角色列表
          getRoleList()
        }
      },
      err => {
        message.error(err.message)
      }
    )
  };

  // 对话框点击取消的回调
  const handleCancel = () => {
    setIsModalVisible(false);
    message.info('取消修改')
  };

  // 对话框勾选复选框的回调
  const onCheck = (checkedKeys) => {
    setCheckedKeys(checkedKeys)
  };

  return (
    <div>
      <Table dataSource={roleList} columns={columns} rowKey={item => item.id} pagination={{ pageSize: 5 }} />
      <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Tree
        checkable
        onCheck={onCheck}
        treeData={rights}
        checkedKeys={checkedKeys}
      />
      </Modal>
    </div>
  )
}

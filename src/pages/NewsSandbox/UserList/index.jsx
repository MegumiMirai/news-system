import React, {useState, useEffect, useRef} from 'react'
import axios from "axios";
import {Button, Switch, Table, Modal, message} from 'antd';
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import UserForm from "../../../components/UserManage/UserForm";
const { confirm } = Modal;

export default function UserList() {

  //user的信息
  const [users, setUsers] = useState([])
  //region信息
  const [regions, setRegions] = useState([])
  //role信息
  const [roles, setRoles] = useState([])
  //添加用户对话框的显示与隐藏
  const [isModalVisible, setIsModalVisible] = useState(false)
  //更新用户对话框的显示与隐藏
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  //给UserForm绑定ref
  const addFormRef = useRef(null)
  //更新用户的form表单的ref
  const updateFormRef = useRef(null)
  //父子间通信，如果是更新表单，需要传入disabled
  const [updateFormRegionDisabled, setUpdateFormRegionDisabled] = useState(false)
  //修改表单的id
  const [updateId, setUpdateId] = useState(null)
  //从localstorage中获取数据
  const {username, region, roleId} = JSON.parse(localStorage.getItem('token'))

  // 初始化，获取用户数据
  useEffect(() => {
    getUsers()
    getRegion()
    getRoles()
  }, [])

  //获取用户数据
  const getUsers = () =>{
    const roleObj = {
      '1': 'superadmin',
      '2': 'admin',
      '3': 'editor'
    }
    //获取users
    axios.get('/users?_expand=role').then(
        res => {
          if(res.status === 200){
            let list = res.data
            //只能看到他本身以及同样的region
            list = roleObj[roleId] === 'superadmin' ? list : [
                ...list.filter(item => item.username === username),
                ...list.filter(item => item.region === region && item.roleId > roleId)
            ]
            setUsers(list)
          }
        }
    )
  }
  //获取region信息
  const getRegion = () =>{
    axios.get('/regions').then(
        res => {
          if(res.status === 200){
            setRegions(res.data)
          }
        }
    )
  }
  //获取role信息
  const getRoles = () =>{
    axios.get('/roles').then(
        res => {
          if(res.status === 200){
            setRoles(res.data)
          }
        }
    )
  }

  //表格的列数据
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{ region === '' ? '全球' : region }</b>
      },
      filters:[
        ...regions.map(region => {
          return {
            text: region.title,
            value: region.value
          }
        }),
        {
          text: '全球',
          value: ''
        }
      ],
      onFilter: (value, record) => record.region === value,
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render:(role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (state, item) =>{
        return <Switch checked={state} disabled={item.default} onChange={ () => changeState(state, item) }></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
            <div>
              <Button danger shape="circle" icon={<DeleteOutlined/>} disabled={item.default} onClick={() => showConfirm(item)}></Button>
              <Button type="primary" shape="circle" icon={<EditOutlined/>} disabled={item.default} onClick={() => handleUpdate(item)}></Button>
            </div>
        )
      }
    },
  ]

  //切换switch的开关
  const changeState = (state, item) =>{
    //页面数据更新
    item.roleState = !state
    setRoles([...roles])
    //发请求
    axios.patch(`/users/${item.id}`, {
      roleState: !state
    })
  }

  // 点击删除的回调
  const showConfirm = (item) => {
    confirm({
      title: '你确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteUser(item)
      }
    });
  }

  //删除用户的回调
  const deleteUser = async (item) => {
    let res = await axios.delete(`/users/${item.id}`)
    // console.log(res)
    if(res.status === 200){
      message.success('删除成功')
    //  重新获取用户信息
      getUsers()
    }else{
      message.error(res.message)
    }
  }

  //添加用户对话框点击确认的回调
  const handleOk = () => {
    addFormRef.current.validateFields().then(
      async res => {
        //表单验证通过，发送请求
        let result = await axios.post('/users', {
          ...res,
          roleState:true,
          default: false
        })
        if(result.status === 201){
          //  创建成功
          message.success('添加成功')
        //  重新获取user数据
          getUsers()
        }else{
        //  创建失败
          message.error(result.message)
        }
        //关闭对话框
        setIsModalVisible(false);
      }
    ).catch(err =>{})

  };

  //添加用户对话框点击取消的回调
  const handleCancel = () => {
    //关闭对话框
    setIsModalVisible(false);
    //清空表单中的数据
    addFormRef.current.resetFields()
  };

  //点击修改按钮，显示对话框
  const handleUpdate = async (item) => {
    await setIsUpdateModalVisible(true)
    //根据item的roleId修改updateFormRegionDisabled
    if(item.roleId === 1){
      setUpdateFormRegionDisabled(true)
    }else{
      setUpdateFormRegionDisabled(false)
    }
    //开启对话框和下面这个代码并不一定是同步的
    updateFormRef.current.setFieldsValue(item)
    //要保存当前表单的id，否则找不到id，无法修改
    setUpdateId(item.id)
  }

  //更新用户对话框点击确认的回调
  const updateFormOk = () => {
    updateFormRef.current.validateFields().then(
        async res => {
          //发送请求
          let result = await axios.patch(`/users/${updateId}`, res)
          if(result.status === 200){
          //  更新成功
            message.success('更新成功')
          //  重新获取user信息
            getUsers()
          }else{
            message.error('更新失败')
          }
        //  关闭对话框
          setIsUpdateModalVisible(false)
        }
    ).catch(err => {})
  }

  //更新用户对话框关闭事件
  const handleUpdateFormCancel = () => {
    setIsUpdateModalVisible(false)
    //重新设置form表单的disabled
    setUpdateFormRegionDisabled(updateFormRef.current.getFieldsValue().roleId === 1 ? true : false)
  }

  return (
    <div>
      <Button type="primary" onClick={() => {setIsModalVisible(true)}}>添加用户</Button>
      <Table dataSource={users} columns={columns} rowKey={item => item.id} />

      {/* 添加用户的对话框 */}
      <Modal title="添加用户信息" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消">
        <UserForm regions={regions} roles={roles} ref={addFormRef}></UserForm>
      </Modal>

      {/* 更新用户的对话框 */}
      <Modal title="更新用户信息" visible={isUpdateModalVisible} onOk={updateFormOk} onCancel={ handleUpdateFormCancel } okText="确认" cancelText="取消">
        <UserForm isUpdate={true} regions={regions} roles={roles} ref={updateFormRef} updateFormRegionDisabled={updateFormRegionDisabled}></UserForm>
      </Modal>
    </div>
  )
}

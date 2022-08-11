import React, {useState} from 'react'
import {useNavigate} from "react-router-dom";
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined 
} from '@ant-design/icons';
import {connect} from "react-redux";

const { Header } = Layout;

function TopMenu(props) {
  const {role: {roleName}, username} = JSON.parse(localStorage.getItem('token')) || []
  const navigate = useNavigate()
  // const [collapsed, setCollapsed] = useState(false)
  const changeCollapsed = () => {
    // setCollapsed(!collapsed)
    // console.log(props)
    props.changeCollapsed()
  }
  const menu = (
  <Menu
    items={[
      {
        label: roleName
      },
      {
        danger: true,
        label: '退出',
        onClick: () => {
          //清空token
          localStorage.removeItem('token')
          //路由跳转到登录页面
          navigate('/login')
        }
      }
    ]}
  />
);
  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {
        props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
      }
      <div style={{float: 'right'}}>
        <span style={{marginRight: '10px'}}>欢迎回来{username}</span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = ({ CollapsedReducer: {isCollapsed} }) => {
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: 'change_collapsed'
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu)

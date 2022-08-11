import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import './index.css'
import axios from 'axios'
import {connect} from "react-redux";

const { Sider } = Layout


function SideMenu(props) {
  const navigate = useNavigate()
  const [menu, setMenu] = useState([])
  const selectDefault = [useLocation().pathname]
  const openDefault = ['/'+ useLocation().pathname.split('/')[1]]
  //从localStorage中获取用户的权限
  const {role: {rights}} = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then(
      response => { 
        let res = response.data
        setLabel(res)
        res = removeNoRight(res)
        setMenu(res)
      }
    )
    
    return undefined
  }, [])

  function setLabel(items){
    items.map((item) => {
      item.label = item.title
      if(item.children && item.children.length > 0){
        setLabel(item.children)
      }
      if(item.rightId){
        item.rightid = item.rightId
        delete item['rightId']
      }
    })
  }

  function removeNoRight(items){
    items = items.filter(item => {
      if(item.children && item.children.length > 0){
        item.children = removeNoRight(item.children)
      }
      if(item.children && item.children.length === 0){
        delete item['children']
      }
      //有权限并且right中包含可以
      if(item.pagepermisson && rights.includes(item.key)){
        return item
      }
    })
    return items
  }

  
  const onClick = (props) => {
    navigate(props.key)
  };
  
  return (
    // <Sider trigger={null} collapsible collapsed={collapsed}>
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <div className="logo">
          全球新闻管理发布系统
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Menu
            onClick={onClick}
            style={{
              width: '100%',
            }}
            selectedKeys={selectDefault}
            defaultOpenKeys={openDefault}
            mode="inline"
            items={menu}
            theme="dark"
          />
        </div>
      </div>
    </Sider>
  )
}

const mapStateToProps = ({ CollapsedReducer: {isCollapsed} }) => {
  // console.log(isCollapsed)
  return {
    isCollapsed
  }
}

export default connect(mapStateToProps)(SideMenu)
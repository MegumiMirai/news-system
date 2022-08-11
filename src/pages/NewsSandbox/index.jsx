import React, {useEffect} from 'react'
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import { Outlet } from 'react-router-dom'
import { Layout  } from 'antd'
import './index.css'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import {Spin} from "antd"
import {connect} from "react-redux";

const { Content } = Layout;

function Sendbox(props) {
  nprogress.start()
  useEffect(() => {
    nprogress.done()
  })
  return (
    <Layout>
      <SideMenu />

      <Layout className="site-layout">
        <TopHeader />
        <Content className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          <Spin size="large" spinning={props.isLoading}>
            <Outlet />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  )
}

const mapStateToProps = ({ LoadingReducer: {isLoading} }) => {
  // console.log(isLoading)
  return {
    isLoading
  }
}

export default connect(mapStateToProps)(Sendbox)

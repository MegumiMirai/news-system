import React, {useEffect, useRef, useState} from 'react'
import {Card, Col, Row, List, Avatar, Button, Drawer} from 'antd';
import { EditOutlined, EllipsisOutlined, AreaChartOutlined } from '@ant-design/icons';
import axios from 'axios'
import {useNavigate} from "react-router-dom";
import * as echarts from 'echarts'
import _ from 'lodash'

const { Meta } = Card;

export default function Home() {

  const barRef = useRef()
  const pieRef = useRef()
  const navigate = useNavigate()
  //用户最常浏览列表
  const [views, setViews] = useState([])
  //用户最常浏览列表
  const [stars, setStars] = useState([])
  //新闻
  const [news, setNews] = useState([])
  const [pieChart, setPieChart] = useState(null)

  //从localSto获取数据
  const { username, region, role: {roleName} } = JSON.parse(localStorage.getItem('token'))
  //抽屉是否展开
  const [visible, setVisible] = useState(false);
  //UI界面初始化
  useEffect(() => {
    getViews()
    getStars()
    getNews()

    return () => {
      window.onresize = null
    }
  }, [])


  //获取用户最常浏览列表
  const getViews = async () => {
    let res = await axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6')
    if(res.status === 200){
      setViews(res.data)
    }
  }

  //获取用户最多点赞列表
  const getStars = async () => {
    let res = await axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6')
    if(res.status === 200){
      setStars(res.data)
    }
  }

  //获取所有新闻
  const getNews = async () => {
    let res = await axios.get('/news?publishState=2&_expand=category')
    if(res.status === 200){
      renderBar(_.groupBy(res.data, item => item.category.title))
      setNews(res.data)
    }
  }

  //渲染柱状图
  const renderBar = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '销量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    window.onresize = () => {
      myChart.resize()
    }
  }

  //渲染饼状图
  const renderPie = () => {

    const currentList = news.filter(item => item.author = username)
    const groupObj = _.groupBy(currentList, item => item.category.title)

    const list = []
    for(var i in groupObj){
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }

    // 基于准备好的dom，初始化echarts实例
    var myChart

    if(!pieChart){
      myChart = echarts.init(pieRef.current)
      setPieChart(myChart)
    }else{
      myChart = pieChart
    }

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: 'Referer of a Website',
        subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    option && myChart.setOption(option);
  }

  const showDrawer = () => {
    setVisible(true);
  };

  return (
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="用户最常浏览" bordered={true}>
              <List
                  size="large"
                  dataSource={views}
                  renderItem={item => <List.Item><Button onClick={() => {navigate(`/news-manage/preview/${item.id}`)}} type="link">{item.title}</Button></List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="用户点赞最多" bordered={true}>
              <List
                  size="large"
                  dataSource={stars}
                  renderItem={item => <List.Item><Button onClick={() => {navigate(`/news-manage/preview/${item.id}`)}} type="link">{item.title}</Button></List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
                cover={
                  <img
                      alt="example"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
                actions={[
                  <AreaChartOutlined key="setting" onClick={() => {
                    setTimeout(() => {
                      showDrawer()
                      renderPie()
                    }, 0)
                  }} />,
                  <EditOutlined key="edit" />,
                  <EllipsisOutlined key="ellipsis" />,
                ]}
            >
              <Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title={username}
                  description={ <span>
                    <span>{region ? region : '全球'}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>{roleName}</span>
                  </span> }
              />
            </Card>
          </Col>
        </Row>

      {/*  抽屉*/}
        <Drawer
            width="30%"
            title="个人新闻分类"
            placement="right"
            closable={false}
            onClose={() => {
              setVisible(false);
            }}
            visible={visible}
        >
          <div ref={pieRef} style={{ width: '100%', height: '400px' }}></div>
        </Drawer>

        <div ref={barRef} style={{ width: '100%', height: '400px', marginTop: '50px' }}></div>
      </div>
  )
}

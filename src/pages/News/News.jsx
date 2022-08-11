import React, {useEffect, useState} from "react";
import {PageHeader, Card, Col, Row, List, Button} from 'antd';
import axios from "axios";
import _ from 'lodash'
import {useNavigate} from "react-router-dom";

export default function News() {

  const [news, setNews] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    let res = axios.get('news?publishState=2&_expand=category').then(
        res => {
          if(res.status === 200){
            setNews(Object.entries(_.groupBy(res.data, item => item.category.title)))
          }
        }
    )
  }, [])

  return (
      <div>
        <PageHeader
            className="site-page-header"
            title="全球大新闻"
            subTitle="查看新闻"
        />
        <div className="site-card-wrapper">
          <Row gutter={[16, 16]}>
            {
              news.map(item => {
                return <Col key={item[0]} span={8}>
                  <Card title={item[0]} bordered hoverable={true}>
                    <List
                        size="large"
                        dataSource={item[1]}
                        pagination={{
                          pageSize: 3
                        }}
                        renderItem={(item) => <List.Item><Button onClick={() => navigate(`/detail/${item.id}`)} type="link">{item.title}</Button></List.Item>}
                    />
                  </Card>
                </Col>
              })
            }
          </Row>
        </div>
      </div>
  )
}
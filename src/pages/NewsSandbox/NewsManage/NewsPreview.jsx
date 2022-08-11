import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import { Button, Descriptions, PageHeader } from 'antd';
import axios from "axios";
import dayjs from "dayjs";
import style from './News.module.css'

export default function NewsPreview(props) {
    //从params中获取id
    const [newsId, setNewsId] = useState(useParams().id)
    //新闻信息
    const [newsInfo, setNewsInfo] = useState({})
    //从新闻信息对象中解构出信息
    const {title,content, category, author, createTime, publishTime, region, auditState, publishState, view, star,} = newsInfo || []
    const auditList = ['未审核','审核中','已通过','未通过']
    const publishList = ['未发布', '待发布', '已上线', '已下线']
    const colorList = ['black', 'orange', 'green', 'red']

    useEffect(() => {
    //    根据id发送请求，获取news数据
        axios.get(`/news/${newsId}?_expand=category&_expand=role`).then(
            res => {
                if(res.status === 200){
                    setNewsInfo(res.data)
                }
            }
        )
    }, [])

    return (
        <div className="site-page-header-ghost-wrapper">
            <PageHeader
                onBack={() => window.history.back()}
                title={title}
                subTitle={category?.title}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{author}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{dayjs(createTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{publishTime ? dayjs(publishTime).format('YYYY/MM/DD HH:mm:ss') : '-'}</Descriptions.Item>
                    <Descriptions.Item label="区域">{region}</Descriptions.Item>
                    <Descriptions.Item label="审核状态"><span style={{color: colorList[auditState]}}>{auditList[auditState]}</span></Descriptions.Item>
                    <Descriptions.Item label="发布状态"><span style={{color: colorList[publishState]}}>{publishList[publishState]}</span></Descriptions.Item>
                    <Descriptions.Item label="访问数量"><span className={style.green}>{view}</span></Descriptions.Item>
                    <Descriptions.Item label="点赞数量"><span className={style.green}>{star}</span></Descriptions.Item>
                    <Descriptions.Item label="评论数量"><span className={style.green}>0</span></Descriptions.Item>
                </Descriptions>
            </PageHeader>
            {/*文本内容*/}
            <div dangerouslySetInnerHTML={{ __html:content }} style={{border: '1px solid #ccc', margin: '0 20px'}}></div>
        </div>
    )
}
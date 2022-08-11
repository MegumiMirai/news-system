import React, {useState, useEffect, useRef} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {PageHeader, Steps, Button, Form, Input, Select, message, notification} from 'antd'
import style from './News.module.css'
import axios from "axios";
import NewsEditor from "../../../components/NewsManage/NewsEditor";
const { Step } = Steps;
const { Option } = Select;

export default function NewsUpdate(){
  //控制步骤条当前进度
  const [step, setStep] = useState(0)
  //新闻分类数据
  const [categories, setCategories] = useState([])
  //表单的ref
  const NewsFormRef = useRef(null)
  //表单信息
  const [formInfo, setFormInfo] = useState({})
  //富文本编辑器内容
  const [content, setContent] = useState('')
  //表单的样式
  const layout = {
    labelCol: {
      span: 2,
    },
    wrapperCol: {
      span: 22,
    },
  }
  const navigate = useNavigate()
  //从params中获取id
  const [newsId, setNewsId] = useState(useParams().id)

  //获取新闻分类数据
  useEffect(() => {
    axios.get('/categories').then(
        res => {
          if(res.status === 200){
            setCategories(res.data)
          }
        }
    ).catch(err => {})
  }, [])

  useEffect(() => {
    //    根据id发送请求，获取news数据
    axios.get(`/news/${newsId}?_expand=category&_expand=role`).then(
        res => {
          if(res.status === 200){
            let { title, categoryId, content} = res.data
            // console.log(res.data.content)
            NewsFormRef.current.setFieldsValue({ title, categoryId } )
            setContent(content)
          }

        }
    )
  }, [])

  //点击下一步的回调
  const handleNext = () => {
    if(step === 0){
      //  验证表单
      NewsFormRef.current.validateFields().then(
          value => {
            setFormInfo(value)
            //  放行
            setStep(step + 1)
          }
      ).catch(err => {})
    }else{
      if(content === '' || content.trim() === '<p></p>'){
        message.error('新闻内容不能为空')
      }else{
        setStep(step + 1)
      }
    }
  }

  //保存到草稿箱
  const handleSave = async (auditState) => {
    let data = {
      ...formInfo,
      content,
      auditState
    }
    let res = await axios.patch(`/news/${newsId}`, data)
    if(res.status === 201 || res.status === 200){
      //跳转路由
      navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
      //  提示信息
      notification.info({
        message: `通知`,
        description: `你可以到${auditState === 0 ? "草稿箱" : '审核列表'}中查看您提交的新闻`,
        placement: "bottomRight",
      });
    }else{
      message.error('提交失败')
    }
  }

  return (
      <div>
        {/*页头*/}
        <PageHeader
            className="site-page-header"
            onBack={() => window.history.back()}
            title="更新新闻"
        />
        {/*步骤条*/}
        <Steps current={step} style={{margin: '20px 0'}}>
          <Step title="基本信息" description="新闻标题，新闻分类" />
          <Step title="新闻内容" description="新闻主体内容" />
          <Step title="新闻提交" description="保存草稿或者提交审核" />
        </Steps>

        {/*步骤*/}
        <div style={{marginBottom: '20px'}}>
          <div className={step === 0 ? '' : style.hidden}>
            <Form {...layout} name="control-hooks" ref={NewsFormRef}>
              <Form.Item name="title" label="新闻标题" rules={[{ required: true}]}>
                <Input />
              </Form.Item>
              <Form.Item name="categoryId" label="新闻分类" rules={[{required: true}]}>
                <Select allowClear>
                  {
                    categories.map(item => {
                      return <Option key={item.id} value={item.id}>{item.title}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Form>
          </div>
          <div className={step === 1 ? '' : style.hidden}>
            {/*富文本编辑器*/}
            <NewsEditor getContent={(value) => {setContent(value)}} content={content}></NewsEditor>
          </div>
          <div className={step === 2 ? '' : style.hidden}></div>
        </div>

        {/*按钮*/}
        <div>
          {
              step === 2 && <span>
              <Button type="danger" onClick={() => handleSave(0)}>保存草稿箱</Button>
              <Button type="primary" onClick={() => handleSave(1)}>提交审核</Button>
            </span>
          }
          {
              step > 0 && <Button type='primary' onClick={() => setStep(step - 1)}>上一步</Button>
          }
          {
              step < 2 && <Button type='primary' disabled={step >= 2} onClick={handleNext}>下一步</Button>
          }


        </div>
      </div>
  )
}
import React, {useState, useEffect, useRef} from 'react'
import {useNavigate} from "react-router-dom";
import {PageHeader, Steps, Button, Form, Input, Select, message, notification} from 'antd'
import style from './News.module.css'
import axios from "axios";
import NewsEditor from "../../../components/NewsManage/NewsEditor";
const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd(){
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
  //从localStorage中获取数据
  const { region, username, roleId } = JSON.parse(localStorage.getItem('token'))
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
      region: region ? region : '全球',
      author: username,
      roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0
    }
    let res = await axios.post('/news', data)
    if(res.status === 201){
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

  const onFinish = (values) => {
    console.log(values);
  };

  return (
      <div>
        {/*页头*/}
        <PageHeader
            className="site-page-header"
            title="撰写新闻"
            subTitle="This is a subtitle"
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
            <Form {...layout} name="control-hooks" onFinish={onFinish} ref={NewsFormRef}>
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
            <NewsEditor getContent={(value) => {setContent(value)}}></NewsEditor>
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
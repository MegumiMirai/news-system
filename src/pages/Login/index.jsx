import React from 'react'
import {useNavigate} from "react-router-dom";
import {Button, Form, Input, message} from 'antd';
import './index.css'
import axios from "axios";

export default function Login() {

  const navigate = useNavigate()

  const onFinish = async (values) => {
  //  发送请求
    let {data:res} = await axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
    if(res.length === 0){
    //  请求失败
      message.error('用户名或密码不匹配')
    }else{
    //  请求成功，存储token，跳转路由
      localStorage.setItem('token', JSON.stringify(res[0]))
      navigate('/home')
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="bg">
      <div className="container">
        <div className="logintitle">欢迎来到全球新闻管理发布系统</div>
        <div className="form">
        {/*  表单*/}
          <Form
              name="basic"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
          >
            <Form.Item
                label="Username"
                name="username"
                rules={[{required: true,message: 'Please input your username!',},]}
            >
              <Input />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{required: true,message: 'Please input your password!',}]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{offset: 10,span: 16,}}>
              <Button type="primary" htmlType="submit">提交</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

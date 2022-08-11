import React, {forwardRef, useState, useEffect} from "react";
import {Form, Input, Select} from "antd";
const { Option } = Select;
const UserForm = forwardRef((props, ref) => {
    //控制region的禁用
    const [disabled, setDisabled] = useState(false)
    //从localStorage中获取用户信息
    const {region, roleId} = JSON.parse(localStorage.getItem('token'))
    const roleObj = {
        '1':'superadmin',
        '2':'admin',
        '3':'editor'
    }

    useEffect(() =>{
    // 当父组件传递的updateFormRegionDisabled改变是，动态更新disabled
        setDisabled(props.updateFormRegionDisabled)
    }, [props.updateFormRegionDisabled])


    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    //判断当前region是否需要disabled
    const checkRegionDisabled = (item) => {
        //如果是更新
        if(props.isUpdate){
            //如果是超级管理员
            if(roleObj[roleId] === 'superadmin'){
                return false
            }else{
                return true
            }
        }else{
            //如果是超级管理员
            if(roleObj[roleId] === 'superadmin'){
                return false
            }else{
                //如果不是超级管理员，只能添加与当前用户同样的region
                return !(item.title === region)
            }
        }
    }

    //判断当前是否可选role
    const checkRoleDisabled = (item) => {
        //如果是更新
        if(props.isUpdate){
            //如果是超级管理员
            if(roleObj[roleId] === 'superadmin'){
                return false
            }else{
                return true
            }
        }else{
            //如果是超级管理员
            if(roleObj[roleId] === 'superadmin'){
                return false
            }else{
                //如果不是超级管理员，只能添加roleId大于当前用户的角色
                return item.roleType <= roleId
            }
        }
    }

    return (
        <Form
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            ref={ref}
        >
            <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input.Password  />
            </Form.Item>
            <Form.Item
                label="区域"
                name="region"
                rules={[{ required: !disabled, message: 'Please input your username!' }]}
            >
                <Select disabled={disabled}>
                    {
                        props.regions.map(item => {
                            return <Option key={item.id} value={item.value} disabled={checkRegionDisabled(item)}>{item.title}</Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item
                label="角色"
                name="roleId"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Select
                    onChange ={(value) => {
                        if (value === 1){
                        //    清空区域input的里面的值，并且禁用
                            setDisabled(true)
                            ref.current.setFieldsValue({
                                region:''
                            })
                        }else{
                        //    解锁区域input
                            setDisabled(false)
                        }
                    }}
                >
                    {
                        props.roles.map(item => {
                            return <Option key={item.id} value={item.roleType} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
                        })
                    }
                </Select>

            </Form.Item>
        </Form>
    )
})

export default UserForm
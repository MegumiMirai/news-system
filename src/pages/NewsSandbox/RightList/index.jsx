import React, {useEffect, useState} from 'react'
import { Table, Tag, Button, Modal, message, Popover, Switch  } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined,  } from '@ant-design/icons';
import axios from 'axios'
const { confirm } = Modal;

export default function RightList() {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    getDataSource()
  }, [])

  // 获取权限数据的回调
  const getDataSource = () => {
    axios.get('http://localhost:5000/rights?_embed=children').then(
      res => {
        // setDataSource(res.data)
        const data = res.data
        data.map(item => {
          if(item.children?.length === 0){
            delete item['children']
          }
        })
        setDataSource(data)
      }
    )
  }

  // 点击删除的回调
  const showConfirm = (item) => {
    confirm({
      title: '你确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteRight(item)
      },
      onCancel() {
        message.info('取消删除')
      },
    });
  }

  // 删除权限
  const deleteRight = (item) => {
    try {
      if(item.grade === 1){
        axios.delete(`http://localhost:5000/rights/${item.id}`).then(
        res => {
          // 重新获取数据
          getDataSource(res.data)
          message.success('删除成功', 3);
        },
        err => {
          message.error(err.message)
        })
      }else if(item.grade === 2){
        axios.delete(`http://localhost:5000/children/${item.id}`).then(
        res => {
          // 重新获取数据
          getDataSource(res.data)
          message.success('删除成功', 3);
        },
        err => {
          message.error(err.message)
        })
      }
    } catch (error) {
      message.error(error.message)
    }
  }

  // 选择框改变事件
  const onChange = (item) => {
    // 发送请求
    axios.patch(`http://localhost:5000/${item.grade === 1 ? 'rights' : 'children'}/${item.id}`, {
      pagepermisson: item.pagepermisson === 0 ? 1 : 0
    }).then(
      res => {
        // 重新获取数据
        getDataSource()
      }
    )
  }


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'left',
      width: 1,
      render: (id) => {
        return (
          <b>
            {id}
          </b>
        )
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      align: 'center',
      width: 3,
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      align: 'center',
      width: 3,
      render: (path, b) => {
        return (
          <Tag color="purple">
            {path}
          </Tag>
        )
      }
    },
    {
      title: '操作',
      align: 'center',
      width: 1,
      render: (item) => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(item)} />
            <Popover content={<Switch checked={item.pagepermisson === 1} onChange={() => onChange(item)} />} title="配置项" trigger={ item.pagepermisson === undefined ? '' : 'click' }>
              <Button type='primary' shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
            </Popover>
            
          </div>
        )
      }
    }
  ];

  return (
    <Table columns={columns} dataSource={dataSource} pagination={{
      pageSize: 5
    }} />
  )
}

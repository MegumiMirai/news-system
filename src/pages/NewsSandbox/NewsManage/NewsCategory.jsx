import React, {useEffect, useState, useRef, useContext} from 'react'
import {Button, message, Modal, Table, Form, Input} from 'antd';
import axios from "axios";
import {DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
const { confirm } = Modal;
const EditableContext = React.createContext(null);

export default function NewsCategory(){

  //栏目列表
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getCategories()
  }, [])

  //获取栏目列表
  const getCategories = async () => {
    let res = await axios.get('/categories')
    if(res.status === 200){
      setCategories(res.data)
    }
  }

  //删除栏目
  const deleteCategories = (item) => {
    confirm({
      title: '你确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        axios.delete(`/categories/${item.id}`).then(
            res => {
              if(res.status === 200){
                message.success('删除成功')
                getCategories()
              }
            }
        )
      }
    });
  }

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
          <EditableContext.Provider value={form}>
            <tr {...props} />
          </EditableContext.Provider>
        </Form>
    );
  };

  const EditableCell = ({
                          title,
                          editable,
                          children,
                          dataIndex,
                          record,
                          handleSave,
                          ...restProps
                        }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
          <Form.Item
              style={{
                margin: 0,
              }}
              name={dataIndex}
              rules={[
                {
                  required: true,
                  message: `${title} is required.`,
                },
              ]}
          >
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
          </Form.Item>
      ) : (
          <div
              className="editable-cell-value-wrap"
              style={{
                paddingRight: 24,
              }}
              onClick={toggleEdit}
          >
            {children}
          </div>
      )
  }

  return <td {...restProps}>{childNode}</td>;
}

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave: handleSave
      })
    },
    {
      title: '操作',
      render: (item) => {
        return  <Button onClick={() => {deleteCategories(item)}} danger shape="circle" icon={<DeleteOutlined />} />
      }
    }
  ]


  const handleSave = async (row) => {
    let res = await axios.patch(`/categories/${row.id}`, {title: row.title})
    if(res.status === 200){
      getCategories()
    }
  };


  return (
      <Table rowKey={item => item.id} dataSource={categories} columns={columns} pagination={{
        pageSize: 5
      }}
      components={{
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      }}
      />
  )
}
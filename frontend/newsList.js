import React from 'react';
import { Table, Modal, Popconfirm, Form, Input, Space } from 'antd';
import { FormInstance } from 'antd/lib/form';


const { Search } = Input;


const formRef = React.createRef();

class NewsList extends React.Component {

    // formRef = React.createRef();
    render() {
        const {
            onSearch,
            dataSource,
            isModalVisible,
            onOk,
            handleCancel,
            handleShowModal,
            initValues
        } = this.props
        const columns = [
            {
                title: 'ID',
                dataIndex: '_id',
                key: '_id',
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: text => <a>{text}</a>,
            },
            {
                title: 'news',
                dataIndex: 'message',
                key: 'message',
                width: 260,
                render: (text, record) => (<div style={{ width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', }}>{record.message || ''}</div>)
            },
            {
                title: 'createTime',
                dataIndex: 'createdAt',
                key: 'createdAt',
            },
            {
                title: 'Action',
                key: 'action',
                width: 180,
                render: (text, record) => (
                    <div>
                        <Space>
                            <Popconfirm
                                title="Are you sure to delete this news?"
                                onConfirm={() => {
                                    this.props.deleteFromDB(record['_id'])
                                }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <div style={{ color: '#1890ff', cursor: 'pointer' }} href="#">Delete</div>
                            </Popconfirm>

                            <div style={{ color: '#1890ff', cursor: 'pointer' }} href="#" onClick={() => {
                                handleShowModal(record);
                            }}>edit</div>

                        </Space>


                    </div>

                ),
            },
        ];
        const layout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 18 },
        };
        // formRef.current.setFieldsValue(initValues ||{});
        console.log(formRef,"5555",initValues)
        return (
            <div className="newsList" style={{ marginTop: '60px' }}>
                <Search
                    placeholder="input search news"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={onSearch}
                    style={{ width: '360px', margin: '20px 0' }}
                />
                <Table columns={columns} dataSource={dataSource} />
                <Modal title="Basic Modal"
                    visible={isModalVisible}
                    onOk={() => {
                        console.log(formRef.current.validateFields(),'表单提及哦')
                        formRef.current.validateFields().then(values => {
                            formRef.current.resetFields();
                            onOk(values);
                        })
                    }}
                    onCancel={handleCancel} >
                    <Form
                       ref={formRef}
                        {...layout}
                        name="serverDetail"
                        initialValues={initValues}
                    >
                        <Form.Item label="name" name="name" >
                            <Input placeholder="input your name" />
                        </Form.Item>
                        <Form.Item label="news" name="message">
                            <Input  placeholder="input your message"/>
                        </Form.Item>

                    </Form>

                </Modal>
            </div>
        )
    }
}

export default NewsList;

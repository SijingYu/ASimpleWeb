import React from 'react';
import { message, Form, Button, Input, Radio } from 'antd';

class UserLogin extends React.Component {
    state = {
        checkValue:false
    }
    render() {
        const layout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 },
          };
          const tailLayouts = {
            wrapperCol: { offset: 0, span: 24 },
          }
        return (
            <div className="userLogin">
                <Form
                    {...layout}
                    name="basic"
                    ref={this.formRefs}
                    initialValues={{
                        checkValue: 1,
                    }}
                    onFinish={(value) => {
                        if (Object.keys(value).filter(item => !value[item]).length > 0) {
                            message.error('Email or password error')
                        } else {
                            message.success('Login successful')
                            this.props.onFinish();
                        }
                    }}
                >
                    <Form.Item
                        {...tailLayouts}
                        label="Your e-mail:"
                        name="Your e-mail:"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Your e-mail!',
                            },
                            {
                                pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                                message: 'Email format is not correct, please re-enter',
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        {...tailLayouts}
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item {...tailLayouts} name="checkValue">
                        <Radio.Group onChange={(value) => {
                            console.log(value, 'submit');
                            this.setState({
                                checkValue: value.target.value
                            })
                        }} value={this.state.checkValue}>
                            <Radio value={1}>assistant</Radio>
                            <Radio value={2}>student</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item {...tailLayouts} className="btns">
                        <Button type="primary" htmlType="submit">
                            land
        </Button>
                        <Button type="primary" htmlType="submit" onClick={() => {
                            this.formRefs.current.resetFields();
                        }}>
                            reset
        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default UserLogin;

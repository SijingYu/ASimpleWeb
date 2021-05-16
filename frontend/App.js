import React from 'react';
import { Checkbox, Form, Button, Select, Input, Radio, Space, message , Switch } from 'antd';
import UserLogin from "./login";
import NewsList from "./newsList";
import axios from 'axios';
import './App.scss';

const { Option } = Select;
const { Search } = Input;

class App extends React.Component {
  state = {
    value: 1,
    contentArray: [],
    selectOptions1: '',
    name:'',
    weather:null,
    checkValue:1,
    isLogin:true,
    role:1,
    scrollTop:0,
    isSwitch:false,
    initValues:null,
    isModalVisible:false
  }
  formRef = React.createRef();
  formRefs = React.createRef();

  componentDidMount() {
    this.getDataFromDb();
    const city = "GreenBelt";
     const url = `https://api.weatherapi.com/v1/current.json?key=e1134f4f25e3479b87322624202904&q=${city}`;
     fetch(url).then(res => {
       console.log(res,'dsf');
       res.json().then(resJson => {
        console.log(resJson,'fdsfa');
         this.setState({
           weather: resJson

        })
       })
     })
  }

  getDataFromDb = () => {
    const _this = this;
    axios.get('http://localhost:3001/api/getData')
     .then(function (res) {
       console.log(res,'data22')
        if (res.data.success) {
          _this.setState({
            contentArray: res.data.data
          })
        }
      });

  };

  putDataToDB = (message) => {
    let currentIds = this.state.contentArray.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }
    axios.post('http://localhost:3001/api/putData', {
      id: idToBeAdded,
      ...message,
    }).then(response=> {
      console.log(response,'return_data')
      if(response.data.success){
        this.getDataFromDb();
      }
    })

  };

  deleteFromDB = (idTodelete) => {
    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: idTodelete,
      },
    }).then(res=>{
      if(res.data.success){
        message.success('success!');
        this.getDataFromDb();
      }
    });
  };

onSearch=(text)=>{
  axios.get('http://localhost:3001/api/getTextData'+text).then(res=>{
    if(res.data.success){
      this.setState({
        contentArray: res.data.data
      })
    }
  });
}

  render() {
    const layout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };
    const newsListProps = {
      dataSource:this.state.contentArray,
      deleteFromDB:this.deleteFromDB,
      onSearch:this.onSearch,
      isModalVisible:this.state.isModalVisible,
      onOk:(value)=>{
        console.log(value,'data');
        axios.put('http://localhost:3001/api/updateData',{
          // ...this.state.initValues,
          _id:this.state.initValues._id,
          ...value
        }).then(res=>{
          if(res.data.success){
            this.setState({
              isModalVisible:false,
              initValues:null
            });
            message.success('success!');
            this.getDataFromDb();
          }
        });
      },
      initValues:this.state.initValues,
      handleShowModal:(record)=>{
        this.setState({
          initValues:record,
          isModalVisible:true
        })
      },
      handleCancel:()=>{
        this.setState({
          isModalVisible:false,
          initValues:null
        })
      }
    }
    const {weather} = this.state;
    return (
      <div className="App">
        <div className="content">
          <h1 className="title">CMSC999</h1>
          <div className="box">
            <h2>Topics</h2>
            <div>
       { weather? <ul>
                <li><img style={{width:'40px',height:'40px'}} src={weather ? weather.current.condition.icon : ''} alt="" /></li>
               <li>city: { weather ? weather.location.name :'' }</li>
               <li>ptime: { weather ? weather.location.region :''}</li>
               <li>temp1: { weather ? weather.location.temp_c :''}</li>
               <li>temp2: { weather ? weather.location.temp_f :''}</li>
             </ul>
           : <p>No weather information</p>
         }
</div>
            <div className="radiosBox">
              <Checkbox onChange={this.onChange}>logistics</Checkbox>
              <Checkbox onChange={this.onChange}>course material</Checkbox>
              <Select defaultValue="HW" style={{ width: 120 }} onChange={(e) => {
                console.log(e);
                const result = window.prompt("Which problem?");
                this.putDataToDB({
                  type:0,
                  name:'',
                  message:`Problem ${parseInt(result)} ${e}`
                })

              }}>
                <Option value="HW">HW</Option>
                <Option value="HW1">HW1</Option>
                <Option value="HW2" >HW2</Option>
                <Option value="HW3">HW3</Option>
              </Select>
              <Checkbox onChange={this.onChange}>Reach out for anything!</Checkbox>
            </div>
            <div className={this.state.isSwitch ? "content switchBtn":"content"} style={{width:'100%'}}>
            <Switch
            checked={this.state.isSwitch}
             onChange={(e)=>{
              console.log(e,'on or not');
              this.setState({
                isSwitch:e
              })

            }} className="switch" />
              <h3 style={{color:'#000'}}>---- Chat/Answers here ----</h3>
              <div className="container">
              <div className="newsList">
              {
                  this.state.contentArray.length > 0 && this.state.contentArray.map((item, index) => {
                    return <div className={!item.type ? 'item' : (item.type ===1 ? 'item itemL' : 'item itemR')} key={item['_id']}>
                      <div className={!item.type ? 'itemBox' : (item.type ===1 ? 'itemBox itemL' : 'itemBox itemR')}>
                      <span className="name">{item.name ? item.name+'：' : ''}</span>
                      <span className="newsTxt">{item.message || ''}</span>
                      </div>

                    </div>
                  })
                }
                <div style={{ float:"left",clear: "both" }}
            ref={(chatContainer) => this.chatContainer = chatContainer}>
        </div>
              </div>
              </div>
            </div>
            <Form
              {...layout}
              name="basic"
              ref={this.formRef}
              initialValues={null}
              onFinish={(value)=>{
                let html="";
                switch(this.state.value){
                  case 2:
                  html='I guess problems are all solved? Have a great day!'
                  break;
                  case 3:
                    html='Please choose your new topic!'
                  break;
                  case 4:
                    html='Reach me if you dont get it!'
                  break;
                  default:
                    html='Session continued!'
                  break;
                }
                this.putDataToDB({
                  type:0,
                  name:'',
                  message:html
                })

              }}
            >


              <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                <Radio.Group onChange={(e) => {
                  this.setState({
                    value: e.target.value
                  })
                }} value={this.state.value}>
                  <Space direction="Unsolved">
                    <Radio value={1}>Unsolved</Radio>
                    <Radio value={2}>Solved</Radio>
                    <Radio value={3}>Change topics</Radio>
                    <Radio value={4}>Let me think</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Submit

                </Button>
                <Button type="primary" style={{marginLeft:'20px'}} htmlType="button" onClick={() => {
                  // console.log(this.formRef)
                    this.formRef.current.resetFields();
                  }}>Reset</Button>
              </Form.Item>
            </Form>
            <div className="role">
            <Radio.Group onChange={(value)=>{
                this.setState({
                  role:value.target.value
                })
              }}
               value={this.state.role}>
              <Radio value={1}>assistant</Radio>
              <Radio value={2}>student</Radio>
            </Radio.Group>
            </div>

            <div style={{ marginBottom: 16 }}>
              {/* <Input addonBefore="Your name:" defaultValue="" value="" /> */}
              <Search addonBefore="Your name:" placeholder="input your name" enterButton="enter" onSearch={(value)=>{
                this.setState({name:value})
              }} />
            </div>
            <div style={{ marginBottom: 16 }}>
            <Search addonBefore="Your message:" placeholder="input your message" enterButton="send" onSearch={(value)=>{
              this.putDataToDB({
                type:this.state.role,
                name:this.state.name,
                message:value
                })
            }}  />
              {/* <Input addonBefore="Your message:" defaultValue="" value="" /> */}
            </div>
          </div>
         <NewsList {...newsListProps} />
        </div>
        {
          !this.state.isLogin&&<div className="popup">
              <div className="popupBox">
                <UserLogin onFinish={()=>{
                    this.setState({
                      isLogin:true
                    },()=>{
                      this.getDataFromDb();
                    });
                  }} />

              </div>
            </div>
        }

      </div>
    );
  }
}

export default App;

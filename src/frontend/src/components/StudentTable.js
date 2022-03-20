import {useState,useEffect} from 'react';
import {
    Table,
    Spin,
    Button,
    Badge,
    Tag,
    Space,
    Empty,
    Popconfirm} from 'antd';

import {
    LoadingOutlined,
    PlusOutlined
    } from '@ant-design/icons';

import {getAllStudents, deleteStudent} from '../client';
import StudentDrawerForm from  "./StudentDrawerForm";
import {TheAvatar} from './TheAvatar';
import {errorNotification, successNotification} from './Notifications';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export const StudentTable = () => {
    const [students, setStudents] = useState([]);
    const[fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    const columns = [
        {
            title: '',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text, student) => <TheAvatar name = {student.name}/>
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
          title: 'Actions',
          key: 'actions',
          render: (text, record) => (
            <Space size="middle">
                <Popconfirm 
                    title = {`Are you sure to delete student ${record.id}`}
                    onConfirm={()=>deleteStudent(record.id)
                        .then(()=>{
                            successNotification(
                                "Student is deleted succesfully",
                                `${record.name} was deleted from the system`
                            );
                            fetchStudents();
                        }).catch(err=>{
                            console.log(err.response);
                            err.response.json().then(res => {
                                console.log(res);
                                errorNotification(
                                    "There was an issue",
                                    `${res.message} [statusCode: ${res.status}] [${res.error}]`
                                )
                            });
                        })} 
                    okText="Yes" 
                    cancelText="No"
                >
                    <Button type="primary" danger>
                        Delete
                    </Button>
                </Popconfirm>
                
                <Button type="primary">Edit</Button>
            </Space>
          ),
        }
    ];

    const fetchStudents = () =>
        getAllStudents()
          .then(res => res.json())
          .then(data => {
              setStudents(data);
          }).catch(err => {
              console.log(err.response);
              err.response.json().then(res => {
                  console.log(res);
                  errorNotification(
                      "There was an issue",
                      `${res.message} [statusCode: ${res.status}] [${res.error}]`
                  )
              });
          }).finally(()=> setFetching(false));

    // run the getAllStudents only once when the app is loaded
    useEffect(() => {
        // console.log("component is mounted");
        fetchStudents();
    }, []);

    const renderStudents = students => {
        if(fetching) {
            return <Spin indicator={antIcon} />;
        }
        if(students.length <= 0) {
            return <>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents = {fetchStudents}
                    />
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary"
                    shape="round"
                    icon={<PlusOutlined />}
                    size="medium">
                  Add New Student
                </Button>
                <Empty />
            </>;
        } else {
            return <>
            <StudentDrawerForm
              showDrawer={showDrawer}
              setShowDrawer={setShowDrawer}
              fetchStudents = {fetchStudents}
            />
            <Table
              dataSource={students}
              columns={columns}
              bordered
              title={() =>
                <> 
                  <Tag style={{marginBottom: '10px'}}>Number of students</Tag>
                  <Badge count={students.length} className="site-badge-count-4"/>
                  <br></br>
                  <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary"
                    shape="round"
                    icon={<PlusOutlined />}
                    size="medium">
                  Add New Student
                  </Button>
                </>}
              pagination={{ pageSize: 50 }}
              scroll={{ y: 240 }}
              rowKey = {(student) => student.id}/>
            </>
        }
    }

    return renderStudents(students)
}
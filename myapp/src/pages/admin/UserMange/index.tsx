import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable, TableDropdown} from '@ant-design/pro-components';
import {Image} from 'antd';
import {useRef} from 'react';
import {searchUser} from "@/services/ant-design-pro/api";


// 定义一个等待时间的方法，参数为等待时间（默认为100毫秒）
export const waitTimePromise = async (time: number = 10000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
// 定义一个等待时间的方法，调用waitTimePromise方法
export const waitTime = async (time: number = 10000) => {
  await waitTimePromise(time);
};


//使用CurrentUser对象属性 , 各个属性对应着后台数据表的字段 ,
// 定义表格列配置数组，包括索引、标题、状态、标签、创建时间、操作等字段
// 属性
// copyable:true, 出现可复制的小按钮
// ellipsis:true,  可缩略 , 太长不显示
// valueType: 用于声明这一列类型
//       -data  显示年月日
//       -dateTime 显示年月日 时分秒
// valueEnum: 枚举 0女 1男
const columns: ProColumns<API.CurrentUser>[] = [
  {
    title:'序号',
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 60,
  },
  {
    title:'用户名',
    dataIndex: 'username',
    width: 80,
  },
  {
    title:'用户账户',
    dataIndex: 'userAccount',
    ellipsis:true,
    width: 80,
  },
  {
    title:'头像',
    dataIndex: 'avatarUrl',
    //第一个参数随便填(列) , 第二个参数(行)record得到这一行用户的所有数据 , JSON.stringify(record)可以查看
    //
    render:(a,record)=> (

      <div>
        <Image src={record.avatarUrl} width={60} />
        {/*{JSON.stringify(a) } http:xxx\xxx*/}
        {/*{JSON.stringify(record) }*/}
        {/*{"id":21,"username":"root","userAccount":"root","avatarUrl":"http:xxx\xxx","gender":1,*/}
        {/*  "userPassword":"11b6d333564fc89d68c23d9f8556fa0b","email":"2898408767@qq.com","userStatus":0,*/}
        {/*  "phone":"17603346177","createTime":"2023-11-25T16:24:15.000+00:00","updateTime":"2023-12-09T16:20:17.000+00:00",*/}
        {/*  "isDelete":0}*/}
      </div>
    ),
    width: 100,
  },
  {
    title:'性别',
    dataIndex: 'gender',
    valueEnum: {
      0 : {text:'女' , status:'Success' } ,
      1 : {text:'男',  status:'Success'} ,
    },
    width: 70,
  },
  {
    title:'电话',
    dataIndex: 'phone',
    copyable:true,
    width: 140,
  },
  {
    title:'邮箱',
    dataIndex: 'email',
    copyable:true,
    ellipsis:true,
    width: 200,
  },
  {
    title:'用户状态',
    dataIndex: 'userStatus',
    valueEnum: {
      0 : {text:'启用' , status:'Success' } ,
      1 : {text:'禁用',  status:'Error'} ,
    },
    width: 110,
  },
  {
    title:'创建时间',
    dataIndex: 'createTime',
    ellipsis:true,
    valueType:'date',
    width: 120,
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
      >
        编辑
      </a>,
      <a href={record.avatarUrl} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
          key="actionGroup"
          onSelect={() => action?.reload()}
          menus={[
            { key: 'copy', name: '复制' },
            { key: 'delete', name: '删除' },
          ]}
      />,
    ],
  },
];

// 导出默认组件，使用ProTable组件展示数据，并配置相关属性
export default () => {
  const actionRef = useRef<ActionType>();
  return (
      <ProTable<API.CurrentUser>
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={async (params = {}, sort, filter) => {
            console.log(sort, filter);
            const userList = await searchUser();
            return {
              data: userList
            }
          }}

          editable={{
            type: 'multiple',
          }}
          columnsState={{
            persistenceKey: 'pro-table-singe-demos',
            persistenceType: 'localStorage',
            onChange(value) {
              console.log('value: ', value);
            },
          }}
          rowKey="id"
          search={{
            labelWidth: 'auto',
          }}

          form={{
            // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
            syncToUrl: (values, type) => {
              if (type === 'get') {
                return {
                  ...values,
                  created_at: [values.startTime, values.endTime],
                };
              }
              return values;
            },
          }}
          pagination={{
            pageSize: 5,
            onChange: (page) => console.log(page),
          }}
          dateFormatter="string"
          headerTitle="用户信息"
      />
  );
};

import React , { useRef , useEffect } from 'react'
import { Space, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
// import { Toast } from 'primereact/toast';
 



const antIcon = <LoadingOutlined style={{ fontSize: 40 ,color:'#302AED'}} spin />;
const Loading = ({content}:{content?:any}) => {
  // const {msg} = useAppSelector((state)=>state.msg)
  // const toast = useRef<Toast>(null);
  // const dispatch = useAppDispatch()

  // useEffect(()=>{
  //   console.log('MSG IN LOADER:' , msg)
  //   if(msg.isMsg){
  //     toast.current?.show({ severity: 'success', summary: 'Successful', detail: `${msg.msgBody}`, life: 3000  }) 
  //     dispatch(resetMsg());
  //   }
  // } , [ msg.isMsg ] )


  return (    
    <div className="cover-spin">
      <Space size="middle" >
        <Spin size="large" indicator={antIcon} />
        {content}
      </Space>
    </div>
  )
}

export default Loading

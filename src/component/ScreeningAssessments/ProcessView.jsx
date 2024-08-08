import { Tabs } from 'antd'
import Stage1Component from './Stages/Stage1Component'
import Stage2Component from './Stages/Stage2Component'
import Stage3Component from './Stages/Stage3Component'
import Stage4Component from './Stages/Stage4Component'
import Stage5Component from './Stages/Stage5Component'
import { useLocation } from 'react-router-dom'

const ProcessView = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const collegeName = params.get('collegeName');
  return (
    <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-100%'>
      <div className='flex justify-start items-center mt-2 mb-3'>
        <h2 className={`text-2xl text-[#0087D5] font-bold`}>
          Recruitment Process Overview - 
        </h2>
        <p className={`text-2xl font-semibold`}>&nbsp;{collegeName}</p>
      </div>
      <div className='w-full mx-auto mt-3'>
        <Tabs defaultActiveKey='1'>
          <Tabs.TabPane tab='Online Asssessment' key='1'>
            <Stage1Component />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Design Round' key='2'>
            <Stage2Component />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Technical & Behavioural Interview' key='3'>
            <Stage3Component />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Optional Round' key='4'>
            <Stage4Component />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Final Selected' key='5'>
            <Stage5Component />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default ProcessView

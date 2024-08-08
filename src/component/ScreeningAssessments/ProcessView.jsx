import { Tabs } from 'antd';
import Stage1Component from './Stages/Stage1Component';
import Stage2Component from './Stages/Stage1Component';
import Stage3Component from './Stages/Stage1Component';
import Stage4Component from './Stages/Stage1Component';
import Stage5Component from './Stages/Stage1Component';



const ProcessView = () => {
  console.log('====================================');
  console.log("hello");
  console.log('====================================');
  return (
    <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-100%'>
      <div className='flex justify-between mt-2'>
        <h2 className={`text-2xl text-[#0087D5] font-bold mb-3`}>
          5-Stage Process
        </h2>
      </div>
      <div className='w-full mx-auto'>
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
  );
};

export default ProcessView;
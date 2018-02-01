import React from 'react';
import { Avatar,Icon,Button,Card } from 'antd';

let Preview = ({
  modals,
  }) => {
  return (
      <Card title="Result">
        <div className="p25 text-center">
          <Icon className="fs60" type="check-circle"></Icon>
          <div className="fs20 color-grey-900">
            Send Completed
          </div>
          <div className="fs14 color-grey-900">
            You have successfully sent 1000 LRC (USD 5880)
          </div>
        </div> 
        <div className="row pt40">
          <div className="col pr0">
            <Button className="d-block w-100" type="primary" size="large">Send Again</Button>
          </div>
        </div>
      </Card>
  );
};


export default Preview;

 

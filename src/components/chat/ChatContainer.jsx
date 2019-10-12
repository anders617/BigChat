import React from 'react';
import { Card, CardBody } from 'shards-react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';


export default class ChatContainer extends React.Component {
    render() {
        return (
          <div className="ChatContainer">
            <Card>
              <CardBody>
                Nunc quis nisl ac justo elementum sagittis in quis justo.
              </CardBody>
            </Card>
          </div>
        );
    }
}
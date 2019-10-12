import React from 'react';
import {
  Button,
  InputGroup,
  InputGroupAddon,
  FormTextarea,
} from 'shards-react';

export default function TextBar({ handleChange, handleSubmit, value }) {
  return (
    <div className="TextBar" style={{ display: 'flex' }}>
      <InputGroup>
        <FormTextarea onChange={handleChange} value={value} />
        <InputGroupAddon type="append">
          <Button onClick={handleSubmit} type="submit" theme="primary">
            Send
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

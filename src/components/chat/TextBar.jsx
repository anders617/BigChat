import React from 'react';
import {
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  FormTextarea
} from 'shards-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

export default function TextBar({ handleChange, handleKeyPress, handleSubmit, value }) {
  return (
    <div className="TextBar" style={{ display: 'flex' }}>
      <InputGroup seamless>
        <FormTextarea
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          value={value}
        />
        <InputGroupAddon type="append">
          <InputGroupText onClick={handleSubmit}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

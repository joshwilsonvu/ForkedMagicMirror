import React, { useState, useEffect } from 'react';
import { Fader } from '@mm/core';

export default ({ text }) => {
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setToggle(t => !t), 5000);
    return () => clearInterval(id);
  }, []);
  return (
    <div>
      {toggle ? 'Hi there' : 'Hello there!'}
    </div>
  );
}
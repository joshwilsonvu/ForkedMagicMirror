import React, { useState, useEffect } from 'react';
import { Fader } from '@mm/core';

export default () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount(c => c + 1), 800);
    return () => clearInterval(id);
  }, []);
  return count % 5 !== 0 ? (
    <div>
      {count}
    </div>
  ) : null;
}
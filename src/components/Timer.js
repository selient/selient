import React, { useState, useEffect } from 'react';

function CountdownTimer() {
  const [time, setTime] = useState(45 * 1000); // Initial time in milliseconds

  useEffect(() => {
    // Start the countdown
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 10); // Decrease time by 1 second (1000 milliseconds)
    }, 10);

    // Clean up the timer when the component unmounts
    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms) => {
    const minutes = Math.floor((ms / 1000 / 60) % 60).toString().padStart(2, '0');
    const seconds = Math.floor((ms / 1000) % 60).toString().padStart(2, '0');
    const milliseconds = Math.floor((ms % 1000) / 16.67).toString().padStart(2, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  return (
    <div>
      <h1>Countdown Timer</h1>
      <p>{formatTime(time)}</p>
    </div>
  );
}

export default CountdownTimer;

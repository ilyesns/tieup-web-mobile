import React from "react";

const TimeLeft = ({ createdAt }) => {
  const calculateTimeLeft = () => {
    const createdAtDate = new Date(
      createdAt._seconds * 1000 + createdAt._nanoseconds / 1000000
    );

    const difference = Date.now() - createdAtDate.getTime();

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      return { days, hours, minutes, seconds };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  };

  const { days, hours, minutes, seconds } = calculateTimeLeft();

  return <div>{days} days left</div>;
};

export default TimeLeft;

import React from "react";

interface TimestampObject {
  _seconds: number;
  _nanoseconds: number;
}

type Timestamp = TimestampObject | number;

interface Props {
  timestamp: Timestamp;
}

const DateTimeDisplay: React.FC<Props> = ({ timestamp }) => {
  let milliseconds: number;

  if (typeof timestamp === "object") {
    milliseconds =
      (timestamp as TimestampObject)._seconds * 1000 +
      Math.round((timestamp as TimestampObject)._nanoseconds / 1000000);
  } else {
    milliseconds = timestamp;
  }

  const date = new Date(milliseconds);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDateTime = date.toLocaleString(undefined, options);

  return <span>{formattedDateTime}</span>;
};

export default DateTimeDisplay;

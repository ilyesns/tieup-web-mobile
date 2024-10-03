import React from "react";

const TimestampToDate = ({ timestamp }) => {
  // Convert Firestore Timestamp to JavaScript Date object
  const dateObject = new Date(
    timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
  );

  // Get month and day
  const month = dateObject.toLocaleString("default", { month: "long" });
  const day = dateObject.getDate();

  return (
    <div className="flex gap-2 ">
      <p className="first-letter:uppercase"> {month} </p>
      <p>{day}</p>
    </div>
  );
};

export default TimestampToDate;

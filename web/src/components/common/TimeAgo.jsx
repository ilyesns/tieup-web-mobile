export const TimeAgo = ({ time }) => {
  const getTimeAgo = (timestamp) => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const messageTimestamp = timestamp._seconds;

    const diffInSeconds = currentTimestamp - messageTimestamp;

    // Calculate the time ago based on the difference in seconds
    // For simplicity, this example only considers minutes and hours
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years} year${years !== 1 ? "s" : ""} ago`;
    }
  };

  return <span>{getTimeAgo(time)}</span>;
};
export const TimeAgoMessage = ({ time }) => {
  const getTimeAgo = (timestamp) => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const messageTimestamp = timestamp.seconds;

    const diffInSeconds = currentTimestamp - messageTimestamp;

    // Calculate the time ago based on the difference in seconds
    // For simplicity, this example only considers minutes and hours
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years} year${years !== 1 ? "s" : ""} ago`;
    }
  };

  return <span>{getTimeAgo(time)}</span>;
};

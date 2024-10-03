const SizeConverter = ({ sizeInBytes }) => {
  const bytesToMB = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2);
  };

  return (
    <div>
      <p>Size in MB: {bytesToMB(sizeInBytes)}</p>
    </div>
  );
};

export default SizeConverter;

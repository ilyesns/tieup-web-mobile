import loadingImage from "../assets/images/Logo.png";
const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <img src={loadingImage}></img>
    </div>
  );
};

export default LoadingPage;

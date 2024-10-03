export const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-grow items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-4xl font-bold">401</h1>
        <p className="text-gray-600">
          Oops! t the request has not been applied because it lacks valid
          authentication credentials for the target resource.
        </p>
        <a
          href="/login"
          className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
        >
          {" "}
          Go back to Home{" "}
        </a>
      </div>
    </div>
  );
};

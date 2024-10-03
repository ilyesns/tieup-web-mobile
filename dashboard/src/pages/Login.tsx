import { useForm } from "react-hook-form";
import Logo from "../assets/images/Logo.png";
import { signInWithCredentials } from "../firebase_auth/firebase_auth";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase_config";

type FormFields = {
  email: string;
  password: string;
};
export const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();
  const navigate = useNavigate();
  const onSubmit = async (data: FormFields) => {
    try {
      await signInWithCredentials(data.email, data.password);
      navigate("/", { replace: true });
    } catch (e) {
      setError("root", {
        message: "Invalid email / password",
      });
    }
  };
  return (
    <>
      <section className="bg-gray-50 ">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="flex items-center mb-6  font-semibold text-gray-900 ">
            <img className="w-32 h-32 mr-2" src={Logo} alt="logo" />
          </div>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                Sign in to your account
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="text"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    placeholder="name@company.com"
                    {...register("email", {
                      required: "Please type your email",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for general email validation
                        message: "Invalid email address",
                      },
                    })}
                  />
                </div>
                {errors.email?.message && (
                  <p className="text-red-600">{errors.email.message}</p>
                )}
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    {...register("password", {
                      required: "Please type your password",
                    })}
                  />
                </div>
                {errors.password?.message && (
                  <p className="text-red-600">{errors.password.message}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                >
                  {isSubmitting ? "Signining..." : "Sign in"}
                </button>
                {errors.root?.message && (
                  <p className="text-red-600">{errors.root.message}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

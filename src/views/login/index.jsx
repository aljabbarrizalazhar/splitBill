import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { doSignIn } from '../../firebase/auth';
import { LoadingContext } from '../../contexts/LoadingContext';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import LoadingComponent from '../../atoms/LoadingAtoms';

const Login = () => {
  const { loading, toggleLoading } = useContext(LoadingContext);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { register, handleSubmit, formState: { errors }} = useForm();

  const onSubmit = async (data) => {
    toggleLoading(true);

    try {
        if (!isSigningIn) {
            setIsSigningIn(true);
            await doSignIn(data.email, data.password);
            Swal.fire({
              icon: 'success',
              title: 'Login Berhasil',
              text: 'Anda berhasil login',
              showConfirmButton: false,
              timer: 1500
            });
        }
    } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: 'Kami tidak dapat mengenali informasi yang anda berikan, Periksa kembali email atau password anda!',
          showConfirmButton: true,
          confirmButtonText: 'Mengerti',
        });
        console.log(error.message)
    } finally {
        toggleLoading(false);
        setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-primary flex justify-center items-center ">
      <LoadingComponent loading={loading}/>
      <div className="flex md:flex-row flex-col w-5/6 md:w-full max-w-4xl p-4 md:p-8 space-y-2 md:space-y-6 bg-white shadow-md rounded-lg">
          <div className="w-fit flex">
            <img 
            src="/image/logo.png" 
            alt="Login Image" 
            className="h-full w-fit object-cover rounded-lg flex-grow"/>
          </div>
          <div className="w-full md:w-1/2 p-6 space-y-6 md:pl-20">
            <h2 className="text-2xl font-bold text-center md:-mt-3">Masuk</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email diperlukan",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Mohon masukkan email yang valid",
                    },
                  })}
                  className={`w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.email ? "border-red-600" : "border-gray-300"
                  }`}
                  placeholder="Masukkan email"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password diperlukan",
                  })}
                  className={`w-full mt-1 px-3 py-2 border ${errors.password ? "border-red-600" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Masukan kata sandi"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-secondary text-white font-medium rounded-lg hover:bg-yellow-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Masuk
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 -mt-3">
                  Belum punya akun?{' '}
                  <Link to="/register" className="text-blue-400 hover:text-indigo-500 hover:underline">
                    Daftar disini
                  </Link>
                </p>
              </div>
            </form>
          </div>
      </div>
    </div>
  );
};

export default Login;

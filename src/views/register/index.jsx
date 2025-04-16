import { useContext } from 'react';
import { doCreateUser } from '../../firebase/auth';
import { addUser } from '../../services/controllers/userController';
import { LoadingContext } from '../../contexts/LoadingContext';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import LoadingComponent from '../../atoms/LoadingAtoms';
import { Link } from 'react-router-dom';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch} = useForm();
  const password = watch('password');
  const { loading, toggleLoading } = useContext(LoadingContext);

  const onSubmit = async (data) => {
    toggleLoading(true);

    try {
        const userCredential = await doCreateUser(data.email, data.password, data.name);
        
        Swal.fire({
            icon: 'success',
            title: 'Daftar Berhasil',
            text: 'Daftar berhasil, Akun baru telah didaftarkan',
            showConfirmButton: false,
            timer: 1500
          });

        const { user } = userCredential;

        await addUser(user.uid, data.name, user.email);

          
        toggleLoading(false);

    } catch (error) {
        toggleLoading(false);
        console.log(error);
        let message = error.message;
        if(error.message === "Firebase: Error (auth/email-already-in-use)."){
            message = "Email yang anda masukan telah terdaftar";
        };
        Swal.fire({
            icon: 'error',
            title: 'Daftar Gagal',
            text: `${message}`,
            showConfirmButton: true,
            confirmButtonText: 'Mengerti',
          });
    }   
};


  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-primary">
        <LoadingComponent loading={loading}/>
        <div className="flex md:flex-row flex-col w-5/6 md:w-full max-w-4xl space-y-3 p-3 md:space-y-2 bg-white shadow-md rounded-lg">
        
        <div className="flex w-fit">
        <img src="/image/logo.png" 
        alt="Login Image" 
        className="h-full w-full bg-cover bg-center bg-no-repeat object-cover rounded-lg p-4"/>
    </div>

    <div className="w-full md:w-1/2 p-6 space-y-6 md:pl-10">
        <h2 className="text-2xl font-bold text-center mb-4">Daftar</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-2">
            <label className="block mb-2">Nama</label>
            <input
              type="text"
              {...register('name', {
                required: 'Nama diperlukan',
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: 'Nama hanya boleh berisi huruf dan spasi',
                },
              })}
              className={`w-full p-2 border rounded-lg ${
                errors.name ? 'border-red-600' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama"
            />
            {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-2">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email diperlukan',
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: 'Mohon masukkan email yang valid',
                },
              })}
              className={`w-full p-2 border rounded-lg ${
                errors.email ? 'border-red-600' : 'border-gray-300'
              }`}
              placeholder="Masukkan email"
            />
            {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-2">
            <label className="block mb-2">Kata Sandi</label>
            <input
              type="password"
              {...register('password', {
                required: 'Kata sandi diperlukan',
                minLength: {
                  value: 6,
                  message: 'Kata sandi harus minimal 6 karakter',
                },
              })}
              className={`w-full p-2 border rounded-lg ${
                errors.password ? 'border-red-600' : 'border-gray-300'
              }`}
              placeholder="Masukkan kata sandi"
            />
            {errors.password && (
             <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Konfirmasi Kata Sandi</label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Konfirmasi kata sandi diperlukan',
                validate: (value) =>
                  value === password || 'Konfirmasi kata sandi tidak sama dengan kata sandi',
              })}
              className={`w-full p-2 border rounded-lg ${
                errors.confirmPassword ? 'border-red-600' : 'border-gray-300'
              }`}
              placeholder="Masukkan konfirmasi kata sandi"
            />
            {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-secondary text-white p-2 rounded hover:bg-yellow-900 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link to={'/login'}>
                <span  className="text-blue-400 hover:text-indigo-500 hover:underline">
                Masuk disini
                </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Register;

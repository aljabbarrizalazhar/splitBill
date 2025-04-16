
import { useContext} from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { updateUserName } from "../../firebase/auth";
import { changeUserPassword } from "../../firebase/auth";
import Swal from "sweetalert2";
import LoadingComponent from "../../atoms/LoadingAtoms";
import { LoadingContext } from '../../contexts/LoadingContext';
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function Profile() {
const { currentUser } = useContext(AuthContext);
const { loading, toggleLoading } = useContext(LoadingContext);
const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: currentUser.email,
      name: currentUser.displayName,
      uid: currentUser.uid
    }
  });

const { register: registerFormPassword, handleSubmit: handleSubmitPassword, formState: { errors: errorsFormPassword }, watch} = useForm({
defaultValues: {
    password: '',  
    newPassword: '',
    newConfirmPassword: '',
    uid: currentUser.uid
}
});
const newPassword = watch('newPassword');

  const handleSaveUpdateName = async (data) => {
    toggleLoading(true);
   
    try {
        if(data.name !== currentUser.displayName){
            await updateUserName(data.name, data.uid);
        }
        toggleLoading(false);
        Swal.fire({
            icon: 'success',
            title: 'Berhasil Mengubah Nama',
            text: 'Nama Lengkap Pengguna berhasil diperbarui',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => {
            window.location.replace(`/profile`);
        }, 1500);
    } catch (error) {
        toggleLoading(false);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Mengubah Nama',
            text: `${error.message}`,
            showConfirmButton: true,
            confirmButtonText: 'Mengerti',
          });
    }  
 };

 const handleSaveUpdatePassword = async (data) => {
    toggleLoading(true);
    try {
        if(data.name !== currentUser.displayName){
            await changeUserPassword(data.uid, data.password, data.newPassword);
        }
        toggleLoading(false);
        Swal.fire({
            icon: 'success',
            title: 'Berhasil Mengubah Password',
            text: 'Password pengguna berhasil diperbarui',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => {
            window.location.replace(`/profile`);
        }, 1500);
    } catch (error) {
        toggleLoading(false);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Mengubah Nama',
            text: `${error.message}`,
            showConfirmButton: true,
            confirmButtonText: 'Mengerti',
          });
    }  
 };


return (
    <div className="min-h-screen bg-primary flex flex-row items-start justify-center gap-4">
        <LoadingComponent loading={loading}/>
      <div className="bg-white shadow-md rounded-lg p-6 md:p-8 max-w-xl md:max-w-3xl w-full">
        <h1 className="mb-2 mt-0 text-xl font-medium leading-tight text-gray-700 border-b-2 py-3">
        Profil Pengguna
        </h1>      
      <form onSubmit={handleSubmit(handleSaveUpdateName)} className="space-y-4 my-2" noValidate>
        <div className="flex-2 w-full">
            <label htmlFor={`percentage`} className="block text-sm sm:text-base font-medium text-gray-700">
                Email
            </label>  
            <input type="text"
                {...register("email", { required: true })} 
                className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled>
            </input>
        </div>  
        <div className="flex flex-col my-2 sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-2">
            <div className="flex-2 w-full">
                <label htmlFor={`name`} className="block text-sm sm:text-base font-medium text-gray-700">
                    Nama Lengkap
                </label>
                <input
                type="text"
                id="name"
                {...register('name', {
                    required: 'Nama diperlukan',
                    pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message: 'Nama hanya boleh berisi huruf dan spasi',
                    },
                    })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
                />
                 {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
            </div>
            <div className='flex-1 self-start sm:self-end'>
                <button
                type="submit"
                className="bg-secondary text-white p-2.5 rounded-md  hover:bg-yellow-900 transition duration-200"
                >
                Simpan
                </button>
            </div>
        </div>
      </form>

      <h1 className="mb-2 text-xl font-medium leading-tight text-gray-700 border-b-2 py-3 mt-6">
       Ubah Password
        </h1>   

      <form onSubmit={handleSubmitPassword(handleSaveUpdatePassword)} className="space-y-4 my-2" noValidate>
        <div className="w-full">
            <label htmlFor={`password`} className="block text-sm sm:text-base font-medium text-gray-700">
                Password Lama
            </label>
            <input
            type="password"
            {...registerFormPassword("password", {
                required: "Password diperlukan",
              })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
            />
             {errorsFormPassword.password && (
                <p className="text-red-600 text-sm mt-1">{errorsFormPassword.password.message}</p>
                )}
        </div>
        <div className="flex flex-col my-2 sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-2">
            <div className="flex-2 w-full">
                <label htmlFor={`newPassword`} className="block text-sm sm:text-base font-medium text-gray-700">
                    Password Baru
                </label>
                <input
                type="password"
                id={`newPassword`}
                {...registerFormPassword('newPassword', {
                    required: 'Kata sandi baru diperlukan',
                    minLength: {
                      value: 6,
                      message: 'Kata sandi baru harus minimal 6 karakter',
                    },
                  })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
                />
                 {errorsFormPassword.newPassword && (
                    <p className="text-red-600 text-sm mt-1">{errorsFormPassword.newPassword.message}</p>
                    )}
            </div>
            <div className="flex-2 w-full">
                <label htmlFor={`percentage`} className="block text-sm sm:text-base font-medium text-gray-700">
                    Konfirmasi Password Baru
                </label>
                <input
                type="password"
                {...registerFormPassword('newConfirmPassword', {
                  required: 'Konfirmasi kata sandi baru diperlukan',
                  validate: (value) =>
                    value === newPassword || 'Konfirmasi kata sandi baru tidak sama dengan kata sandi baru',
                })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
                />
                {errorsFormPassword.newConfirmPassword && (
                <p className="text-red-600 text-sm mt-1">{errorsFormPassword.newConfirmPassword.message}</p>
            )}
            </div>
            <div className='flex-1 self-start sm:self-end'>
                <button
                type="submit"
                className="bg-secondary text-white p-2.5 rounded-md  hover:bg-yellow-900 transition duration-200"
                >
                Simpan
                </button>
            </div>
        </div>
      </form>
      <Link to={`/main`}> 
            <button 
                className="w-full bg-gray-500 text-white p-2 mt-8 rounded-md hover:bg-gray-600 transition duration-200"
            >
                Kembali
            </button>
        </Link>
      </div>
    </div>
  );
}

export default Profile

import React, {  useContext } from 'react';
import { LoadingContext } from '../../contexts/LoadingContext';
import { AuthContext } from "../../contexts/AuthContext";
import LoadingComponent from '../../atoms/LoadingAtoms';
import { useNavigate, Link } from 'react-router-dom';
import { SplitBillContext } from '../../contexts/SplitBillContext';
import { formatRupiah } from '../../services/utils/formatRupiah';
import Swal from 'sweetalert2';
import { useForm, Controller  } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';


const SplitBillMethod = () => {
    const {splitBill, updateSplitBill } = useContext(SplitBillContext);
    const { register, control, getValues, handleSubmit, watch, formState: { errors }, setValue } = useForm({
        defaultValues: {
          title: splitBill.title,
          totalAmount: splitBill.totalAmount,
          splitMethod: splitBill.splitMethod,
        }
      });
    const { loading, toggleLoading } = useContext(LoadingContext);
    const { currentUser } = useContext(AuthContext);
    const totalAmount = watch("totalAmount", '');
    const navigate = useNavigate();

    const handleSave = async (data) => {
        toggleLoading(true);
        updateSplitBill({title: data.title,  totalAmount: Number(data.totalAmount), splitMethod: data.splitMethod, createdBy: currentUser.uid});
        toggleLoading(false);
        navigate(`/split-bill/member/add`);
    };

    const onGoHome = () => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Anda akan dialihkan ke halaman utama setelah menekan tombol "Ya"',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Batal'
          }).then((result) => {
            if (result.value) {
                navigate('/');
            } 
          })
    }

    return (
        <div className="bg-primary flex items-center justify-center min-h-screen p-4">
            <div className="bg-white max-w-lg w-full p-6 border rounded-lg">
              <div  className="flex w-full justify-end bg-white rounded-full">
                <button onClick={onGoHome} className="bg-white rounded-full p-2 hover:bg-gray-100 transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className='h-6 w-6' fill='#EE4E4E'><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                    
                </button>
              </div>
                <LoadingComponent loading={loading}/>
                <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-2">Formulir Split Bill</h2>
                <ol className="flex mx-auto items-center justify-center w-full p-3 space-x-1 md:space-x-2 -ml-1 mb-2 text-[12px] md:text-sm font-medium text-gray-500 bg-white borderrounded-lg dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-6 sm:space-x-5 rtl:space-x-reverse">
                    <li className="flex items-center text-blue-600 dark:text-blue-500">
                        <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
                            1
                        </span>
                        Informasi
                        <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/>
                        </svg>
                    </li>
                    <li className="flex items-center">
                        <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                            2
                        </span>
                        Anggota
                        <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/>
                        </svg>
                    </li>
                    <li className="flex items-center">
                        <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                            3
                        </span>
                        Pembayaran
                    </li>
                </ol>
                <form onSubmit={handleSubmit(handleSave)} className="space-y-4" noValidate>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Split Bill</label>
                        <input
                            type="text"
                            id="title"
                            {...register("title", { required: true })}
                            placeholder='Masukkan judul split bill'
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 placeholder:text-sm"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">Judul Split Bill wajib diisi</p>}
                    </div>
                    <div>
                        <label htmlFor="splitMethod" className="block text-sm font-medium text-gray-700">Metode Split Bill</label>
                        <select
                            id="splitMethod"
                            {...register("splitMethod", { required: true })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
                        >   
                            <option value="">-- Pilih Metode --</option>
                            <option value="Equal Split">Bagi Rata</option>
                            <option value="Split by Percentage">Sesuai Persentase</option>
                            <option value="Split by Order">Sesuai Porsi</option>
                        </select>
                        {errors.splitMethod && <p className="text-red-500 text-sm mt-1">Metode Split Bill harus dipilih</p>}
                    </div>
                    <div>
                        <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">Total Split Bill</label>
                        <Controller
                            name="totalAmount"
                            control={control}
                            rules={{
                                required: "Total Split Bill harus diisi",
                                validate: (value) => value > 0 || "Total Split Bill harus lebih besar dari 0"
                            }}
                            render={({ field }) => (
                                <NumericFormat
                                    id="totalAmount"
                                    placeholder="Masukkan total split bill"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 placeholder:text-sm"
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    defaultValue={Number(getValues(`totalAmount`))}
                                    allowNegative={false}
                                    onValueChange={(values) => {
                                        field.onChange(values.value); 
                                    }}
                                />
                            )}
                        />
                        {errors.totalAmount && <p className="text-red-500 text-sm mt-1"> {String(errors.totalAmount?.message)}</p>}
                        <p className="mt-1 text-xs sm:text-sm text-gray-500">{formatRupiah(Number(getValues(`totalAmount`)))}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-2">
                        <Link to={`/main`} className='w-full'> 
                            <button 
                                className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition duration-200"
                            >
                                Kembali
                            </button>
                        </Link>
                        <button
                            type="submit"
                            className="w-full bg-secondary text-white p-2 rounded-md hover:bg-yellow-900 transition duration-200"
                        >
                            Selanjutnya
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SplitBillMethod;

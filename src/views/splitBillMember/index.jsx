import  { useContext, useState, useEffect } from 'react';
import {  Link, useNavigate } from 'react-router-dom';
import { LoadingContext } from '../../contexts/LoadingContext';
import { SplitBillContext } from '../../contexts/SplitBillContext';
import LoadingComponent from '../../atoms/LoadingAtoms';
import useRedirectIfEmptySplitBill from '../../hooks/useRedirectEmptySplitBill';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { formatRupiah } from '../../services/utils/formatRupiah';
import Swal from 'sweetalert2';
import splitMethodLabels from '../../assets/data/splitMethodLabels';

const SplitBillMember = () => {
    
    const {splitBill, updateMembersSplitBill} = useContext(SplitBillContext);
    const { register, control, handleSubmit, formState: { errors }, getValues, watch } = useForm({
        defaultValues: {
          members: splitBill.members || [{ name: "", percentage: "", amountToPay: "" }], 
          totalMember: splitBill.member, 
        }
      });
    const { fields, append, remove } = useFieldArray({
      control, 
      name: 'members'
    });
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalPercentage, setTotalPersentage] = useState(0);
    const watchAmountToPay = watch(fields.map((_, index) => `members.${index}.amountToPay`));
    const watchPercentage = watch(fields.map((_, index) => `members.${index}.percentage`));
    const { loading, toggleLoading } = useContext(LoadingContext);
    const navigate = useNavigate();
    useRedirectIfEmptySplitBill(splitBill);


    const handleAddMember =  () => {
      const totalAmountToPay = getValues('members').reduce((total, member) => total + parseFloat(member.amountToPay || 0), 0);
      const totalPercentageToPay = getValues('members').reduce((total, member) => total + parseFloat(member.percentage || 0), 0);
      if(splitBill.splitMethod === "Split by Order"){
        append({ name: "", amountToPay: Number(splitBill.totalAmount)-totalAmountToPay });
      }else if (splitBill.splitMethod === "Split by Percentage"){
        append({ name: "", percentage: 100 - totalPercentageToPay });
      }
    }

    const handleSave =  (data) => {
        toggleLoading(true);
        const totalAmountToPay = data.members.reduce((total, member) => total + parseFloat(member.amountToPay || 0), 0);
        const totalPercentage = data.members.reduce((total, member) => total + parseFloat(member.percentage || 0), 0);

        if (splitBill.splitMethod === "Split by Percentage" && totalPercentage !== 100) {
            toggleLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menambahkan Anggota Split Bill',
                text: `Total persentase dari seluruh anggota harus 100%, Total persentase yang anda masukan adalah ${totalPercentage}%`,
                showConfirmButton: true,
                confirmButtonText: 'Mengerti',
            });
            return; 
        }

        if (splitBill.splitMethod === "Split by Order" && totalAmountToPay !== Number(splitBill.totalAmount)) {
            toggleLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menambahkan Anggota Split Bill',
                text: `Total pembayaran dari seluruh anggota harus sama dengan total pembayaran split bill, Total bayaran dari seluruh anggota yang anda masukan adalah ${formatRupiah(totalAmountToPay)}`,
                showConfirmButton: true,
                confirmButtonText: 'Mengerti',
            });
            return; 
        }

        try {
            updateMembersSplitBill(data.members, data.totalMember, splitBill.splitMethod, Number(splitBill.totalAmount));
            toggleLoading(false);
            navigate(`/split-bill/payment/add`);

        } catch (error) {
            toggleLoading(false);
            console.log(error.message)
        }   
        toggleLoading(false);
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

    useEffect(() => {
      if (watchAmountToPay) {
        const total = watchAmountToPay.reduce((acc, amount) => {
          return acc + (parseFloat(amount) || 0);
        }, 0);
        setTotalAmount(total);
      }

      if (watchPercentage) {
        const total = watchPercentage.reduce((acc, amount) => {
          return acc + (parseFloat(amount) || 0);
        }, 0);
        setTotalPersentage(total);
      }
    }, [watchAmountToPay, watchPercentage]);

    return (
        <div className="bg-primary flex items-center justify-center min-h-screen p-4">
        <div className="bg-white max-w-lg mx-auto p-5 sm:p-6 border border-gray-300 rounded shadow-lg">
            <div  className="flex w-full justify-end bg-white rounded-full">
              <button onClick={onGoHome} className="bg-white rounded-full p-2 hover:bg-gray-100 transition duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className='h-6 w-6' fill='#EE4E4E'><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                  
              </button>
            </div>
            <LoadingComponent loading={loading}/>
            <h2 className="text-lg sm:text-2xl font-bold text-center mb-4 sm:mb-5">Formulir Split Bill</h2>
            <ol className="flex mx-auto items-center justify-center w-full p-3 space-x-1 md:space-x-2 -ml-1 text-[12px] md:text-sm font-medium text-gray-500 bg-white borderrounded-lg dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-6 sm:space-x-5 rtl:space-x-reverse">
                <li className="flex items-center text-blue-600 dark:text-blue-500">
                    <svg className="w-4 h-4 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                    </svg>
                    Informasi
                    <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/>
                    </svg>
                </li>
                <li className="flex items-center  text-blue-600 dark:text-blue-500">
                    <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
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
            <div className="bg-white rounded-lg p-3">
                <div className="text-center">
                    <h2 className="text-md font-bold uppercase tracking-wide text-gray-600">Judul</h2>
                    <p className="text-lg sm:text-3xl font-extrabold text-gray-900">{splitBill.title}</p>
                </div>
            </div>
            <div className="bg-white rounded-lg p-3 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-600">Metode</h2>
                    <p className="text-lg sm:text-xl font-semibold text-blue-600">
                    <span>[{splitMethodLabels[splitBill.splitMethod] || "Metode Tidak Diketahui"}]</span>
                    </p>
                </div>
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-600">Jumlah Total</h2>
                    <p className="text-lg sm:text-xl font-bold text-green-600">
                    {formatRupiah(splitBill.totalAmount)}
                    </p>
                </div>
            </div>
            <form onSubmit={handleSubmit(handleSave)} className="space-y-4" noValidate>
            {splitBill.splitMethod === "Equal Split" ? (
                    <div  className="flex flex-col my-2 sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex-1">
                            <label htmlFor={`memberAmount`} className="block text-sm sm:text-base font-medium text-gray-700">
                                Jumlah Anggota
                            </label>
                            <input
                                type="number"
                                id={`memberAmount`}
                                placeholder='Masukkan jumlah anggota'
                                {...register('totalMember', { required: true })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 placeholder:text-sm"
                            />
                            {errors.totalMember && <p className="text-red-500 text-sm mt-1">Jumlah Anggota wajib diisi</p>}
                        </div>
                    </div>
            ) : (
                <>
                  {
                    fields.map((field, index) => 
                      {
  
                        return (
                          <div key={field.id} className="flex flex-col my-2 sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-2">
                            <div className="flex-2 w-full">
                              <label htmlFor={`name-${index}`} className="block text-sm sm:text-base font-medium text-gray-700">
                                Nama Anggota
                              </label>
                              <input
                                type="text"
                                id={`name-${index}`}
                                placeholder='Masukkan nama anggota'
                                {...register(`members.${index}.name`, { required: true })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 placeholder:text-sm"
                              />
                              {errors.members?.[index]?.name && <p className="text-red-500 text-sm mt-1">Nama anggota wajib diisi</p>}
                            </div>
                            {splitBill.splitMethod === "Split by Percentage" && (
                              <div className="flex-2 w-full">
                                <label htmlFor={`percentage-${index}`} className="block text-sm sm:text-base font-medium text-gray-700">
                                  Persentase (%)
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  id={`percentage-${index}`}
                                  placeholder='Masukkan persentase'
                                  {...register(`members.${index}.percentage`, { required: "Persentase wajib diisi" })}
                                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 placeholder:text-sm"
                                />
                                {errors.members?.[index]?.percentage && <p className="text-red-500 text-sm mt-1">{errors.members?.[index]?.percentage.message}</p>}
                              </div>
                            )}    
                            {splitBill.splitMethod === "Split by Order" && (
                              <div className="flex-2 w-full">
                                <label htmlFor={`price-${index}`} className="block text-sm sm:text-base font-medium text-gray-700">
                                  Harga Porsi (Rp)
                                </label>
                                <Controller
                                  name={`members.${index}.amountToPay`}
                                  control={control}
                                  rules={{
                                      required: "Harga porsi wajib diisi"
                                    }}
                                  render={({ field }) => (
                                      <NumericFormat
                                          id={`price-${index}`}
                                          placeholder="Masukkan harga porsi"
                                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 placeholder:text-sm"
                                          decimalSeparator=","
                                          thousandSeparator="."
                                          defaultValue={Number(getValues(`members.${index}.amountToPay`))}
                                          allowNegative={false}
                                          onValueChange={(values) => {
                                              field.onChange(values.value); 
                                          }}
                                      />
                                  )}
                              />
                                {errors.members?.[index]?.amountToPay && <p className="text-red-500 text-sm mt-1">{errors.members?.[index]?.amountToPay.message}</p>}
                              </div>
                            )}
                            <div className='flex-1 self-start sm:self-end'>
                              {index !== 0 && (
                                      <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="bg-red-500 text-white p-2.5 rounded-md  mb-0.5 hover:bg-red-600 transition duration-200"
                                      >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="white" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                                      </button>
                                  )}
                            </div>
                          </div>
                        )
                      }
                    )
                  }
                  {splitBill.splitMethod === "Split by Percentage" && (
                        <>
                          <div className="mt-4">
                              <p className="text-sm sm:text-base">
                                  <strong>Sisa Alokasi : </strong>
                                  <span 
                                      className={100 - totalPercentage !== 0 ? 'text-red-500' : 'text-green-500'}
                                  >
                                      {100 - totalPercentage}%
                                  </span>
                              </p>
                          </div>
                          <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">Pastikan total persentase seluruh anggota sama dengan 100%.</p>
                        </>
                      )}
                      {splitBill.splitMethod === "Split by Order" && (
                        <>
                            <div className="mt-4">
                                <p className="text-sm sm:text-base">
                                    <strong>Sisa Alokasi : </strong>
                                    <span 
                                        className={Number(splitBill.totalAmount) - totalAmount !== 0 ? 'text-red-500' : 'text-green-500'}
                                    >
                                        {formatRupiah(Number(splitBill.totalAmount) - totalAmount)}
                                    </span>
                                </p>
                            </div>
                            <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">Pastikan total pembayaran seluruh anggota sama dengan total pembayaran split bill.</p>
                        </>
                      )}
        
                  <button
                    type="button"
                    onClick={() => handleAddMember()}
                    className={`w-full p-2 rounded-md transition duration-200 ${totalAmount >= Number(splitBill.totalAmount) || totalPercentage >= 100 ? 'bg-gray-300 cursor-not-allowed': 'bg-green-500 text-white hover:bg-green-600'}`}
                    disabled={totalAmount >= Number(splitBill.totalAmount) || totalPercentage >= 100}
                  >
                    Tambah Anggota
                  </button>
                </>
              )}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-2">
                    <Link to={`/split-bill/method/add`} className='w-full'> 
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

export default SplitBillMember;

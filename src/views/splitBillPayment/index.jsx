import { useState, useContext } from 'react';
import { LoadingContext } from '../../contexts/LoadingContext';
import { SplitBillContext } from '../../contexts/SplitBillContext';
import LoadingComponent from '../../atoms/LoadingAtoms';
import ModalAtom from '../../atoms/modalAtoms';
import { Link, useNavigate } from 'react-router-dom';
import useRedirectIfEmptySplitBill from '../../hooks/useRedirectEmptySplitBill';
import Swal from 'sweetalert2';
import { addSplitBill } from '../../services/controllers/splitBillController';
import { formatRupiah } from '../../services/utils/formatRupiah';
import { useForm, Controller  } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import eWalletData from '../../assets/data/e-walletList.json'
import bankData from '../../assets/data/bankList.json'
import splitMethodLabels from '../../assets/data/splitMethodLabels';

const formattedEWalletOptions = eWalletData.map(bank => ({
    value: bank.namaBank, 
    label: bank.namaBank  
  }));

const formattedBankOptions = bankData.map(bank => ({
    value: bank.namaBank, 
    label: bank.namaBank  
  }));


const SplitBillPayment = () => {
    const { register, handleSubmit, watch, control, formState: { errors }  } = useForm({
        defaultValues: {
            paymentMethod: '',
            paymentInfo: {receiverName: '', receiverMethodName: '', receiverNumber: ''}
        },
    });
    const paymentMethod = watch('paymentMethod');
    const { loading, toggleLoading } = useContext(LoadingContext);
    const { splitBill, updateSplitBill, clearSplitBill } = useContext(SplitBillContext);
    const [openModal, setOpenModal] = useState(false);
    const [eWalletOptions, setOptionsEWallet] = useState(formattedEWalletOptions);
    const [bankOptions, setBankOptions] = useState(formattedBankOptions);
    const navigate = useNavigate();
    useRedirectIfEmptySplitBill(splitBill);

    const handleSave =  (data) => {
        toggleLoading(true);
        const payment = {
            method: data.paymentMethod,       
            information: data.paymentInfo    
          }

        updateSplitBill({payment});
        setOpenModal(true);

        toggleLoading(false);
    };

    const handlePost = async (e) => {
        e.preventDefault();
        setOpenModal(false);
        toggleLoading(true);
        try {
            const id = await addSplitBill(splitBill)
            toggleLoading(false);
            clearSplitBill(); 
            Swal.fire({
                icon: 'success',
                title: 'Berhasil Membuat Split Bill',
                text: 'Split bill baru berhasil dibuat',
                showConfirmButton: false,
                timer: 1500
              });
              setTimeout(() => {
                navigate(`/split-bill/detail/${id}`);
            }, 1500);

        } catch (error) {
            toggleLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Membuat Split Bill',
                text: `${error.message}`,
                showConfirmButton: true,
                confirmButtonText: 'Mengerti',
              });
        }  
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
        <div className="bg-white max-w-lg w-full p-4 sm:p-6 border border-gray-300 rounded shadow-lg">
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
                    <svg className="w-4 h-4 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                    </svg>
                    Anggota
                    <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/>
                    </svg>
                </li>
                <li className="flex items-center text-blue-600 dark:text-blue-500">
                    <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
                        3
                    </span>
                    Pembayaran
                </li>
            </ol>
            <form onSubmit={handleSubmit(handleSave)} className="space-y-4" noValidate>
                <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                        Pilih Metode Pembayaran
                    </label>
                    <select
                        id="paymentMethod"
                        {...register('paymentMethod', { required: 'Metode pembayaran harus dipilih' })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
                    >
                        <option value="">-- Pilih Metode --</option>
                        <option value="Cash">Cash</option>
                        <option value="E-Wallet">E-Wallet</option>
                        <option value="Transfer Bank">Transfer Bank</option>
                    </select>
                    {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>}
                </div>
                {paymentMethod === "Cash" && (
                <div>
                    <label htmlFor="receiverName" className="block text-sm font-medium text-gray-700">
                    Nama Penerima
                    </label>
                    <input
                    type="text"
                    id="receiverName"
                    {...register('paymentInfo.receiverName', { required: 'Nama penerima harus diisi' })}
                    placeholder='Masukkan nama penerima'
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 placeholder:text-sm"
                    />
                    {errors.paymentInfo?.receiverName && <p className="text-red-500 text-sm">{errors.paymentInfo.receiverName.message}</p>}
                </div>
                )}
                {paymentMethod === "E-Wallet" && (
                <>
                    <div>
                    <label htmlFor="receiverMethodName" className="block text-sm font-medium text-gray-700">
                        Nama E-Wallet
                    </label>
                    <Controller
                        name="paymentInfo.receiverMethodName"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'E-Wallet harus diisi' }}
                        render={({ field }) => (
                         <CreatableSelect
                            {...field}
                            isSearchable
                            isClearable
                            options={eWalletOptions}
                            value={eWalletOptions.find(option => option.value === field.value) || null}
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption ? selectedOption.value : '');
                            }}
                            onCreateOption={(inputValue) => {
                              const newOption = { label: inputValue, value: inputValue };
                              setOptionsEWallet((prevOptions) => [...prevOptions, newOption]);
                              field.onChange(newOption.value);
                            }}
                        />
                        )}
                        
                    />
                     {errors.paymentInfo?.receiverMethodName && <p className="text-red-500 text-sm">{errors.paymentInfo.receiverMethodName.message}</p>}
                    </div>
                    <div>
                    <label htmlFor="receiverNumber" className="block text-sm font-medium text-gray-700">
                        Nomor HP
                    </label>
                    <input
                        type="tel"
                        id="receiverNumber"
                        placeholder='Masukkan nomor HP'
                        {...register('paymentInfo.receiverNumber', { required: 'Nomor HP harus diisi' })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 placeholder:text-sm"
                    />
                    {errors.paymentInfo?.receiverNumber && <p className="text-red-500 text-sm">{errors.paymentInfo.receiverNumber.message}</p>}
                    </div>
                    <div>
                    <label htmlFor="receiverName" className="block text-sm font-medium text-gray-700">
                        Nama Penerima E-Wallet
                    </label>
                    <input
                        type="text"
                        id="receiverName"
                        placeholder='Masukkan nama penerima e-wallet'
                        {...register('paymentInfo.receiverName', { required: 'Nama penerima E-Wallet harus diisi' })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 placeholder:text-sm"
                    />
                     {errors.paymentInfo?.receiverName && <p className="text-red-500 text-sm">{errors.paymentInfo.receiverName.message}</p>}
                    </div>
                </>
                )}
                {paymentMethod === "Transfer Bank" && (
                <>
                    <div>
                        <label htmlFor="receiverMethodName" className="block text-sm font-medium text-gray-700">
                            Nama Bank
                        </label>
                        <Controller
                            name="paymentInfo.receiverMethodName"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Bank harus diisi' }}
                            render={({ field }) => (
                            <CreatableSelect
                                {...field}
                                isSearchable
                                isClearable
                                options={bankOptions}
                                value={bankOptions.find(option => option.value === field.value) || null} 
                                onChange={(selectedOption) => {
                                    field.onChange(selectedOption ? selectedOption.value : '');  
                                }} 
                                onCreateOption={(inputValue) => {
                                    const newOption = { label: inputValue, value: inputValue };
                                    setBankOptions((prevOptions) => [...prevOptions, newOption]);
                                    field.onChange(newOption.value);
                                  }}
                            />
                            )}
                        />
                        {errors.paymentInfo?.receiverMethodName && <p className="text-red-500 text-sm">{errors.paymentInfo.receiverMethodName.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="receiverNumber" className="block text-sm font-medium text-gray-700">
                            Nomor Rekening
                        </label>
                        <input
                            type="text"
                            id="receiverNumber"
                            placeholder='Masukkan nomor rekening'
                            {...register('paymentInfo.receiverNumber', { required: 'Nomor rekening harus diisi' })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 placeholder:text-sm"
                        />
                        {errors.paymentInfo?.receiverNumber && <p className="text-red-500 text-sm">{errors.paymentInfo.receiverNumber.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="receiverName" className="block text-sm font-medium text-gray-700">
                            Nama Pemilik Rekening
                        </label>
                        <input
                            type="text"
                            id="receiverName"
                            placeholder='Masukkan nama pemilik rekening'
                            {...register('paymentInfo.receiverName', { required: 'Nama pemilik rekening harus diisi' })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 placeholder:text-sm"
                        />
                        {errors.paymentInfo?.receiverName && <p className="text-red-500 text-sm">{errors.paymentInfo.receiverName.message}</p>}
                    </div>
                </>
            )}
                <div className="flex flex-col my-2 sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-2">
                    <Link to={`/split-bill/member/add`} className='w-full'> 
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
                        Simpan Split Bill
                    </button>
              </div>
            </form>
            </div>
            <ModalAtom show={openModal} onClose={() => setOpenModal(false)} onSubmit={handlePost} title="Konfirmasi Informasi Split Bill">
                <h3 className="text-lg font-bold">{splitBill.title}</h3>
                <h3 className="text-lg font-bold">{splitMethodLabels[splitBill.splitMethod] || "Metode Tidak Diketahui"}</h3>
                <h3 className="text-lg font-bold mb-5">{formatRupiah(splitBill.totalAmount)}</h3>
                <h3 className="text-lg font-bold">Anggota</h3>
                {splitBill.splitMethod === "Equal Split" ? (
                    <div className="space-y-2">
                        <p>Jumlah Member: {splitBill.member}</p>
                        <p>Jumlah Bayar per Orang: {formatRupiah(splitBill.amountToPay)}</p>
                    </div>
                ) : splitBill.splitMethod === "Split by Percentage" ? (
                    <div className="space-y-2">
                        {splitBill.members.map((member, index) => (
                            <div key={index} className="space-y-1">
                            <p>{member.name} ({member.percentage}%) </p>
                            <p>Jumlah Bayar: {formatRupiah(member.amountToPay)}</p>
                            </div>
                        ))}
                    </div>
                ) : splitBill.splitMethod === "Split by Order" ? (
                    <div className="space-y-2">
                        {splitBill.members.map((member, index) => (
                            <div key={index} className="space-y-1">
                            <p>{member.name} </p>
                            <p>Jumlah Bayar: {formatRupiah(member.amountToPay)}</p>
                            </div>
                        ))}
                    </div>
                ) : <></>}
                 <div className="mt-5">
                    <h3 className="text-lg font-bold">Metode Pembayaran</h3>
                    {splitBill.payment?.method === "Cash" && (
                    <>
                        <p>Metode Pembayaran: Tunai</p>
                        <p>Penerima Tunai: {splitBill.payment.information.receiverName}</p>
                    </>
                    )}
                    {splitBill.payment?.method === "E-Wallet" && (
                    <div>
                        <p>Metode Pembayaran: E-Wallet</p>
                        <p>Nama Penerima: {splitBill.payment.information.receiverName}</p>
                        <p>Nama E-Wallet: {splitBill.payment.information.receiverMethodName}</p>
                        <p>Nomor E-Wallet: {splitBill.payment.information.receiverNumber}</p>
                    </div>
                    )}
                    {splitBill.payment?.method === "Transfer Bank" && (
                    <div>
                        <p>Metode Pembayaran: Bank Transfer</p>
                        <p>Atas Nama Rekening: {splitBill.payment.information.receiverName}</p>
                        <p>Nama Bank: {splitBill.payment.information.receiverMethodName}</p>
                        <p>Nomor Rekening: {splitBill.payment.information.receiverNumber}</p>
                    </div>
                    )}
                </div>
            </ModalAtom>
        </div>
    );
};

export default SplitBillPayment;

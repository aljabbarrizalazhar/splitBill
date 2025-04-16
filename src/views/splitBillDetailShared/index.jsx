import { useParams } from 'react-router-dom';
import useFetchSplitBillbyIdComplete from '../../hooks/useFetchSplitBillbyIdComplete';
import Swal from 'sweetalert2';
import LoadingComponent from '../../atoms/LoadingAtoms';
import { formatRupiah } from '../../services/utils/formatRupiah';
import splitMethodLabels from '../../assets/data/splitMethodLabels';
import { format } from 'date-fns';

const SplitBillDetail = () => {
  const { id } = useParams();
  const { splitBillData, loading: isFetching } =
    useFetchSplitBillbyIdComplete(id);

  const handleShareNumber = () => {
    navigator.clipboard.writeText(
      splitBillData.payment.information.receiverNumber
    );
    Swal.fire({
      icon: 'success',
      title: 'Berhasil menyalin',
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Waktu tidak tersedia';

    // Konversi Firebase Timestamp ke Date
    const date = timestamp.toDate();
    // Format tanggal tanpa locale
    return format(date, "dd/MM/yyyy, HH:mm 'WIB'");
  };

  return (
    <div className="bg-primary flex flex-col w-full items-center justify-center p-4 sm:p-6 min-h-screen">
      <LoadingComponent loading={isFetching} />
      {splitBillData && Object.keys(splitBillData).length > 0 ? (
        <div className="bg-secondary p-4 border border-gray-300 rounded-lg shadow-lg h-fit w-full max-w-4xl">
          <div className="p-4 sm:p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-center text-4xl font-extralight mb-2">
              Rincian Split Bill
            </h1>
            <h1 className="text-2xl sm:text-2xl text-center font-bold mb-4">
              [ {splitBillData.title} ]
            </h1>
            <p className="text-center text-sm text-gray-500 mb-4">
              {formatTimestamp(splitBillData.createdAt)}
            </p>
            <hr className="border-t-2 border-gray-500 my-4" />
            <div className="flex flex-col sm:flex-row w-full mb-5 justify-between px-5 pt-3 gap-1 md:gap-6">
              <p className="text-md">
                <span className="font-semibold">Total: </span>
                {formatRupiah(splitBillData.totalAmount)}
              </p>
              <p className="text-md">
                <span className="font-semibold">Metode: </span>
                {splitMethodLabels[splitBillData.splitMethod] ||
                  'Metode Tidak Diketahui'}
              </p>
            </div>
            <hr className="border-t-2 border-gray-500 my-6" />
            <div className="mb-5">
              <h2 className="text-xl font-bold text-center mb-5 md:mt-3">
                Informasi Pembayaran
              </h2>
              {splitBillData.payment ? (
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 md:ml-7">
                  <div>
                    <p className="text-md md:px-12">
                      <span className="font-semibold">Metode Pembayaran: </span>
                      {splitBillData.payment.method}
                    </p>
                    <p className="text-md md:px-12">
                      <span className="font-semibold">Nama Penerima: </span>
                      {splitBillData.payment.information.receiverName}
                    </p>
                  </div>
                  <div>
                    {splitBillData.payment.method === 'E-Wallet' && (
                      <>
                        <p className="text-md md:px-12">
                          <span className="font-semibold">Nama E-Wallet: </span>
                          {splitBillData.payment.information.receiverMethodName}
                        </p>
                        <p className="text-md md:px-12">
                          <span className="font-semibold">Nomor HP: </span>
                          <div className="w-full max-w-[16rem]">
                            <div className="relative">
                              {splitBillData.payment.information.receiverNumber}
                              <button
                                onClick={handleShareNumber}
                                className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 hover:bg-primary rounded-lg p-2 inline-flex items-center justify-center"
                              >
                                <span id="default-icon">
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 18 20"
                                  >
                                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                                  </svg>
                                </span>
                              </button>
                            </div>
                          </div>
                        </p>
                      </>
                    )}
                    {splitBillData.payment.method === 'Transfer Bank' && (
                      <>
                        <p className="text-md md:px-12">
                          <span className="font-semibold">Nama Bank: </span>
                          {splitBillData.payment.information.receiverMethodName}
                        </p>
                        <p className="text-md md:px-12">
                          <span className="font-semibold">
                            Nomor Rekening:{' '}
                          </span>
                          <div className="w-full max-w-[16rem]">
                            <div className="relative">
                              {splitBillData.payment.information.receiverNumber}
                              <button
                                onClick={handleShareNumber}
                                className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 hover:bg-primary rounded-lg p-2 inline-flex items-center justify-center"
                              >
                                <span id="default-icon">
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 18 20"
                                  >
                                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                                  </svg>
                                </span>
                              </button>
                            </div>
                          </div>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Tidak ada informasi</p>
              )}
            </div>
            <div>
              {splitBillData.splitMethod === 'Equal Split' ? (
                <div className="mb-4">
                  <p>Jumlah Anggota: {splitBillData.member} Orang</p>
                  <p>
                    Jumlah Bayar per Orang:{' '}
                    {formatRupiah(splitBillData.amountToPay)}
                  </p>
                </div>
              ) : (
                <div className="mb-5">
                  <h2 className="text-xl font-bold mb-4 mt-7 text-center">
                    Anggota
                  </h2>
                  {splitBillData.members && splitBillData.members.length > 0 ? (
                    <ul className="space-y-3">
                      {splitBillData.members.map((member) => (
                        <li
                          key={member.id}
                          className="border p-3 rounded-lg bg-gray-100"
                        >
                          <p className="text-lg font-semibold">{member.name}</p>
                          <p className="text-lg">
                            Jumlah Bayar: {formatRupiah(member.amountToPay)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Tidak ada anggota</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <LoadingComponent loading={true} />
      )}
    </div>
  );
};

export default SplitBillDetail;

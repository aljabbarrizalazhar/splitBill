import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import useFetchSplitBill from '../../hooks/useFetchSplitBill';
import LoadingComponent from '../../atoms/LoadingAtoms';
import { deleteSplitBill } from '../../services/controllers/splitBillController';
import { LoadingContext } from '../../contexts/LoadingContext';
import splitMethodLabels from '../../assets/data/splitMethodLabels';
import { format } from 'date-fns';

function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  const { loading, toggleLoading } = useContext(LoadingContext);
  const { splitBillData, loading: isFetching } = useFetchSplitBill(
    currentUser.uid
  );
  const [filter, setFilter] = useState('');

  const filteredBills = splitBillData.filter((bill) =>
    bill.title.toLowerCase().includes(filter.toLowerCase())
  );

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Waktu tidak tersedia';
    const date = timestamp.toDate();
    return format(date, "dd/MM/yyyy, HH:mm 'WIB'");
  };

  const onDelete = (id, name) => {
    Swal.fire({
      title: 'Apakah anda yakin?',
      text: `Anda akan menghapus Split Bill ${name}. Split Bill akan dihapus secara permanen setelah anda menekan tombol "Ya"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.value) {
        toggleLoading(true);
        try {
          await deleteSplitBill(id);
          Swal.fire({
            icon: 'success',
            title: 'Hapus Berhasil',
            text: 'Split Bill telah dihapus',
            showConfirmButton: false,
            timer: 1300,
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Hapus Gagal',
            text: `${error.message}`,
            showConfirmButton: true,
          });
        } finally {
          toggleLoading(false);
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-primary">
      <LoadingComponent loading={loading} />
      <LoadingComponent loading={isFetching} />
      <div className="bg-white shadow-md rounded-lg p-3 md:p-8 max-w-xl md:max-w-3xl w-full">
        <p className="text-lg text-gray-900 mb-6 text-center md:text-start">
          Hallo, {currentUser.displayName || currentUser.email || 'Pengguna'} 👋
        </p>
        <div className="flex flex-col mt-4 md:flex-row justify-between items-center">
          <p className="text-xl font-bold text-center md:text-left">
            Riwayat Split Bill
          </p>
          <input
            type="text"
            placeholder="Cari berdasarkan judul..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mt-4 md:mt-0 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 w-full md:w-64"
          />
        </div>
        {filteredBills && filteredBills.length > 0 ? (
          <div className=" space-y-4">
            {filteredBills.map((bill, index) => (
              <div key={index} className="relative z-10">
                <Link to={`/split-bill/detail/${bill.id}`}>
                  <div className="bg-gray-100 p-4 my-3 rounded-lg shadow hover:bg-gray-200 hover:translate-y-1">
                    <h2 className="text-xl font-bold text-gray-800">
                      {bill.title}
                    </h2>
                    <p className="text-gray-900">
                      Metode:{' '}
                      {splitMethodLabels[bill.splitMethod] ||
                        'Metode Tidak Diketahui'}
                    </p>
                    <p className="text-gray-900">
                      Total: Rp{' '}
                      {new Intl.NumberFormat('id-ID').format(bill.totalAmount)}
                    </p>
                    <p className="text-xl-gray-600">
                      {formatTimestamp(bill.createdAt)}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => onDelete(bill.id, bill.title)}
                  className="absolute top-4 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="white"
                    viewBox="0 0 448 512"
                  >
                    <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mt-8 text-center">
            Tidak ada split bill yang ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

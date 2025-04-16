import { Link } from 'react-router-dom';
import { BiConfused } from "react-icons/bi";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="flex flex-col items-center justify-center text-xl font-bold text-secondary">
          <BiConfused size={160} />
        </h1>
        <p className="mt-4 text-2xl text-gray-800">Oops! Halaman tidak ditemukan</p>
        <p className="mt-2 text-gray-600">
          Halaman yang anda cari tidak ada atau sudah tidak lagi tersedia.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Kembali
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

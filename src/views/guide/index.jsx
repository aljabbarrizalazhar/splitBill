import { Link } from "react-router-dom";
const GuidePage = () => {
  return (
    <div className="bg-primary flex items-start justify-center min-h-screen">
        <div className="container max-w-3xl mx-auto p-6 bg-white rounded-md text-gray-800">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-center text-yellow-800">
                Panduan Penggunaan Split Bill
                </h1>
                <p className="text-center text-gray-600 mt-2">
                Petunjuk lengkap untuk menggunakan aplikasi Split Bill
                </p>
            </header>

            <section className="mb-8">
                <p className="mt-2 text-gray-700 text-justify">
                Selamat datang di <span className="font-bold">Split Bill</span>! Aplikasi ini dirancang untuk memudahkan Anda membagi tagihan dengan teman-teman secara adil dan efisien. Anda dapat memilih berbagai metode pembagian tagihan, mulai dari pembagian rata, sesuai persentase, hingga sesuai pesanan.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-yellow-800">Fitur Utama</h2>
                <ul className="list-disc list-inside mt-2 text-gray-700">
                <li>Pembagian Rata (Equal Split)</li>
                <li>Pembagian Berdasarkan Persentase (Split by Percentage)</li>
                <li>Pembagian Berdasarkan Porsi (Split by Order)</li>
                <li>Metode Pembayaran Fleksibel</li>
                <li>Berbagi Informasi Split Bill dan Struk dalam Format PDF</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-yellow-800">Cara Menggunakan</h2>
                <ol className="list-decimal list-inside mt-2 text-gray-700 text-justify">
                <li>
                    <strong>Daftar Akun:</strong> Klik tombol &quot;Daftar di sini&quot; di pojok kanan bawah pada halaman login dan isi informasi yang dibutuhkan seperti email dan password pada halaman daftar.
                </li>
                <li>
                    <strong>Buat Split Bill Baru:</strong> Klik tombol &quot;Split Bill Baru&quot; pada menu. Masukkan judul, total jumlah split bill, serta metode pembagian.
                </li>
                <li>
                    <strong>Tambahkan Anggota:</strong> Masukkan nama dan informasi anggota yang akan ikut dalam pembagian split bill.
                </li>
                <li>
                    <strong>Pilih Metode Pembayaran:</strong> Pilih metode pembayaran yang digunakan untuk melunasi split bill.
                </li>
                <li>
                    <strong>Unduh informasi split bill:</strong> Setelah split bill dibuat, klik tombol print pada halaman detail split bill untuk mengunduh bukti informasi split bill dalam format PDF.
                </li>
                </ol>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-yellow-800">Metode Pembagian Tagihan</h2>
                <p className="mt-2 text-gray-700 text-justify">
                Aplikasi Split Bill mendukung beberapa metode pembagian tagihan:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-700">
                <li>
                    <strong>Bagi Rata (Equal Split):</strong> Tagihan dibagi rata di antara semua anggota.
                </li>
                <li>
                    <strong>Sesuai Persentase (Split by Percentage):</strong> Pembayaran dibagi berdasarkan persentase yang disepakati oleh masing-masing anggota.
                </li>
                <li>
                    <strong>Sesuai Porsi (Split by Order):</strong> Tagihan dibagi sesuai dengan pesanan masing-masing anggota.
                </li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-yellow-800">Metode Pembayaran</h2>
                <p className="mt-2 text-gray-700 text-justify">
                Anda dapat mencatat berbagai metode pembayaran yang digunakan dalam sistem ini, seperti:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-700">
                <li><strong>Transfer Bank</strong></li>
                <li><strong>E-Wallet</strong></li>
                <li><strong>Pembayaran Tunai</strong></li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-yellow-800">Unduh Struk</h2>
                <p className="mt-2 text-gray-700 text-justify">
                    Setelah split bill berhasil dibuat, Anda dapat mengunduh struk informasi split bill dalam format PDF. Struk ini mencantumkan rincian split bill dan metode pembayaran.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-yellow-800">Pertanyaan Umum (FAQ)</h2>
                <ul className="list-disc list-inside mt-2 text-gray-700">
                <li>
                    <strong>Bagaimana cara menambahkan anggota?</strong> 
                    <p className="text-justify mb-1">Anda dapat menambahkan anggota saat membuat split bill baru dengan mengisi nama dan informasi anggota.</p>
                </li>
                <li>
                    <strong>Apakah struk bisa diunduh ulang?</strong> 
                    <p className="text-justify">Ya, struk bisa diunduh ulang kapan saja dari halaman detail split bill. </p>
                </li>
                </ul>
            </section>
        <Link to={`/main`}> 
            <button 
                className="w-full my-2 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition duration-200"
            >
                Kembali
            </button>
        </Link>
        </div>
    </div>
  );
};

export default GuidePage;

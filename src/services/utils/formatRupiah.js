export const formatRupiah = (amount) => {
    if (!amount) return "Rp.0";
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    }).format(amount);
};
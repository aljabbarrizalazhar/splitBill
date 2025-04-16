import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image  } from '@react-pdf/renderer';
import LoadingComponent from '../../atoms/LoadingAtoms';
import PropTypes from 'prop-types';
import splitMethodLabels from '../../assets/data/splitMethodLabels';

const styles = StyleSheet.create({
    page: {
      padding: 20,
      fontFamily: 'Helvetica',
    },
    section: {
      marginBottom: 10,
      padding: 10,
      borderBottom: '1px solid #ddd',
    },
    title: {
      fontSize: 22,
      marginBottom: 12,
      fontWeight: 'bold',
      color: '#2C3E50',
    },
    text: {
      fontSize: 12,
      marginBottom: 4,
      color: '#34495E',
    },
    member: {
      fontSize: 12,
      marginBottom: 2,
    },
    totalAmount: {
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 10,
      color: '#27AE60',
    },
    logo: {
      width: 80,
      height: 80,
      marginBottom: 10,
    },
    footer: {
      marginTop: 20,
      textAlign: 'center',
      fontSize: 10,
      color: '#95A5A6',
    },
  });


const SplitBillStruck = ({ splitBill }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        
        <View style={styles.section}>
          <Image src="/image/logo.png" style={styles.logo} />
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Split Bill: {splitBill.title}</Text>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.text}>Jumlah Total: Rp {splitBill.totalAmount.toLocaleString('id-ID')}</Text>
          <Text style={styles.text}>Metode Split Bill: {splitMethodLabels[splitBill.splitMethod] || "Metode Tidak Diketahui"}</Text>
          <Text style={styles.text}>Metode Pembayaran: {splitBill.payment.method}</Text>
          <Text style={styles.text}>Nama Penerima: {splitBill.payment.information.receiverName}</Text>
          {splitBill.payment.information.receiverNumber && (
            <Text style={styles.text}>Nomor Penerima: {splitBill.payment.information.receiverNumber}</Text>
          )}
          {splitBill.payment.information.receiverMethodName && (
            <Text style={styles.text}>Metode Penerima: {splitBill.payment.information.receiverMethodName}</Text>
          )}
        </View>
  
        {splitBill.splitMethod === "Equal Split" && (
          <View style={styles.section}>
            <Text style={styles.text}>Total Anggota: {splitBill.member}</Text>
            <Text style={styles.text}>Jumlah pembayaran per anggota: Rp {splitBill.amountToPay.toLocaleString('id-ID')}</Text>
          </View>
        )}
  
        {splitBill.splitMethod === "Split by Percentage" && (
          <View style={styles.section}>
            <Text style={styles.text}>Anggota:</Text>
            {splitBill.members.map((member, index) => (
              <View key={index} style={styles.member}>
                <Text style={styles.text}>
                  {member.name}: {member.percentage}% - Rp {member.amountToPay.toLocaleString('id-ID')}
                </Text>
              </View>
            ))}
          </View>
        )}

        {splitBill.splitMethod === "Split by Order" && (
          <View style={styles.section}>
            <Text style={styles.text}>Anggota:</Text>
            {splitBill.members.map((member, index) => (
              <View key={index} style={styles.member}>
                <Text style={styles.text}>
                  {member.name} - Rp {member.amountToPay.toLocaleString('id-ID')}
                </Text>
              </View>
            ))}
          </View>
        )}
  
  
        <View style={styles.section}>
          <Text style={styles.totalAmount}>
            Jumlah Total: Rp {splitBill.totalAmount.toLocaleString('id-ID')}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>Thank you for using Split Bill!</Text>
        </View>
      </Page>
    </Document>
  );

const ReceiptPDF = ({ splitBill }) => (
    <PDFDownloadLink
        document={<SplitBillStruck splitBill={splitBill} />}
        fileName={`${splitBill.title}_receipt.pdf`}
    >
        {({ loading }) =>
        loading ? (
            <div className="bg-primary flex items-center justify-center">
                <LoadingComponent loading={true}/> 
            </div>
        ) : (
            <button
            className="bg-yellow-400 text-white p-3 mx-1 rounded-lg hover:bg-yellow-500 transition duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="white" viewBox="0 0 512 512"><path d="M128 0C92.7 0 64 28.7 64 64l0 96 64 0 0-96 226.7 0L384 93.3l0 66.7 64 0 0-66.7c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0L128 0zM384 352l0 32 0 64-256 0 0-64 0-16 0-16 256 0zm64 32l32 0c17.7 0 32-14.3 32-32l0-96c0-35.3-28.7-64-64-64L64 192c-35.3 0-64 28.7-64 64l0 96c0 17.7 14.3 32 32 32l32 0 0 64c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-64zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>
            </button>
        )
        }
    </PDFDownloadLink>
);

export default ReceiptPDF;

  SplitBillStruck.propTypes = {
    splitBill: PropTypes.shape({
      title: PropTypes.string.isRequired,
      totalAmount: PropTypes.number.isRequired,
      splitMethod: PropTypes.string.isRequired,
      payment: PropTypes.shape({
        method: PropTypes.string.isRequired,
        information: PropTypes.shape({
          receiverName: PropTypes.string.isRequired,
          receiverNumber: PropTypes.string,
          receiverMethodName: PropTypes.string,
        }),
      }).isRequired,
      member: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      amountToPay: PropTypes.number,
      members: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          percentage: PropTypes.number,
          amountToPay: PropTypes.number,
        })
      ),
    }).isRequired,
  };

  ReceiptPDF.propTypes = {
    splitBill: PropTypes.object.isRequired,
  };
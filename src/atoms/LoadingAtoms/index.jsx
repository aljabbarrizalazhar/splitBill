import { BeatLoader } from 'react-spinners';
import PropTypes from 'prop-types';

const LoadingComponent = ({ loading }) => {
  return (
    loading && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <BeatLoader
          color={"#ffffff"}
          loading={loading}
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    )
  );
};

export default LoadingComponent;

LoadingComponent.propTypes = {
    loading: PropTypes.bool.isRequired,
  };

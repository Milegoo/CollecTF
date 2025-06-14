import { useNavigate, useParams } from "react-router-dom";

function BackSearchButton() {
    const { step } = useParams();
    const searchStep = parseInt(step);
    const navigate = useNavigate();

    const handleBack = () => {
      const backStep = searchStep - 1
      if (backStep < 1) {
        navigate('/Search');
      } else {
        // Navigate to the previous step
        navigate(`/Search/${backStep}`)
      }
    }

    return (
      <button className="btn" onClick={handleBack}>BACK</button>
    );
  }

export default BackSearchButton;
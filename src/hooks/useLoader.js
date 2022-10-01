import { useState } from "react";

const useLoader = () => {
  const [showLoader, setShowLoader] = useState(false);
  return {showLoader,setShowLoader};
};

export default useLoader;
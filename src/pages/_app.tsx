import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
  <>
  <Component {...pageProps} />
  <ToastContainer closeButton draggable position="bottom-right" />
  </>
  );
};

export default api.withTRPC(MyApp);

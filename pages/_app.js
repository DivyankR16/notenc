import Layout from '../components/layout/Layout';
import '../style/global.css'
require("dotenv").config();
function MyApp({ Component, pageProps }) {
  return (
  <Layout>
    <Component {...pageProps} />
  </Layout>
  )
}

export default MyApp

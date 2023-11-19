import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
// import MapComponent from "~/components/Home/Map";
import TableComponent from "~/components/Table";
import DashboardLayout from "~/containers/DashboardLayout";
const MapComponent = dynamic(() => import('../components/Home/Map'), {
  ssr: false
});

import { api } from "~/utils/api";

const Home = () => {
  const headers = ['Location', 'Time', 'Vessel'];
  const rows = [
    {
      Location: 'Fulham',
      Time: '11:56',
      Vessel: 'Dinghy'
    },
    {
      Location: 'Tower Bridge',
      Time: '13:23',
      Vessel: 'London'
    },
    {
      Location: 'Lambeth',
      Time: '16:18',
      Vessel: 'San Francisco'
    }
  ];

  return (
    <>
      <Head>
        <title>LEISAir</title>
        <meta name="LEISAir" content="A platform for vessel detection" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout sectionTitle="Home">
        <div className="h-full w-full">
          <div className="flex justify-between gap-8">
            <div>
              <h1 className="font-semibold text-3xl py-6">Camera Locations</h1>
              <div className="h-[600px] w-[800px]">
                <MapComponent/>
              </div>
            </div>
            <div className="w-full">
              <h1 className="font-semibold text-3xl py-6">Recent Vessels</h1>
              <TableComponent headers={headers} rows={rows} />
            </div>
          </div>


        </div>

      </DashboardLayout>
    </>
  );
}

export default Home;


// export async function getServerSideProps() {
//   const mapApiKey = process.env.GOOGLE_MAPS_API_KEY;
//   return {
//     props: {
//       mapApiKey
//     }
//   }
// }

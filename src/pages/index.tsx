import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";
import MapComponent from "~/components/Home/Map";
import TableComponent from "~/components/Table";
import DashboardLayout from "~/containers/DashboardLayout";

import { api } from "~/utils/api";

const Home = ({ mapApiKey }: any) => {
  const headers = ['Location', 'Time (24hr)', 'Vessel'];
  const rows = [
    ['Fulham', '11:56', 'Dinghy'],
    ['Tower Bridge', '13:23', 'London'],
    ['Lambeth', '16:18', 'San Francisco']
  ];
  console.log(mapApiKey);

  return (
    <>
      <Head>
        <title>LEISAir</title>
        <meta name="LEISAir" content="A platform for vessel detection" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout sectionTitle="Home">
        <div className="h-full w-full">
          <div className="flex justify-center">
            <div className="w-2/5">
              <h1 className="font-semibold text-3xl py-6">Camera Locations</h1>
              <div className="h-[600px] w-[800px]">
                <MapComponent mapApiKey={mapApiKey || ""} />
              </div>
            </div>
            <div className="w-2/5">
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


export async function getServerSideProps() {
  const mapApiKey = process.env.GOOGLE_MAPS_API_KEY;
  return {
    props: {
      mapApiKey
    }
  }
}

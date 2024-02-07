import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ExportDataButton from '~/components/Home/DataExtractionButton'; // Adjust the import path as needed
import TableComponent, { TableHeader } from '../components/Table';
import DashboardLayout from '../containers/DashboardLayout';
import { api } from '~/utils/api';

// Dynamically import the MapComponent with SSR disabled
const MapComponent = dynamic(() => import('../components/Home/Map'), {
  ssr: false
});

const Home = () => {
  const locationsFromDb = api.cameraLocations.getAll.useQuery();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);

  const headers: TableHeader[] = [
    { key: 'Location', label: 'Location' },
    { key: 'Time', label: 'Time' },
    { key: 'Vessel', label: 'Vessel' },
  ];

  // Example rows, replace with your dynamic data
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
    },
  ];

  const handleLocationChange = (locationId: string) => {
    const currentIndex = selectedLocationIds.indexOf(locationId);
    const newSelectedLocationIds: string[] = [...selectedLocationIds];

    if (currentIndex === -1) {
      newSelectedLocationIds.push(locationId);
    } else {
      newSelectedLocationIds.splice(currentIndex, 1);
    }

    setSelectedLocationIds(newSelectedLocationIds);
  };

  return (
    <>
      <Head>
        <title>LEISAir</title>
        <meta name="LEISAir" content="A platform for vessel detection" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout sectionTitle="Home">
        <div className="h-full w-full">
          <div className="flex justify-between flex-wrap">
            <div>
              <h1 className="font-semibold text-3xl py-6">Camera Locations</h1>
              <div className="h-[600px] w-[800px]">
                <MapComponent />
              </div>
            </div>
            <div>
              <h1 className="font-semibold text-3xl py-6">Recent Vessels</h1>
              <div className='h-60'>
                <TableComponent headers={headers} rows={rows} />
              </div>

              <div className='flex flex-col grow'>
                <h1 className="font-semibold text-3xl py-6">Export Vessels</h1>
                <div className='flex gap-2 flex-col border-2 p-4 m-2'>
                  <h3 className="text-xl font-bold">Filters</h3>

                  <div className='flex gap-12 justify-start items-center '>
                    <div>
                      <label className="font-bold">
                        Select Locations
                      </label>

                      {locationsFromDb.data?.map((location) => (
                        <label key={location._id.toString()} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedLocationIds.includes(location._id.toString())}
                            onChange={() => handleLocationChange(location._id.toString())}
                          />
                          {location.name}
                        </label>
                      ))}
                    </div>

                    <div className='flex flex-col'>
                      <span className="text-md py-2 text-gray-600 font-semibold">Date From</span>
                      <DatePicker
                        selected={startDate}
                        onChange={(date: Date) => setStartDate(date)}
                        className="mb-4 border border-gray-300 rounded-md px-4 py-2 w-full"
                      />
                    </div>
                    <div className='flex flex-col'>
                      <span className="text-md py-2 text-gray-600 font-semibold">Date To</span>
                      <DatePicker
                        selected={endDate}
                        onChange={(date: Date) => setEndDate(date)}
                        className="mb-4 border border-gray-300 rounded-md px-4 py-2 w-full"
                      />
                    </div>
                  </div>
                </div>
                <ExportDataButton filters={{ locationIds: selectedLocationIds, startDate, endDate }} />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Home;

import Head from "next/head";
import DashboardLayout from "~/containers/DashboardLayout";

const AnalyticsPage = () => {
    return (
        <>
            <Head>
                <title>LEISAir - Analytics</title>
                <meta name="LEISAir" content="A platform for vessel detection" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <DashboardLayout sectionTitle="Analytics">
                <div className="h-full w-full">
                    
                </div>
            </DashboardLayout>
        </>
    );
    }

export default AnalyticsPage;
import axios from "axios";
import clsx from "clsx";
import Head from "next/head";
import { useEffect, useState } from "react";
import DashboardLayout from "~/containers/DashboardLayout";
import { api } from "~/utils/api";

const AnalyticsPage = () => {
    const mlModelsFromDb = api.mlModels.getAll.useQuery()
    const vesselCorrectionsFromDb = api.vesselCorrections.getAll.useQuery()
    const selectMlModel = api.mlModels.selectOne.useMutation();
    const selectDefaultMlModel = api.mlModels.useDefault.useMutation();
    const [activeModel, setActiveModel] = useState<MlModel>();
    const [selectedModel, setSelectedModel] = useState<MlModel>();
    const [lastUpdated, setLastUpdated] = useState<Date>();

    useEffect(() => {
        const interval = setInterval(() => {
            void mlModelsFromDb.refetch();
            setLastUpdated(new Date());
        }, 4000)
        return () => clearInterval(interval)
    }, [mlModelsFromDb]);

    useEffect(() => {
        if (mlModelsFromDb.data) {
            const selected = mlModelsFromDb.data.find((model) => model.selected);
            setActiveModel(selected);
        }
    }, [mlModelsFromDb.data]);

    const handleModelSelection = (createdAt?: string) => {
        const model = mlModelsFromDb.data?.find((model) => model._id === createdAt);
        if (model) {
            setSelectedModel(model);
        }
        else {
            setSelectedModel(undefined);
        }

    };

    const handleSetActiveModel = async () => {
        if (selectedModel) {
            await selectMlModel.mutateAsync(selectedModel._id);
            void mlModelsFromDb.refetch();
        }
        else {
            await selectDefaultMlModel.mutateAsync();
            void mlModelsFromDb.refetch();
        }
    }

    const handleTrainNewModel = () => {
        void selectDefaultMlModel.mutateAsync()
        void axios.post("/update-model").then((res) => {
            console.log(res);
        });
    }

    const isModelTraining = mlModelsFromDb.data?.some((model) => model.status === "training");

    return (
        <>
            <Head>
                <title>LEISAir - Settings</title>
                <meta name="LEISAir" content="A platform for vessel detection" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <DashboardLayout sectionTitle="Settings">
                <div className="h-full w-full">
                    <h2 className="font-semibold text-2xl">ML Model Settings</h2>
                    <div className="py-4">
                        <label className="font-semibold">Active ML Model:</label> {activeModel?.createdAt.toLocaleString() ?? "Default"}
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold">Available ML Models:</h3>
                        <select
                            className="w-60"
                            value={selectedModel?._id}
                            size={10}
                            onChange={(e) => void handleModelSelection(e.target.value)}
                        >
                            <option value="">Default</option>
                            {mlModelsFromDb.data?.map((model) => (
                                <option key={model._id} value={model._id}>
                                    {model.createdAt.toLocaleString()} 
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleSetActiveModel}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-40"
                        >
                            Set Active
                        </button>
                    </div>
                    <div className="w-full flex flex-col gap-4">
                        <h2 className="font-semibold text-2xl pb-2 pt-4">Model Update Settings</h2>
                        <div className="flex gap-4">
                            <label className="font-semibold">Untrained vessel Corrections:</label> {vesselCorrectionsFromDb.data?.filter((correction) => !correction.used).length ?? 0}
                        </div>
                        <button
                            onClick={handleTrainNewModel}
                            disabled={isModelTraining}
                            className={clsx(" text-white font-bold py-2 px-4 rounded w-60", isModelTraining ? "cursor-not-allowed bg-gray-600" : "bg-blue-500 hover:bg-blue-700")}
                        >
                            {isModelTraining ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                    <div className="ml-2">
                                    Model is Training
                                    </div>
                                    
                                </div>
                            ) : (
                                "Train New Model"
                            )}


                        </button>
                        {(vesselCorrectionsFromDb.data?.filter((correction) => !correction.used).length ?? 0) < 50 && (
                            <p className="text-red-500">It is highly recommended that you correct at least 50 classifications before attempting to retrain.</p>
                        )}
                        <p className="text-red-500">This will take a while to complete</p>

                    </div>

                </div>
            </DashboardLayout>
        </>
    );
}

export default AnalyticsPage;
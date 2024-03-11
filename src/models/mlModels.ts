

interface MlModel {
    _id: string;
    path: string;
    status: "training" | "trained" | "failed" 
    createdAt: string;
    selected: boolean;
}
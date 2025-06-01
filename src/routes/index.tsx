import { createFileRoute } from '@tanstack/react-router';

import { DiabetesPrevisionContainer } from '@/components/home/diabetes-prevision-container';
import { InfoContainer } from '@/components/home/info-container';
import { TrainingInfoContainer } from '@/components/home/training-info-container';

import { useDiabetesModel } from '../hooks/use-diabetes-model';

export const Route = createFileRoute('/')({
    component: Home
});

function Home() {
    const { loading, training, error, accuracy, predictDiabetes, model } =
        useDiabetesModel();

    return (
        <>
            <InfoContainer />

            <DiabetesPrevisionContainer
                error={error}
                loading={loading}
                training={training}
                handlePredict={predictDiabetes}
            />

            <TrainingInfoContainer model={model} accuracy={accuracy} />
        </>
    );
}

import { createFileRoute } from '@tanstack/react-router';

import { InfoContainer } from '@/components/home/info-container';
import { PrevisionContainer } from '@/components/home/prevision-container';
import { TrainingContainer } from '@/components/home/training-container';

import { useDiabetesModel } from '../hooks/use-diabetes-model';

export const Route = createFileRoute('/')({
    component: Home
});

function Home() {
    const {
        loading,
        training,
        error,
        accuracy,
        predictDiabetes,
        model,
        renderTrainingGraphs,
        trainingHistory,
        visualizeDataset,
        datasetReady,
        confusionMatrix
    } = useDiabetesModel();

    return (
        <>
            <InfoContainer />

            <PrevisionContainer
                error={error}
                loading={loading}
                training={training}
                handlePredict={predictDiabetes}
            />

            <TrainingContainer
                model={model}
                accuracy={accuracy}
                renderTrainingGraphs={renderTrainingGraphs}
                trainingHistory={trainingHistory}
                visualizeDataset={visualizeDataset}
                datasetReady={datasetReady}
                confusionMatrix={confusionMatrix}
            />
        </>
    );
}

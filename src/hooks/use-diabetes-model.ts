import { useEffect, useRef, useState } from 'react';

import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

import { ROBODOC_CSV_URL } from '@/constants';

function shuffle(features: any[], target: any[]) {
    let counter = features.length;
    let temp = 0;
    let index = 0;
    while (counter > 0) {
        index = (Math.random() * counter) | 0;
        counter--;
        // features:
        temp = features[counter];
        features[counter] = features[index];
        features[index] = temp;
        // target:
        temp = target[counter];
        target[counter] = target[index];
        target[index] = temp;
    }
}

function determineMeanAndStddev(data: tf.Tensor) {
    const dataMean = data.mean(0);
    const diffFromMean = data.sub(dataMean);
    const squaredDiffFromMean = diffFromMean.square();
    const variance = squaredDiffFromMean.mean(0);
    const dataStd = variance.sqrt();
    return { dataMean, dataStd };
}

function normalizeTensor(
    data: tf.Tensor,
    dataMean: tf.Tensor,
    dataStd: tf.Tensor
) {
    return data.sub(dataMean).div(dataStd);
}

export function useDiabetesModel() {
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [accuracy, setAccuracy] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [training, setTraining] = useState(false);
    const [trainingHistory, setTrainingHistory] = useState<any[]>([]);
    const [datasetVisualized, setDatasetVisualized] = useState(false);
    const [confusionMatrix, setConfusionMatrix] = useState<{
        tp: number;
        fp: number;
        fn: number;
        tn: number;
    } | null>(null);
    const dataMean = useRef<tf.Tensor | null>(null);
    const dataStd = useRef<tf.Tensor | null>(null);
    const datasetData = useRef<any>(null);
    const originalFeatures = useRef<number[]>([]);
    const originalTarget = useRef<number[]>([]);

    // Função para calcular matriz de confusão baseada no código Angular
    const calculateConfusionMatrix = async (
        model: tf.LayersModel,
        features: number[],
        target: number[],
        dataMean: tf.Tensor,
        dataStd: tf.Tensor
    ) => {
        const predictions: number[] = [];

        // Fazer previsões para todos os dados
        for (let feature of features) {
            const input = tf.tensor2d([[feature]]);
            const normalized = normalizeTensor(input, dataMean, dataStd);
            const prediction = model.predict(normalized) as tf.Tensor;
            const predictionValue = prediction.dataSync()[0];

            let response;
            if (predictionValue < 0.5) {
                response = 0;
            } else {
                response = 1;
            }

            predictions.push(response);

            // Limpar memória
            input.dispose();
            normalized.dispose();
            prediction.dispose();
        }

        // Criar tensores para matriz de confusão
        const lab = tf.tensor1d(target, 'int32');
        const pred = tf.tensor1d(predictions, 'int32');
        const numClasses = 2;

        // Calcular matriz de confusão
        const output = tf.math.confusionMatrix(lab, pred, numClasses);
        const confusionData = output.dataSync();

        // Limpar tensores
        lab.dispose();
        pred.dispose();
        output.dispose();

        // Calcular total de amostras
        const totalSamples = target.length;

        // Calcular proporções corretas (valores de 0 a 1)
        const confusion = {
            tn: confusionData[0] / totalSamples, // True Negative
            fp: confusionData[1] / totalSamples, // False Positive
            fn: confusionData[2] / totalSamples, // False Negative
            tp: confusionData[3] / totalSamples // True Positive
        };

        console.log('Matriz de confusão (valores brutos):', confusionData);
        console.log('Total de amostras:', totalSamples);
        console.log('Proporções calculadas:', confusion);

        return confusion;
    };

    // Função para visualizar o dataset como scatterplot
    const visualizeDataset = (containerId: string) => {
        const container = document.getElementById(containerId);
        if (container && datasetData.current && !datasetVisualized) {
            // Limpar container
            container.innerHTML = '';

            const classZero: any[] = [];
            const classOne: any[] = [];

            // Separar dados por classe
            datasetData.current.forEach((item: any) => {
                const features = { x: item.hba1c, y: item.diabetes };
                if (item.diabetes === 0) {
                    classZero.push(features);
                } else if (item.diabetes === 1) {
                    classOne.push(features);
                }
            });

            // Renderizar scatterplot
            tfvis.render.scatterplot(
                container,
                {
                    values: [classZero, classOne],
                    series: ['Sem diabetes', 'Com diabetes']
                },
                {
                    xLabel: 'Nível de HbA1c',
                    yLabel: 'Diabetes (0=Não, 1=Sim)',
                    zoomToFit: true
                }
            );

            setDatasetVisualized(true);
        }
    };

    // Função para renderizar gráficos em elementos específicos
    const renderTrainingGraphs = (containerId: string) => {
        const container = document.getElementById(containerId);
        if (container && trainingHistory.length > 0) {
            // Limpar container
            container.innerHTML = '';

            // Preparar dados para os gráficos
            const epochs = trainingHistory.map((_, i) => i + 1);
            const losses = trainingHistory.map((h) => h.loss);
            const accuracies = trainingHistory.map((h) => h.acc);
            const valLosses = trainingHistory.map((h) => h.val_loss);
            const valAccuracies = trainingHistory.map((h) => h.val_acc);

            // Criar gráfico de perda
            const lossContainer = document.createElement('div');
            lossContainer.style.width = '48%';
            lossContainer.style.display = 'inline-block';
            lossContainer.style.marginRight = '2%';

            const accuracyContainer = document.createElement('div');
            accuracyContainer.style.width = '48%';
            accuracyContainer.style.display = 'inline-block';
            accuracyContainer.style.marginLeft = '2%';

            container.appendChild(lossContainer);
            container.appendChild(accuracyContainer);

            // Renderizar gráfico de perda
            tfvis.render.linechart(
                lossContainer,
                {
                    values: [
                        epochs.map((epoch, i) => ({ x: epoch, y: losses[i] })),
                        epochs.map((epoch, i) => ({
                            x: epoch,
                            y: valLosses[i]
                        }))
                    ],
                    series: ['Treinamento', 'Validação']
                },
                {
                    xLabel: 'Épocas',
                    yLabel: 'Perda'
                }
            );

            // Renderizar gráfico de acurácia
            tfvis.render.linechart(
                accuracyContainer,
                {
                    values: [
                        epochs.map((epoch, i) => ({
                            x: epoch,
                            y: accuracies[i]
                        })),
                        epochs.map((epoch, i) => ({
                            x: epoch,
                            y: valAccuracies[i]
                        }))
                    ],
                    series: ['Treinamento', 'Validação']
                },
                {
                    xLabel: 'Épocas',
                    yLabel: 'Acurácia'
                }
            );
        }
    };

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        const defineAndTrainModel = async () => {
            try {
                setTraining(true);

                const dataset = tf.data.csv(ROBODOC_CSV_URL, {
                    columnConfigs: { diabetes: { isLabel: true } }
                });

                const features: number[] = [];
                const target: number[] = [];
                const rawData: any[] = [];

                // Usar apenas HbA1c_level como feature e armazenar dados brutos
                await dataset.forEachAsync((e: any) => {
                    features.push(Number(e.xs.HbA1c_level));
                    target.push(e.ys.diabetes);
                    rawData.push({
                        hba1c: Number(e.xs.HbA1c_level),
                        diabetes: e.ys.diabetes
                    });
                });

                // Armazenar dados para visualização e matriz de confusão
                datasetData.current = rawData;
                originalFeatures.current = [...features]; // Cópia antes do shuffle
                originalTarget.current = [...target]; // Cópia antes do shuffle

                if (!isMounted) return;

                // Embaralhar dados
                shuffle(features, target);

                const features_tensor_raw = tf.tensor2d(features, [
                    features.length,
                    1
                ]);
                const target_tensor = tf.tensor2d(target, [target.length, 1]);

                // Calcular mean e std
                const { dataMean: mean, dataStd: std } =
                    determineMeanAndStddev(features_tensor_raw);
                dataMean.current = mean;
                dataStd.current = std;

                const features_tensor_normalized = normalizeTensor(
                    features_tensor_raw,
                    mean,
                    std
                );

                // Criar modelo - simplificado para uma feature
                const newModel = tf.sequential();

                // Camada de entrada
                newModel.add(
                    tf.layers.dense({
                        inputShape: [1], // Apenas uma feature (HbA1c)
                        units: 10,
                        activation: 'relu'
                    })
                );

                // Camada de saída
                newModel.add(
                    tf.layers.dense({
                        units: 1,
                        activation: 'sigmoid'
                    })
                );

                newModel.compile({
                    optimizer: tf.train.adam(),
                    loss: 'binaryCrossentropy',
                    metrics: ['accuracy']
                });

                const history: any[] = [];

                // Treinar modelo
                await newModel.fit(features_tensor_normalized, target_tensor, {
                    batchSize: 40,
                    epochs: 50,
                    validationSplit: 0.2,
                    callbacks: {
                        onEpochEnd: (_epoch: any, logs: any) => {
                            if (isMounted && logs?.val_acc !== undefined) {
                                setAccuracy(
                                    `${(logs.val_acc * 100).toFixed(2)}%`
                                );

                                // Armazenar histórico para uso posterior
                                history.push({
                                    epoch: _epoch,
                                    loss: logs.loss,
                                    acc: logs.acc,
                                    val_loss: logs.val_loss,
                                    val_acc: logs.val_acc
                                });

                                setTrainingHistory([...history]);
                            }
                        },
                        onTrainEnd: async () => {
                            if (isMounted) {
                                setTraining(false);
                                setLoading(false);

                                // Calcular matriz de confusão após o treinamento
                                try {
                                    const confusion =
                                        await calculateConfusionMatrix(
                                            newModel,
                                            originalFeatures.current,
                                            originalTarget.current,
                                            mean,
                                            std
                                        );
                                    setConfusionMatrix(confusion);
                                } catch (err) {
                                    console.error(
                                        'Erro ao calcular matriz de confusão:',
                                        err
                                    );
                                }
                            }
                        }
                    }
                });

                if (isMounted) {
                    setModel(newModel);
                }

                // Limpar tensores
                features_tensor_raw.dispose();
                target_tensor.dispose();
                features_tensor_normalized.dispose();
            } catch (err: any) {
                if (isMounted) {
                    setError(err.message || 'Erro ao treinar o modelo');
                    setLoading(false);
                    setTraining(false);
                }
            }
        };

        defineAndTrainModel();

        return () => {
            isMounted = false;
        };
    }, []);

    function predictDiabetes(hbA1cValue: number) {
        if (!model || !dataMean.current || !dataStd.current) {
            return null;
        }

        const input = tf.tensor2d([[hbA1cValue]]);
        const normalized = normalizeTensor(
            input,
            dataMean.current,
            dataStd.current
        );
        const prediction = model.predict(normalized) as tf.Tensor;
        const predictionValue = prediction.dataSync()[0];

        input.dispose();
        normalized.dispose();
        prediction.dispose();

        return predictionValue;
    }

    return {
        loading,
        training,
        error,
        accuracy,
        predictDiabetes,
        model: model !== null,
        trainingHistory,
        renderTrainingGraphs,
        visualizeDataset,
        datasetReady: datasetData.current !== null,
        confusionMatrix
    };
}

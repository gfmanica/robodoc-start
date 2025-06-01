import { useEffect, useRef, useState } from 'react';

import * as tf from '@tensorflow/tfjs';

import { ROBODOC_CSV_URL } from '@/constants';

function shuffle(a: any[], b: any[]) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
        [b[i], b[j]] = [b[j], b[i]];
    }
}

function determineMeanAndStddev(tensor: tf.Tensor2D) {
    const dataMean = tensor.mean(0);
    const dataStd = tf.moments(tensor, 0).variance.sqrt();
    return { dataMean, dataStd };
}

function normalizeTensor(tensor: tf.Tensor2D, mean: tf.Tensor, std: tf.Tensor) {
    return tensor.sub(mean).div(std);
}

function predict_normalized(
    model: tf.LayersModel,
    value: any[],
    mean: tf.Tensor,
    std: tf.Tensor
) {
    const input = tf.tensor2d([value]);
    const norm = normalizeTensor(input, mean, std);

    return (model.predict(norm) as tf.Tensor).dataSync()[0];
}

export function useDiabetesModel() {
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [accuracy, setAccuracy] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const dataMean = useRef<tf.Tensor | null>(null);
    const dataStd = useRef<tf.Tensor | null>(null);
    const [numOfFeatures, setNumOfFeatures] = useState<number>(0);

    useEffect(() => {
        let isMounted = true;

        setLoading(true);
        setError(null);

        const dataset = tf.data.csv(ROBODOC_CSV_URL, {
            columnConfigs: { diabetes: { isLabel: true } }
        });
        const features: any[] = [];
        const target: any[] = [];

        dataset
            .columnNames()
            .then((columnNames) => {
                const nFeatures = columnNames.length - 1;

                setNumOfFeatures(nFeatures);

                dataset
                    .forEachAsync((e: any) => {
                        features.push(Object.values(e.xs));
                        target.push(e.ys.diabetes);
                    })
                    .then(() => {
                        shuffle(features, target);

                        const features_tensor_raw = tf.tensor2d(features, [
                            features.length,
                            nFeatures
                        ]);

                        const target_tensor = tf.tensor2d(target, [
                            target.length,
                            1
                        ]);

                        const { dataMean: mean, dataStd: std } =
                            determineMeanAndStddev(features_tensor_raw);

                        dataMean.current = mean;
                        dataStd.current = std;

                        const features_tensor_normalized = normalizeTensor(
                            features_tensor_raw,
                            mean,
                            std
                        );
                        const model = tf.sequential();
                        model.add(
                            tf.layers.dense({
                                inputShape: [nFeatures],
                                units: 50,
                                activation: 'relu'
                            })
                        );
                        model.add(
                            tf.layers.dense({ units: 1, activation: 'sigmoid' })
                        );
                        model.compile({
                            optimizer: tf.train.adam(),
                            loss: 'binaryCrossentropy',
                            metrics: ['accuracy']
                        });
                        model
                            .fit(features_tensor_normalized, target_tensor, {
                                batchSize: 40,
                                epochs: 10,
                                validationSplit: 0.2,
                                callbacks: {
                                    onEpochEnd: (_epoch: any, logs: any) => {
                                        if (
                                            isMounted &&
                                            logs?.val_acc !== undefined
                                        ) {
                                            setAccuracy(
                                                `${(logs.val_acc * 100).toFixed(2)}%`
                                            );
                                        }
                                    },
                                    onTrainEnd: () => {
                                        if (isMounted) setLoading(false);
                                    }
                                }
                            })
                            .then(() => {
                                if (isMounted) setModel(model);
                            })
                            .catch((err: any) => {
                                setError(
                                    err.message || 'Erro ao treinar o modelo'
                                );
                                setLoading(false);
                            });
                    })
                    .catch((err: any) => {
                        setError(err.message || 'Erro ao carregar os dados');
                        setLoading(false);
                    });
            })
            .catch((err: any) => {
                setError(
                    err.message || 'Erro ao carregar os nomes das colunas'
                );
                setLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    function predictDiabetes(values: number[]) {
        if (!model || !dataMean.current || !dataStd.current) return null;

        return predict_normalized(
            model,
            values,
            dataMean.current,
            dataStd.current
        );
    }

    return {
        loading,
        error,
        accuracy,
        predictDiabetes,
        numOfFeatures
    };
}

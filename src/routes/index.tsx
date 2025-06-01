import { useState } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { useDiabetesModel } from '../hooks/use-diabetes-model';

export const Route = createFileRoute('/')({
    component: Home
});

function Home() {
    const { loading, error, accuracy, predictDiabetes, numOfFeatures } =
        useDiabetesModel();
    const [inputValues, setInputValues] = useState(
        Array(numOfFeatures).fill('')
    );
    const [prediction, setPrediction] = useState<number | null>(null);
    const [predicting, setPredicting] = useState(false);

    const handleChange = (idx: number, value: string) => {
        const arr = [...inputValues];
        arr[idx] = value;
        setInputValues(arr);
    };

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        setPredicting(true);
        const values = inputValues.map(Number);
        const result = await predictDiabetes(values);
        setPrediction(result);
        setPredicting(false);
    };

    return (
        <>
            <div>
                <h1 className="text-4xl font-extralight">
                    Detecção de diabetes
                </h1>
                <p className="font-light text-gray-500">
                    Descubra se você tem alto risco de diabetes.
                </p>
            </div>

            <img
                src="./diabetes.webp"
                alt="Diabetes"
                className="h-[500px] w-full rounded-lg object-cover"
            />

            <p className="text-justify font-light text-gray-800">
                O conjunto de dados para previsão de diabetes é uma coleção de
                dados médicos e demográficos de pacientes, juntamente com seu
                status de diabetes (positivo ou negativo). Os dados incluem
                características como idade, sexo, índice de massa corporal
                (IMC), hipertensão, doenças cardíacas, histórico de tabagismo,
                nível de HbA1c e nível de glicose no sangue. Este conjunto de
                dados pode ser usado para construir modelos de aprendizado de
                máquina para prever diabetes em pacientes com base em seu
                histórico médico e informações demográficas. Isso pode ser útil
                para profissionais de saúde na identificação de pacientes que
                podem estar em risco de desenvolver diabetes e no
                desenvolvimento de planos de tratamento personalizados.
                Adicionalmente, o conjunto de dados pode ser usado por
                pesquisadores para explorar as relações entre vários fatores
                médicos e demográficos e a probabilidade de desenvolver
                diabetes.{' '}
                <a
                    className="font-medium text-blue-500 hover:underline"
                    href="https://www.kaggle.com/datasets/iammustafatz/diabetes-prediction-dataset"
                    target="_blank"
                >
                    Leia mais sobre.
                </a>
            </p>

            <div className="-mb-2">
                <h2 className="text-2xl font-extralight">
                    Previsão de diabetes
                </h2>

                <p className="font-light text-gray-500">
                    Informe o nível de HbA1c para prever o risco de diabetes.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="hba1c"
                    className="text-sm font-light text-gray-500"
                >
                    Nível de HbA1c
                </label>

                <input
                    id="hba1c"
                    type="number"
                    min={0}
                    max={10}
                    onChange={(e) => {}}
                    onInput={(e) => {}} // TODO: valida caso maior de 10 forcar 10
                    className="rounded-lg border border-gray-300 p-2"
                />

                {error && (
                    <span className="text-sm text-red-500">Erro: {error}</span>
                )}

                {loading && (
                    <span className="text-sm font-light text-gray-500">
                        Treinando modelo, aguarde...
                    </span>
                )}

                <button
                    type="submit"
                    className="mt-2 rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
                    disabled={loading || predicting}
                >
                    {predicting ? 'Calculando...' : 'Prever diabetes'}
                </button>

                {prediction !== null && (
                    <span className="text-lg font-bold">
                        Risco previsto:{' '}
                        {prediction > 0.5
                            ? 'ALTO (provável diabetes)'
                            : 'BAIXO (pouco provável)'}{' '}
                        ({(prediction * 100).toFixed(1)}%)
                    </span>
                )}
            </div>

            <div className="-mb-2">
                <h2 className="text-2xl font-extralight">
                    Treinamento do modelo
                </h2>

                <p className="font-light text-gray-500">
                    Acurácia do modelo:{' '}
                    <span className="font-bold text-green-600">{accuracy}</span>
                </p>
            </div>
        </>
    );
}

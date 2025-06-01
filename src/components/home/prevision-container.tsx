import { useRef, useState } from 'react';

export function PrevisionContainer({
    error,
    loading,
    training,
    handlePredict
}: {
    error: string | null;
    loading: boolean;
    training: boolean;
    handlePredict: (inputData: number) => number | null;
}) {
    const inputData = useRef<number>(0);
    const [prediction, setPrediction] = useState<number | null>(null);

    return (
        <div className="flex flex-col gap-4">
            <div className="-mb-2">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-extralight">
                        Previsão de diabetes
                    </h2>
                    <div className="flex-1 border-b border-gray-300" />
                </div>

                <p className="font-light text-gray-500">
                    Informe o nível de HbA1c para prever o risco de diabetes.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="hba1c"
                    className="text-sm font-light text-gray-500"
                >
                    Nível de HbA1c (%)
                </label>

                <input
                    id="hba1c"
                    type="number"
                    min={3}
                    max={15}
                    step={0.1}
                    placeholder="Ex: 6.5"
                    onChange={(e) =>
                        (inputData.current = Number(e.target.value))
                    }
                    className="rounded-lg border border-gray-300 p-2"
                />

                {error && (
                    <span className="text-sm text-red-500">Erro: {error}</span>
                )}

                {loading && !training && (
                    <span className="text-sm font-light text-gray-500">
                        Carregando dados, aguarde...
                    </span>
                )}

                {training && (
                    <span className="text-sm font-light text-blue-500">
                        Treinando modelo, aguarde...
                    </span>
                )}

                <button
                    type="button"
                    onClick={() =>
                        setPrediction(handlePredict(inputData.current))
                    }
                    className="mt-2 cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                    disabled={loading || training}
                >
                    Prever diabetes
                </button>

                {prediction !== null && (
                    <div className="mt-2 rounded-lg border border-gray-300 p-3">
                        <span className="text-lg font-light">
                            Risco previsto:{' '}
                            <span
                                data-risk={prediction > 0.5}
                                className="data-[risk=false]:text-green-600 data-[risk=true]:text-red-600"
                            >
                                {prediction > 0.5
                                    ? 'ALTO (provável diabetes)'
                                    : 'BAIXO (pouco provável)'}{' '}
                                ({(prediction * 100).toFixed(1)}%)
                            </span>
                        </span>

                        <div className="mt-2 text-sm text-gray-600">
                            {prediction > 0.65 && (
                                <p>
                                    ⚠️ Recomenda-se procurar um médico para
                                    avaliação completa.
                                </p>
                            )}
                            {prediction <= 0.65 && prediction > 0.35 && (
                                <p>⚡ Considere acompanhamento médico.</p>
                            )}
                            {prediction <= 0.35 && (
                                <p>
                                    ✅ Baixo risco, mas mantenha hábitos
                                    saudáveis.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

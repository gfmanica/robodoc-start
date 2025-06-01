import { useEffect } from 'react';

export function TrainingContainer({
    model,
    accuracy,
    renderTrainingGraphs,
    trainingHistory
}: {
    model: boolean;
    accuracy: string;
    renderTrainingGraphs?: (containerId: string) => void;
    trainingHistory?: any[];
}) {
    useEffect(() => {
        // Renderizar gráficos em tempo real durante o treinamento
        if (
            renderTrainingGraphs &&
            trainingHistory &&
            trainingHistory.length > 0
        ) {
            renderTrainingGraphs('training-graphs-container');
        }
    }, [renderTrainingGraphs, trainingHistory]);

    return (
        <>
            <div>
                <h2 className="mb-2 text-2xl font-extralight">
                    Informações do modelo
                </h2>

                <div className="space-y-2 text-sm font-light text-gray-600">
                    <p>
                        Status:{' '}
                        <span
                            className={`font-medium ${
                                model ? 'text-green-600' : 'text-orange-600'
                            }`}
                        >
                            {model
                                ? 'Modelo treinado e pronto'
                                : 'Aguardando treinamento'}
                        </span>
                    </p>

                    <p>
                        Acurácia:{' '}
                        <span className="font-bold text-green-600">
                            {accuracy || 'Calculando...'}
                        </span>
                    </p>

                    <p>
                        Feature utilizada:{' '}
                        <span className="font-medium">
                            HbA1c_level (Hemoglobina Glicada)
                        </span>
                    </p>

                    <p className="text-xs text-gray-500">
                        Modelo simplificado focado exclusivamente no nível de
                        HbA1c para diagnóstico rápido.
                    </p>
                </div>

                {/* Área para exibir os gráficos do TensorFlow.js */}
                <div className="mt-6">
                    <h3 className="mb-4 text-lg font-extralight">
                        Gráficos de Treinamento
                    </h3>

                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                        {/* Container para os gráficos do TensorFlow.js */}
                        <div
                            id="training-graphs-container"
                            className="min-h-[300px] w-full"
                        >
                            {!trainingHistory?.length && (
                                <div className="flex h-[300px] items-center justify-center text-gray-500">
                                    <p>
                                        Os gráficos aparecerão aqui durante o
                                        treinamento...
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Status do treinamento */}
                        {trainingHistory && trainingHistory.length > 0 && (
                            <div className="mt-4 border-t pt-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-700">
                                        Progresso do Treinamento
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">
                                            Época: {trainingHistory.length}/50
                                        </span>
                                        {!model && (
                                            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                                        )}
                                        {model && (
                                            <span className="text-xs font-medium text-green-600">
                                                ✅ Concluído
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <p className="mb-1 font-medium text-gray-600">
                                            Acurácia Atual:
                                        </p>
                                        <div className="h-4 rounded bg-gray-200">
                                            <div
                                                className="h-full rounded bg-green-500 transition-all duration-300"
                                                style={{
                                                    width: `${Math.min(100, (trainingHistory[trainingHistory.length - 1]?.val_acc || 0) * 100)}%`
                                                }}
                                            />
                                        </div>
                                        <span className="text-green-600">
                                            {(
                                                (trainingHistory[
                                                    trainingHistory.length - 1
                                                ]?.val_acc || 0) * 100
                                            ).toFixed(1)}
                                            %
                                        </span>
                                    </div>

                                    <div>
                                        <p className="mb-1 font-medium text-gray-600">
                                            Perda Atual:
                                        </p>
                                        <div className="h-4 rounded bg-gray-200">
                                            <div
                                                className="h-full rounded bg-red-500 transition-all duration-300"
                                                style={{
                                                    width: `${Math.min(100, (1 - Math.min(1, trainingHistory[trainingHistory.length - 1]?.val_loss || 1)) * 100)}%`
                                                }}
                                            />
                                        </div>
                                        <span className="text-red-600">
                                            {(
                                                trainingHistory[
                                                    trainingHistory.length - 1
                                                ]?.val_loss || 0
                                            ).toFixed(4)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

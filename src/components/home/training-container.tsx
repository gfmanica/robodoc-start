import { useEffect } from 'react';

import { ROBODOC_CSV_VIEW_URL } from '@/constants';

export function TrainingContainer({
    model,
    accuracy,
    renderTrainingGraphs,
    trainingHistory,
    visualizeDataset,
    datasetReady,
    confusionMatrix
}: {
    model: boolean;
    accuracy: string;
    renderTrainingGraphs?: (containerId: string) => void;
    trainingHistory?: any[];
    visualizeDataset?: (containerId: string) => void;
    datasetReady?: boolean;
    confusionMatrix?: { tp: number; fp: number; fn: number; tn: number } | null;
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

    useEffect(() => {
        // Visualizar dataset quando estiver pronto
        if (visualizeDataset && datasetReady) {
            visualizeDataset('dataset-visualization-container');
        }
    }, [visualizeDataset, datasetReady]);

    return (
        <>
            <div>
                <div className="mb-2 flex items-center gap-2">
                    <h2 className="text-2xl font-extralight">
                        Informações do treinamento
                    </h2>

                    <div className="flex-1 border-b border-gray-300" />
                </div>

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
                        Gráficos de treinamento
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

                {/* Matriz de Confusão */}
                {confusionMatrix && (
                    <div className="mt-6">
                        <h3 className="mb-4 text-lg font-extralight">
                            Matriz de confusão
                        </h3>

                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <p className="mb-4 text-sm text-gray-600">
                                Comparação entre diagnósticos reais e previsões
                                do modelo.
                            </p>

                            {/* Matriz de Confusão Visual Simplificada */}
                            <div className="mx-auto max-w-lg">
                                <div className="mb-6 text-center">
                                    <div className="mb-2 text-sm font-medium text-gray-700">
                                        Diagnóstico Real × Previsão do Modelo
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Acertos */}
                                    <div className="col-span-2 mb-2 text-center text-sm font-semibold text-green-700">
                                        ✅ ACERTOS
                                    </div>

                                    <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 text-center">
                                        <div className="mb-2 text-xs font-medium text-green-700 uppercase">
                                            Sem Diabetes Correto
                                        </div>
                                        <div className="text-2xl font-bold text-green-800">
                                            {(confusionMatrix.tn * 100).toFixed(
                                                1
                                            )}
                                            %
                                        </div>
                                        <div className="mt-1 text-xs text-green-600">
                                            Real: Saudável
                                            <br />
                                            Previsto: Saudável
                                        </div>
                                    </div>

                                    <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 text-center">
                                        <div className="mb-2 text-xs font-medium text-green-700 uppercase">
                                            Com Diabetes Correto
                                        </div>
                                        <div className="text-2xl font-bold text-green-800">
                                            {(confusionMatrix.tp * 100).toFixed(
                                                1
                                            )}
                                            %
                                        </div>
                                        <div className="mt-1 text-xs text-green-600">
                                            Real: Diabetes
                                            <br />
                                            Previsto: Diabetes
                                        </div>
                                    </div>

                                    {/* Erros */}
                                    <div className="col-span-2 mt-4 mb-2 text-center text-sm font-semibold text-red-700">
                                        ❌ ERROS
                                    </div>

                                    <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 text-center">
                                        <div className="mb-2 text-xs font-medium text-red-700 uppercase">
                                            Falso Alarme
                                        </div>
                                        <div className="text-2xl font-bold text-red-800">
                                            {(confusionMatrix.fp * 100).toFixed(
                                                1
                                            )}
                                            %
                                        </div>
                                        <div className="mt-1 text-xs text-red-600">
                                            Real: Saudável
                                            <br />
                                            Previsto: Diabetes
                                        </div>
                                    </div>

                                    <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4 text-center">
                                        <div className="mb-2 text-xs font-medium text-orange-700 uppercase">
                                            Não Detectado
                                        </div>
                                        <div className="text-2xl font-bold text-orange-800">
                                            {(confusionMatrix.fn * 100).toFixed(
                                                1
                                            )}
                                            %
                                        </div>
                                        <div className="mt-1 text-xs text-orange-600">
                                            Real: Diabetes
                                            <br />
                                            Previsto: Saudável
                                        </div>
                                    </div>
                                </div>

                                {/* Resumo dos Resultados */}
                                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                                    <div className="text-center">
                                        <div className="mb-2 text-sm font-medium text-gray-700">
                                            Resumo da Performance
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                            <div>
                                                <span className="font-medium text-green-600">
                                                    Acertos Total:
                                                </span>
                                                <div className="text-lg font-bold text-green-700">
                                                    {(
                                                        (confusionMatrix.tp +
                                                            confusionMatrix.tn) *
                                                        100
                                                    ).toFixed(1)}
                                                    %
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-medium text-red-600">
                                                    Erros Total:
                                                </span>
                                                <div className="text-lg font-bold text-red-700">
                                                    {(
                                                        (confusionMatrix.fp +
                                                            confusionMatrix.fn) *
                                                        100
                                                    ).toFixed(1)}
                                                    %
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Métricas Técnicas */}
                            <div className="mt-6 border-t border-gray-200 pt-4">
                                <h4 className="mb-3 text-center text-sm font-medium text-gray-700">
                                    Métricas Técnicas
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div className="rounded bg-blue-50 p-3 text-center">
                                        <div className="mb-1 font-medium text-blue-700">
                                            Sensibilidade
                                        </div>
                                        <div className="text-lg font-bold text-blue-800">
                                            {(
                                                (confusionMatrix.tp /
                                                    (confusionMatrix.tp +
                                                        confusionMatrix.fn)) *
                                                100
                                            ).toFixed(1)}
                                            %
                                        </div>
                                        <div className="text-blue-600">
                                            Detecta diabetes
                                        </div>
                                    </div>

                                    <div className="rounded bg-purple-50 p-3 text-center">
                                        <div className="mb-1 font-medium text-purple-700">
                                            Especificidade
                                        </div>
                                        <div className="text-lg font-bold text-purple-800">
                                            {(
                                                (confusionMatrix.tn /
                                                    (confusionMatrix.tn +
                                                        confusionMatrix.fp)) *
                                                100
                                            ).toFixed(1)}
                                            %
                                        </div>
                                        <div className="text-purple-600">
                                            Detecta saudáveis
                                        </div>
                                    </div>

                                    <div className="rounded bg-green-50 p-3 text-center">
                                        <div className="mb-1 font-medium text-green-700">
                                            Precisão
                                        </div>
                                        <div className="text-lg font-bold text-green-800">
                                            {(
                                                (confusionMatrix.tp /
                                                    (confusionMatrix.tp +
                                                        confusionMatrix.fp)) *
                                                100
                                            ).toFixed(1)}
                                            %
                                        </div>
                                        <div className="text-green-600">
                                            Confiança diabetes
                                        </div>
                                    </div>

                                    <div className="rounded bg-indigo-50 p-3 text-center">
                                        <div className="mb-1 font-medium text-indigo-700">
                                            F1-Score
                                        </div>
                                        <div className="text-lg font-bold text-indigo-800">
                                            {(() => {
                                                const precision =
                                                    confusionMatrix.tp /
                                                    (confusionMatrix.tp +
                                                        confusionMatrix.fp);
                                                const recall =
                                                    confusionMatrix.tp /
                                                    (confusionMatrix.tp +
                                                        confusionMatrix.fn);
                                                const f1 =
                                                    (2 * (precision * recall)) /
                                                    (precision + recall);
                                                return (f1 * 100).toFixed(1);
                                            })()}
                                            %
                                        </div>
                                        <div className="text-indigo-600">
                                            Equilíbrio geral
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Área para exibir o gráfico de visualização do dataset */}
                <div className="mt-6">
                    <h3 className="mb-4 text-lg font-extralight">
                        Visualização do dataset
                    </h3>

                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <p className="mb-4 text-sm text-gray-600">
                            Distribuição dos dados por nível de HbA1c e presença
                            de diabetes.
                        </p>

                        <div
                            id="dataset-visualization-container"
                            className="min-h-[300px] w-full"
                        >
                            {!datasetReady && (
                                <div className="flex h-[300px] items-center justify-center text-gray-500">
                                    <p>Carregando dados do dataset...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Visualização dos dados originais */}
                <div className="mt-6">
                    <h3 className="mb-4 text-lg font-extralight">
                        Dados originais
                    </h3>

                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <p className="mb-4 text-sm text-gray-600">
                            Planilha completa com todos os dados utilizados no
                            treinamento do modelo.
                        </p>

                        <div className="w-full">
                            <iframe
                                src={ROBODOC_CSV_VIEW_URL}
                                className="w-full rounded border border-gray-300"
                                style={{ height: '500px' }}
                                title="Dataset Diabetes - Dados Originais"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function TrainingInfoContainer({
    model,
    accuracy
}: {
    model: boolean;
    accuracy: string;
}) {
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
            </div>
        </>
    );
}

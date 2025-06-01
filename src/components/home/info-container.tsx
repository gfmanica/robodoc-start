export function InfoContainer() {
    return (
        <>
            <div>
                <h1 className="text-4xl font-extralight">
                    Detecção de diabetes
                </h1>
                <p className="font-light text-gray-500">
                    Descubra se você tem alto risco de diabetes baseado no seu
                    nível de HbA1c.
                </p>
            </div>

            <img
                src="./diabetes.webp"
                alt="Diabetes"
                className="h-[500px] w-full rounded-lg object-cover"
            />

            <p className="text-justify font-light text-gray-800">
                A hemoglobina glicada (HbA1c) é um exame que mostra a média dos
                níveis de glicose no sangue dos últimos 2 a 3 meses. É um dos
                principais indicadores para diagnóstico e controle do diabetes.
                Este modelo de machine learning foi treinado para prever o risco
                de diabetes baseado exclusivamente no nível de HbA1c do
                paciente, oferecendo uma avaliação rápida e objetiva.{' '}
                <a
                    className="font-medium text-blue-500 hover:underline"
                    href="https://www.kaggle.com/datasets/iammustafatz/diabetes-prediction-dataset"
                    target="_blank"
                >
                    Leia mais sobre o dataset.
                </a>
            </p>
        </>
    );
}

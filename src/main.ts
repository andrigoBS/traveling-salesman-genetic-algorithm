import GeneticAlgorithm from "./genetic-algorithm/genetic-algorithm";
import fs from 'fs/promises';
import CitiesJson from "./CitiesJson";

class Main {
    constructor(
        private readonly jsonPath: string,
        private readonly debug: boolean = false
    ) {}
    async run(
        population: number = 10,
        epochs: number = 100,
        startCityIndex: number = 0,
        survivors: number = 5,
        mutations: number = 5,
        players: number = 3,
    ) {
        const file = await fs.readFile(this.jsonPath);
        const json: CitiesJson = JSON.parse(file.toString());

        const geneticAlgorithm = GeneticAlgorithm.fromNumberWeightMatrix(
            json.distances,
            json.cities,
            json.cities[startCityIndex],
            population,
            survivors,
            mutations,
            players,
        );

        console.log('Exemplo', this.jsonPath);
        console.log('Quantidade de cidades', json.cities.length);
        console.log('Cidades', json.cities.join(','));
        console.log('Caminho ótimo conhecido', json.optimal_path.join(' -> '));
        console.log('Distancia do caminho ótimo conhecido', json.optimal_distance);
        console.log('Cidade de saida', json.cities[startCityIndex]);
        console.log('Tamanho da população', population);
        console.log('Porcentagem de sobreviventes por época', survivors);
        console.log('Porcentagem de mutação', mutations);
        console.log('Competidores na seleção de pais', players);
        console.log('Épocas', epochs);
        console.log('Executando....');

        if(this.debug) {
            let results = geneticAlgorithm.execute(epochs, 3);
            for (let i = 0; i < results.length; i++) {
                console.log('------------------------------------------------------------')
                console.log('Época ', i);
                for (let j = 0; j < results[i].length; j++) {
                    console.log((j + 1), '° Melhor caminho ', results[i][j].individual.join(' -> '));
                    console.log('Distancia do ', (j + 1), '° melhor caminho ', results[i][j].weight);
                }
            }
        } else {
            geneticAlgorithm.execute(epochs, 1);
            const result = geneticAlgorithm.getBestsIndividual(1);
            console.log('Melhor caminho ', result[0].individual.join(' -> '));
            console.log('Distancia do melhor caminho ', result[0].weight);
        }
    }
}

await new Main('./in/13cities.json').run(100, 1000);
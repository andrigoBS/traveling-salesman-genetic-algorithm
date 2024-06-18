import fs from "fs/promises";
import CitiesJson from "./CitiesJson";
import GeneticAlgorithm from "./genetic-algorithm/genetic-algorithm";

class MainInfinite {
    async run(jsonPath: string): Promise<void> {
        const json = await this.loadJson(jsonPath);
        console.log(jsonPath);

        const geneticAlgorithm = GeneticAlgorithm.fromNumberWeightMatrix(
            json.distances,
            json.cities,
            json.cities[0],
            200,
            10,
            25,
            10,
        );

        let weightEpoch = json.optimal_distance + 100;
        let countEpoch = 0;

        while (weightEpoch >= json.optimal_distance) {
            const algorithm = geneticAlgorithm.executeEpoch().getBestsIndividual(1)[0];

            console.log('Epoch', countEpoch)
            console.log('No json', json.optimal_distance);
            console.log('No algoritimo', algorithm.weight);
            console.log('Caminho do json      ', '"'+json.optimal_path.join('", "')+'"');
            console.log('Caminho do Algoritimo', '"' + algorithm.individual.join('", "') + '"');

            countEpoch += 1;
            weightEpoch = algorithm.weight;
        }
    }

    private async loadJson(jsonPath: string): Promise<CitiesJson> {
        const file = await fs.readFile(jsonPath);
        return JSON.parse(file.toString());
    }
}

await new MainInfinite().run('./in/20cities.json');
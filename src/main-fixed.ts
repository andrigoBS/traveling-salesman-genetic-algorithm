import {Node, ResultEpoch} from "./genetic-algorithm/population/types";
import fs from "fs/promises";
import CitiesJson from "./CitiesJson";
import GeneticAlgorithm from "./genetic-algorithm/genetic-algorithm";

class MainFixed {
    async runAll(): Promise<void> {
        for (let i = 15; i <= 20; i++) {
            await this.run(`./in/${i}cities.json`);
        }
    }

    async run(jsonPath: string): Promise<void> {
        const json = await this.loadJson(jsonPath);

        const map = this.convertMatrixToMap(json.distances, json.cities);

        const count = this.calculateWeight(map, json.optimal_path);

        const algorithm = this.algorithmRun(json);

        console.log('----------------------------------------------');
        console.log(jsonPath);
        console.log('Calculado', count);
        console.log('No json', json.optimal_distance);
        console.log('No algoritimo', algorithm.weight);
        console.log('Caminho do json      ', '"'+json.optimal_path.join('", "')+'"');
        console.log('Caminho do Algoritimo', '"'+algorithm.individual.join('", "')+'"');
        console.log('----------------------------------------------');
    }

    private async loadJson(jsonPath: string): Promise<CitiesJson> {
        const file = await fs.readFile(jsonPath);
        return JSON.parse(file.toString());
    }

    private convertMatrixToMap(weightMatrix: number[][], orderedNodesByMatrixIndex: Node[]): Map<Node, Map<Node, number>> {
        const map = new Map<Node, Map<Node, number>>();

        for (let i = 0; i < weightMatrix.length; i++) {
            const subMap = new Map<Node, number>;
            for (let j = 0; j < weightMatrix[i].length; j++) {
                subMap.set(orderedNodesByMatrixIndex[j], weightMatrix[i][j]);
            }
            map.set(orderedNodesByMatrixIndex[i], subMap);
        }

        return map;
    }

    private calculateWeight(weightMatrix: Map<Node, Map<Node, number>>, sequenceNode: Node[]): number {
        let total = 0;
        for (let i = 0; i < sequenceNode.length - 1; i++){
            total += weightMatrix.get(sequenceNode[i])?.get(sequenceNode[i+1]) || 0;
        }
        return total;
    }

    private algorithmRun(json: CitiesJson): ResultEpoch {
        const geneticAlgorithm = GeneticAlgorithm.fromNumberWeightMatrix(
            json.distances,
            json.cities,
            json.cities[0],
            200,
            10,
            10,
            10,
        );

        geneticAlgorithm.execute(1000, 1);
        const result = geneticAlgorithm.getBestsIndividual(1);
        return result[0];
    }
}

await new MainFixed().runAll();
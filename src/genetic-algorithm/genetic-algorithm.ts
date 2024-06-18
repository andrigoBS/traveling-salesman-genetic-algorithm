import Individual from "./population/individual";
import Population from "./population/population";
import {Node, ResultEpoch} from "./population/types";

export default class GeneticAlgorithm {
    static fromNumberWeightMatrix(
        weightMatrix: number[][],
        orderedNodesByMatrixIndex: Node[],
        startCity: Node,
        populationLength: number,
        survivorsPercentage: number,
        mutationPercentage: number,
        playerNumberTournament: number,
    ): GeneticAlgorithm {
        const map = new Map<Node, Map<Node, number>>();

        for (let i = 0; i < weightMatrix.length; i++) {
            const subMap = new Map<Node, number>;
            for (let j = 0; j < weightMatrix[i].length; j++) {
                subMap.set(orderedNodesByMatrixIndex[j], weightMatrix[i][j]);
            }
            map.set(orderedNodesByMatrixIndex[i], subMap);
        }

        return new GeneticAlgorithm(map, startCity, populationLength, survivorsPercentage, mutationPercentage, playerNumberTournament);
    }

    private readonly population: Population;
    constructor(
        private readonly weightMatrix: Map<Node, Map<Node, number>>,
        startCity: Node,
        private readonly populationLength: number,
        private readonly survivorsPercentage: number,
        private readonly mutationPercentage: number,
        private readonly playerNumberTournament: number,
    ) {
        this.population = Population.fromRandom(weightMatrix, startCity, populationLength);
    }

    public execute(epochs: number, howMuchSaveBestsPerEpoch: number): ResultEpoch[][] {
        const results: ResultEpoch[][] = [];
        for (let i = 0; i < epochs; i++) {
            this.executeEpoch();
            results.push(this.getBestsIndividual(howMuchSaveBestsPerEpoch));
        }
        return results;
    }

    public executeEpoch(): GeneticAlgorithm {
        const newPopulation = new Population([]);
        for (let i = 0; i < this.populationLength; i++) {
            const parents = [
                this.population.selectOneIndividualByTournament(this.playerNumberTournament),
                this.population.selectOneIndividualByTournament(this.playerNumberTournament)
            ];

            const newIndividual = Individual
                .fromCrossover(parents[0], parents[1])
                .mutation(this.mutationPercentage)
                .calculateWeight(this.weightMatrix);

            newPopulation.addIndividual(newIndividual);
        }

        this.population.merge(newPopulation, this.survivorsPercentage);

        return this;
    }

    public getBestsIndividual(bestsCount: number): ResultEpoch[] {
        return this.population.getBestsIndividuals(bestsCount).map(individual => ({
            individual: individual.get(),
            weight: individual.getWeight()
        }));
    }
}
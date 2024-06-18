import Individual from "./individual";
import {Node} from "./types";

export default class Population {
    static fromRandom(weightMatrix: Map<Node, Map<Node, number>>, startCity: Node, populationLength: number): Population {
        const population = new Population([]);
        for (let i = 0; i < populationLength; i++) {
            population.addIndividual(Individual.fromRandom(weightMatrix, startCity));
        }
        return population;
    }

    constructor(
        private population: Individual[]
    ) {}

    public addIndividual(individual: Individual): void {
        this.population.push(individual);
    }

    public getRandomIndividual(): Individual {
        return this.population[Math.floor(Math.random() * this.population.length)];
    }

    public selectOneIndividualByTournament(playerLength: number): Individual {
        const players: Individual[] = [];
        for (let i = 0; i < playerLength; i++) {
            players.push(this.getRandomIndividual());
        }
        return this.getBests(players, 1)[0];
    }

    public getBestsIndividuals(bestsCount: number): Individual[] {
        return this.getBests(this.population, bestsCount);
    }

    public merge(newPopulation: Population, survivorsPercentage: number): void {
        const survivorsCount = (survivorsPercentage * this.population.length) / 100;
        const bestOldPopulation = this.getBestsIndividuals(survivorsCount);
        const bestNewPopulation = newPopulation.getBestsIndividuals(this.population.length - survivorsCount);
        this.population = [...bestOldPopulation, ...bestNewPopulation];
    }

    private getBests(individuals: Individual[], bestCount: number): Individual[] {
        let bests: Individual[] = []
        for (let i = 0; i < bestCount; i++) {
            let bestIndividual: Individual | null = null;
            for (let j = 0; j < individuals.length; j++) {
                if(bests.includes(individuals[j])) {
                    continue;
                }
                if(bestIndividual === null || individuals[j].getWeight() < bestIndividual.getWeight()) {
                    bestIndividual = individuals[j];
                }
            }
            if(bestIndividual) {
                bests.push(bestIndividual);
            }
        }

        return bests;
    }
}
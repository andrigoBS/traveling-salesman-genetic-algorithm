import {Node} from "./types";

export default class Individual {
    static fromRandom(weightMatrix: Map<Node, Map<Node, number>>, startCity: Node): Individual {
        let sequence = [...weightMatrix.keys()];
        sequence.push(startCity);

        return new Individual(sequence)
            .mutation(75)
            .calculateWeight(weightMatrix);
    }

    static fromCrossover(parent1: Individual, parent2: Individual): Individual {
        const cutPoint = Math.floor(Math.random() * parent1.sequenceNode.length);
        const sequence: Node[] = parent1.sequenceNode.slice(0, cutPoint);
        for (let node of parent2.sequenceNode) {
            if(!sequence.includes(node)) {
                sequence.push(node);
            }
        }
        sequence.push(parent1.sequenceNode[0]);
        return new Individual(sequence);
    }

    private weight: number;

    private constructor(
        private readonly sequenceNode: Node[],
    ) {
        this.weight = 0;
    }

    calculateWeight(weightMatrix: Map<Node, Map<Node, number>>): Individual {
        let total = 0;
        for (let i = 0; i < this.sequenceNode.length - 1; i++){
            total += weightMatrix.get(this.sequenceNode[i])?.get(this.sequenceNode[i+1]) || 0;
        }
        this.weight = total;
        return this;
    }

    mutation(mutationPercentage: number): Individual {
        const mutationLength = (mutationPercentage * this.sequenceNode.length) / 100;
        for(let i = 0; i < Math.round(mutationLength); i++) {
            const indexNode1 = Math.floor((Math.random() * (this.sequenceNode.length - 2)) + 1);
            const indexNode2 = Math.floor((Math.random() * (this.sequenceNode.length - 2)) + 1);
            const temp = this.sequenceNode[indexNode1];
            this.sequenceNode[indexNode1] = this.sequenceNode[indexNode2];
            this.sequenceNode[indexNode2] = temp;
        }
        return this;
    }

    getWeight(): number {
        return this.weight;
    }

    get(): Node[] {
        return this.sequenceNode;
    }
}
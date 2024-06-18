import {Node} from "./genetic-algorithm/population/types";

export default interface CitiesJson {
    distances: number[][];
    cities: Node[];
    optimal_path: Node[];
    optimal_distance: number;
}
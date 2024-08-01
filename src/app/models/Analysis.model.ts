import { iTest } from "./Test.model"

export class Analysis{
  id: number
  constructor(
    public code: string,
    public name: string,
    public description: string,
    public price: number,
    public Tests: iTest[]
  ){

    this.code = code
    this.name = name
    this.description = description
    this.price = price
    this.Tests = Tests
  }

}

export interface iAnalysis extends Analysis{}



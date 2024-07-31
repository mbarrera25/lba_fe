export class Test{
  id: number
  constructor(
    public code: string,
    public name: string,
    public description: string,
    public price: number,
    public TestDetails: iTestDetail[]
  ){

    this.code = code
    this.name = name
    this.description = description
    this.price = price
    this.TestDetails = TestDetails
  }

}

export class TestDetail {
  id: number
  constructor(
    public name:string,
    public list_value: string,
    public indicator: string,
  ){
    this.name= name
    this.list_value= list_value
    this.indicator= indicator
  }
}

export interface iTest extends Test{}


export interface iTestDetail extends TestDetail{}

import { Question, QuestionSelectBase, ItemValue } from "survey-core";
import { VisualizerBase } from "./visualizerBase";

export class SelectBase extends VisualizerBase {
  constructor(
    protected targetElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetElement, question, data, options);
  }

  protected chartTypes: string[];
  protected chartType: string;
  protected chartNode: HTMLElement = <HTMLElement>document.createElement("div");

  protected setChartType(chartType: string) {
    if (
      this.chartTypes.indexOf(chartType) !== -1 &&
      this.chartType !== chartType
    ) {
      this.chartType = chartType;
      this.createChart();
      this.invokeOnUpdate();
    }
  }

  createChart() {}

  onDataItemSelected: (selectedValue: any, clearSelection: boolean) => void;

  render() {
    const chartNodeContainer = document.createElement("div");
    const toolbarNodeContainer = document.createElement("div");

    chartNodeContainer.appendChild(toolbarNodeContainer);
    chartNodeContainer.appendChild(this.chartNode);
    this.targetElement.appendChild(chartNodeContainer);

    this.createToolbar(toolbarNodeContainer);

    this.createChart();
  }

  protected createToolbarItems(toolbar: HTMLDivElement) {
    if (this.chartTypes.length > 0) {
      const selectWrapper = document.createElement("div");
      selectWrapper.className = "sva-question__select-wrapper";
      const select = document.createElement("select");
      select.className = "sva-question__select";
      this.chartTypes.forEach(chartType => {
        let option = document.createElement("option");
        option.value = chartType;
        option.text = chartType;
        option.selected = this.chartType === chartType;
        select.appendChild(option);
      });
      select.onchange = (e: any) => {
        this.setChartType(e.target.value);
      };
      selectWrapper.appendChild(select);
      toolbar.appendChild(selectWrapper);
    }
  }

  protected createToolbar(container: HTMLDivElement) {
    const toolbar = document.createElement("div");
    toolbar.className = "sva-question__toolbar";
    this.createToolbarItems(toolbar);
    container.appendChild(toolbar);
  }

  valuesSource(): any[] {
    const question = <QuestionSelectBase>this.question;
    return question["activeChoices"];
  }

  getValues(): Array<any> {
    const values: Array<any> = this.valuesSource().map(choice => choice.value);

    if (this.question.hasOther) values.unshift("other");

    return values;
  }

  getLabels(): Array<string> {
    const labels: Array<string> = this.valuesSource().map(choice =>
      ItemValue.getTextOrHtmlByValue(this.valuesSource(), choice.value)
    );

    if (this.question.hasOther) labels.unshift("Other");

    return labels;
  }

  getData(): any[] {
    const values = this.getValues();
    const statistics = values.map(v => 0);
    this.data.forEach(row => {
      const rowValue: any = row[this.question.name];
      if (!!rowValue) {
        if (Array.isArray(rowValue)) {
          values.forEach((val: any, index: number) => {
            if (rowValue.indexOf(val) !== -1) {
              statistics[index]++;
            }
          });
        } else {
          values.forEach((val: any, index: number) => {
            if (rowValue == val) {
              statistics[index]++;
            }
          });
        }
      }
    });
    return [statistics];
  }
}

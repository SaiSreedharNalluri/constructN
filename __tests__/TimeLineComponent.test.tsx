
import TimeLineComponent from "../components/divami_components/timeline-container/TimeLineComponent";
import { fireEvent, render, screen } from "@testing-library/react";
import { ISnapshot } from "../models/ISnapshot";
const currentSnapshot: ISnapshot = {
    createdAt:"2023-01-24T15:23:40.031Z",
date:"2023-1-06",
progress:-1,
project:"PRJ201897",
reality:[
    {capture:"CAP820581",
    completedDateTime :"2023-01-30T04:55:02.797Z",
    // createdAt :"2023-01-30T04:55:05.466Z",
    job :"JOB820391",
    mode :"Drone Image",
    snapshot   :    "SNP820031",
    status :"active",
    type:"exterior",
    // updatedAt:"2023-01-30T04:55:05.466Z",
    _id :"RLT832872"}
],
status:"Inactive",
structure:"STR536138",
updatedAt:"2023-01-30T04:55:05.466Z",
// visualizations:[]
}
beforeEach(() => {
    render(
        <TimeLineComponent currentSnapshot={currentSnapshot} snapshotList={[currentSnapshot]} snapshotHandler={() => {}} />
      );  
});

it("renders component unchanged", () => {
  const { container } = render(
    <TimeLineComponent currentSnapshot={currentSnapshot} snapshotList={[currentSnapshot]} snapshotHandler={() => {}} />
  );
  expect(container).toMatchSnapshot();
});

it("check the bottom toggle", () => {
    const timeline = screen.getByTestId(/selected-timeline/i);
      fireEvent.click(timeline);
  });
it("check the timeline changes", () => {
      const timeline = screen.getByTestId(/selected-timeline/i);
      fireEvent.click(timeline);
    const page = screen.getByTestId(/page/i);
      fireEvent.click(page);
  });
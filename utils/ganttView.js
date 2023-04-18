import JSGantt from 'jsgantt-improved';
//import task from '../project-plan-hierarchy.json';
export function getGanttView(data) {
  const ganttChartDiv = document.getElementById('GanttChartDIV');

  if (!ganttChartDiv) {
    console.error('Gantt chart element not found');
    return null;
  }
  var g = new JSGantt.GanttChart(ganttChartDiv, 'week');
  g.setEditable(true);
  g.setShowRes(0),
    g.setOptions({
      vCaptionType: 'Complete',
      vQuarterColWidth: 36,
      vDateTaskDisplayFormat: 'day dd month yyyy',
      vDayMajorDateDisplayFormat: 'mon yyyy - Week ww',
      vWeekMinorDateDisplayFormat: 'dd mon',
      vLang: 'en',
      vShowTaskInfoLink: 1,
      vShowEndWeekDate: 0,
      vUseSingleCell: 10000,
      vFormatArr: ['Day', 'Week', 'Month', 'Quarter', 'Year'],
      vScrollTo: new Date(),
    });
  JSGantt.parseJSONString(JSON.stringify(data), g);
  g.Draw();
}

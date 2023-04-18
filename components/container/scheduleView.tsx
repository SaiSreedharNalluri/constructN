import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Moment from 'moment';
interface IProp {
  treeData: any;
}
const ScheduleView: React.FC<IProp> = ({ treeData }) => {
  return (
    <React.Fragment>
      <table className="border-separate border  border-slate-50 w-96 font-sans text-xs ">
        <thead className="sticky top-0">
          <tr className="border-slate-500 bg-pink-50 ">
            <th className="border border-slate-50  w-1 bg-pink-50"></th>
            <th className="border border-slate-50">NAME</th>
            <th className="border border-slate-50">WBS ID</th>
            <th className="border border-slate-50">ACTUAL START</th>
            <th className="border border-slate-50">ACTUAL FINISH</th>
            <th className="border border-slate-50">PLANNED START</th>
            <th className="border border-slate-50">PLANNED FINISH</th>
            <th className="border border-slate-50">DURATION</th>
            <th className="border border-slate-50">PROGRESS</th>
          </tr>
        </thead>
        <tbody>
          {treeData.map((node: any) => (
            <TreeNode key={node.wbsId} node={node} level={0} />
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};
interface IProps {
  node: any;
  level: any;
}
const TreeNode: React.FC<IProps> = ({ node, level }) => {
  const children = node.children || [];
  const hasChild = node.children?.length ? true : false;
  const [visibility, setVisibility] = useState<any>({});
  const getICon = (level: number) => {
    if (!hasChild) {
      return;
    } else {
      return visibility[node.wbsId] ? (
        <FontAwesomeIcon
          style={{ marginLeft: `${level}rem` }}
          size="1x"
          icon={faAngleUp}
          rotation={180}
        />
      ) : (
        <FontAwesomeIcon
          style={{ marginLeft: `${level}rem` }}
          size="1x"
          icon={faAngleUp}
          rotation={90}
        />
      );
    }
  };
  return (
    <React.Fragment>
      <tr className=" border bg-pink-50">
        <td
          className={`border border-slate-50 bg-pink-50 flex`}
          onClick={() => {
            setVisibility({
              ...visibility,
              [node.wbsId]: !visibility[node.wbsId],
            });
          }}
        >
          {getICon(level)}
        </td>
        <td className={`border border-slate-200 bg-white`}>{node.name}</td>
        <td className="border border-slate-200  bg-white">{node.wbsId}</td>
        <td className="border border-slate-200  bg-white">
          <input type="date" className="w-full" />
        </td>
        <td className="border border-slate-200  bg-white ">
          <input type="date" className="w-full" />
        </td>
        <td className="border border-slate-200 bg-white text-center ">
          {Moment(node.plannedStart).format('DD - MMM - YYYY')}
        </td>
        <td className="border border-slate-200 bg-white text-center">
          {Moment(node.plannedEnd).format('DD - MMM - YYYY')}
        </td>
        <td className="border border-slate-200 bg-white text-center">
          {node.Duration}
        </td>
        <td className="border border-slate-200 bg-white text-center">
          {node.Progress ? node.Progress : 0}%
        </td>
      </tr>
      {hasChild &&
        visibility[node.wbsId] &&
        children.map((child: { wbsId: React.Key | null | undefined }) => (
          <TreeNode key={child.wbsId} node={child} level={level + 1} />
        ))}
    </React.Fragment>
  );
};
export default ScheduleView;

import React from "react";
import {
  Table
} from "reactstrap";

import eachDay from "date-fns/each_day";
import format from "date-fns/format";

export default class SummaryTable extends React.Component {
  render() {

    const {startDateRange, endDateRange, rowHeaders, data, leftUp} = this.props;
    const startDate = startDateRange || null;
    const endDate = endDateRange || null;

    let days = [];
    try {
      days = eachDay(startDate, endDate);
    } catch(e) {
    }

    const daysStrings = [];
    for (let day of days) {
      daysStrings.push(format(day, "YYYY-MM-DD"))
    }

    const getTableCellClassName = (variable) => {
      let score = 0;
      const scores  = {
        "na": 0,
        "verylow": 1,
        "low": 2,
        "medium": 3,
        "high": 4,
        "veryhigh": 5
      };
      const scoresReverse = {
        0: "na",
        1: "verylow",
        2: "low",
        3: "medium",
        4: "high",
        5: "veryhigh"
      };

      let count = 0;
      if (Array.isArray(variable)) {
        count = variable.length;
        for (let s of variable) {
          score += scores[s];
        }

        return scoresReverse[ Math.round(score/count) ];
      } else {
        return variable;
      }
    };
    
    const getRowClassName = (variable) => {
      if (variable === 'S') {
        return 'overallAssessmentScore';
      } else {
        return 'normal';
      }
    }

    return (
      <div className="summary-table">
        <Table bordered hover>
          <thead>
          <tr>
            <th>{ leftUp }</th>
            {
              daysStrings.map((item) =>
                <th key={item}>{ format(item, "DD/MM/YYYY") }</th>
              )
            }
          </tr>
          </thead>
          <tbody>
            {
              rowHeaders.map((item) =>
                <tr key={item.id}>
                  <td className={item.id ? getRowClassName(item.id) : null}>{ item.name }</td>
                  {
                    daysStrings.map((item2) =>
                      <td key={item2} className={data[item.id] && data[item.id][item2] ? getTableCellClassName(data[item.id][item2]) : null}>&nbsp;</td>
                    )
                  }
                </tr>
              )
            }
          </tbody>
        </Table>
      </div>
    );
  }
}
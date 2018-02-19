import * as React from 'react';
import {IROCReport, ICommonROC} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {bindActionCreators} from 'redux';
import {excludeBen, includeBen, BenFunc} from 'redux/modules/rocReport';
import {Table, Checkbox} from 'semantic-ui-react';
import {renderArray} from 'helpers/react';
import './style.less';
const { connect } = require('react-redux');

interface IProp {
  report: IROCReport;
  questionSet: IOutcomeSet;
  category?: boolean;
  excludedBeneficiaries: string[];
  excludeBen?: BenFunc;
  includeBen?: BenFunc;
}

interface IRowData {
  beneficiary: string;
  rocs: ICommonROC[];
}

@connect(undefined, (dispatch) => ({
  excludeBen: bindActionCreators(excludeBen, dispatch),
  includeBen: bindActionCreators(includeBen, dispatch),
}))
class RocReportBenTable extends React.Component<IProp, any> {

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.beneficiaryClicked = this.beneficiaryClicked.bind(this);
  }

  private beneficiaryClicked(benID: string, currentlyIncluded: boolean): () => void {
    return () => {
      if (currentlyIncluded) {
        this.props.excludeBen(benID);
      } else {
        this.props.includeBen(benID);
      }
    };
  }

  private renderRow(r: IRowData, idx: number): JSX.Element {
    const roc = r.rocs.reduce<number>((s, v) => s + v.value, 0) / r.rocs.length;
    const coverage = r.rocs.reduce<number>((s, v) => s + v.reportCoverage, 0) / r.rocs.length;
    const records = r.rocs.reduce<number>((s, v) => s + v.noRecords, 0) / r.rocs.length;
    const className = (idx % 2 === 0) ? '' : 'stripe';
    const included = this.props.excludedBeneficiaries.indexOf(r.beneficiary) === -1;
    return (
      <Table.Row className={className} key={r.beneficiary}>
        <Table.Cell>{r.beneficiary}</Table.Cell>
        <Table.Cell>{roc}</Table.Cell>
        <Table.Cell>{records}</Table.Cell>
        <Table.Cell>{coverage}</Table.Cell>
        <Table.Cell>
          <Checkbox
            checked={included}
            onChange={this.beneficiaryClicked(r.beneficiary, included)}
          />
        </Table.Cell>
      </Table.Row>
    );
  }

  private renderTable(props: IProp) {
    let rData: IRowData[];
    if (props.category) {
      rData = props.report.beneficiaries.map<IRowData>((x) => ({
        beneficiary: x.beneficiary,
        rocs: x.categoryROCs,
      }));
    } else {
      rData = props.report.beneficiaries.map<IRowData>((x) => ({
        beneficiary: x.beneficiary,
        rocs: x.questionROCs,
      }));
    }
    return (
      <Table celled={true}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Beneficiary</Table.HeaderCell>
            <Table.HeaderCell>Rate of Change</Table.HeaderCell>
            <Table.HeaderCell>Number of Records</Table.HeaderCell>
            <Table.HeaderCell>Report Coverage</Table.HeaderCell>
            <Table.HeaderCell>Include in Report</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {renderArray<IRowData>(this.renderRow, rData)}
        </Table.Body>
      </Table>
    );
  }

  public render() {
    return (
      <div className="roc-report-ben-table">
        {this.renderTable(this.props)}
      </div>
    );
  }
}

export {RocReportBenTable}

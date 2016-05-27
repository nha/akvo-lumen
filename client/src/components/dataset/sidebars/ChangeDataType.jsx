import React, { Component, PropTypes } from 'react';
import DashSelect from '../../common/DashSelect';
import SidebarHeader from './SidebarHeader';
import SidebarControls from './SidebarControls';

const dateFormatOptions = [
  {
    value: 'YYYY-MM-DD',
    label: 'YYYY-MM-DD',
  },
  {
    value: 'DD-MM-YYYY',
    label: 'DD-MM-YYYY',
  },
  {
    value: 'MM-DD-YYYY',
    label: 'MM-DD-YYYY',
  },
];

function DateFormatSelect({ onChange, dateFormat }) {
  return (
    <div className="inputGroup">
      <label htmlFor="dateFormatMenu">
        Date format:
      </label>
      <DashSelect
        name="dateFormatMenu"
        value={dateFormat}
        options={dateFormatOptions}
        onChange={onChange}
      />
    </div>
  );
}

DateFormatSelect.propTypes = {
  dateFormat: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function DefaultValueInput({ defaultValue, onChange }) {
  return (
    <div className="inputGroup">
      <label htmlFor="defaultValueInput">
        Default value:
      </label>
      <input
        type="text"
        value={defaultValue}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

DefaultValueInput.propTypes = {
  defaultValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};


const errorOptions = [
  {
    value: 'emptyCell',
    label: 'Leave empty',
  },
  {
    value: 'defaultValue',
    label: 'Pick a default value',
  },
  {
    value: 'fail',
    label: 'Let the transform fail',
  },
  {
    value: 'deleteRow',
    label: 'Delete the row',
  },
];

export default class ChangeDataType extends Component {

  constructor() {
    super();
    this.state = {};
    this.handleChangeErrorStrategy = this.handleChangeErrorStrategy.bind(this);
    this.mergeArgs = this.mergeArgs.bind(this);
  }


  componentWillMount() {
    const { column, newColumnType } = this.props;
    this.setState({
      op: 'core/change-datatype',
      args: {
        columnName: column.columnName,
        newType: newColumnType,
        defaultValue: null,
        dateFormat: 'YYYY-MM-DD',
      },
      onError: 'defaultValue',
      errorStrategy: 'emptyCell',
    });
  }


  mergeArgs(args) {
    this.setState({ args: Object.assign({}, this.state.args, args) });
  }

  handleChangeErrorStrategy(errorStrategy) {
    switch (errorStrategy) {
      case 'emptyCell': {
        const args = Object.assign({}, this.state.args, { defaultValue: null });
        this.setState({
          args,
          onError: 'defaultValue',
          errorStrategy,
        });
        break;
      }
      case 'defaultValue':
      case 'fail':
      case 'deleteRow': {
        this.setState({
          onError: errorStrategy,
          errorStrategy,
        });
        break;
      }
      default:
        throw new Error(`Unkown error strategy ${errorStrategy}`);
    }
  }

  render() {
    const { column, dataTypeOptions, onClose, onApply } = this.props;
    const { newType } = this.state.args;
    return (
      <div
        className="DataTableSidebar"
        style={{
          width: '300px',
          height: 'calc(100vh - 4rem)',
        }}
      >
        <SidebarHeader onClose={onClose}>
          Change data type for {column.title}
        </SidebarHeader>
        <div className="inputs">
          <div className="inputGroup">
            <label htmlFor="dataTypeMenu">
              Change data type to:
            </label>
            <DashSelect
              name="dataTypeMenu"
              value={newType}
              options={dataTypeOptions}
              onChange={type => {
                if (type === 'date') {
                  this.mergeArgs({ newType: 'date', dateFormat: 'YYYY-MM-DD' });
                }
                this.mergeArgs({ newType: type });
              }}
            />
          </div>
          {newType === 'date' ?
            <DateFormatSelect
              dateFormat={this.state.args.dateFormat}
              onChange={dateFormat => this.mergeArgs({ dateFormat })}
            /> : null}
          <div className="inputGroup">
            <label htmlFor="ifInvalidInput">
              If cell format is invalid:
            </label>
            <DashSelect
              name="dataTypeMenu"
              value={this.state.errorStrategy}
              options={errorOptions}
              onChange={this.handleChangeErrorStrategy}
            />
          </div>
          {this.state.errorStrategy === 'defaultValue' ?
            <DefaultValueInput
              defaultValue={this.state.args.defaultValue}
              onChange={defaultValue => this.mergeArgs({ defaultValue })}
            /> : null}
        </div>
        <SidebarControls
          onApply={() => onApply(this.state)}
          onClose={onClose}
        />
      </div>
    );
  }
}

ChangeDataType.propTypes = {
  column: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  dataTypeOptions: PropTypes.array.isRequired,
  newColumnType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

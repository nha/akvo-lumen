import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import SidebarHeader from './SidebarHeader';
import SidebarControls from './SidebarControls';

function trim(transformation) {
  return transformation.updateIn(['args', 'newColumnTitle'], title => title.trim());
}

export default class RenameColumn extends Component {

  componentWillMount() {
    const { column } = this.props;
    this.setState({
      transformation: Immutable.fromJS({
        op: 'core/rename-column',
        args: {
          columnName: column.get('columnName'),
          newColumnTitle: column.get('title'),
        },
        onError: 'fail',
      }),
    });
  }

  isValidTransformation() {
    const { transformation } = this.state;
    return transformation.getIn(['args', 'newColumnTitle']).trim() !== '';
  }

  handleChangeNewColumnTitle(value) {
    const { transformation } = this.state;
    this.setState({
      transformation: transformation.setIn(['args', 'newColumnTitle'], value),
    });
  }

  render() {
    const { onClose, onApply } = this.props;
    const { transformation } = this.state;
    const args = transformation.get('args');
    return (
      <div
        className="DataTableSidebar"
        style={{
          width: '300px',
          height: 'calc(100vh - 4rem)',
        }}
      >
        <SidebarHeader onClose={onClose}>
          Rename Column
        </SidebarHeader>
        <div className="inputs">
          <div className="inputGroup">
            <label htmlFor="titleTextInput">
              New column title
            </label>
            <input
              value={args.get('newColumnTitle')}
              type="text"
              className="titleTextInput"
              onChange={evt => this.handleChangeNewColumnTitle(evt.target.value)}
            />
          </div>
        </div>
        <SidebarControls
          positiveButtonText="Rename"
          onApply={this.isValidTransformation() ? () => onApply(trim(transformation)) : null}
          onClose={onClose}
        />
      </div>
    );
  }
}

RenameColumn.propTypes = {
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  column: PropTypes.object.isRequired,
};

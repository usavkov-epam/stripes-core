import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router';

import { withModules } from '../Modules';
import LastVisitedContext from './LastVisitedContext';

function withLastVisited(WrappedComponent) {
  class LastVisited extends React.Component {
    static propTypes = {
      history: PropTypes.shape({
        listen: PropTypes.func.isRequired,
      }).isRequired,
      modules: PropTypes.shape({
        app: PropTypes.array,
      }),
    };

    constructor(props) {
      super();

      const { modules, history } = props;

      this.moduleList = modules.app.concat({
        route: '/settings',
        module: '@folio/x_settings',
      });

      this.goBack = this.goBack.bind(this);
      this.lastVisited = {};
      this.previous = {};

      history.listen((location) => {
        const module = this.getCurrentModule(location);
        if (!module) return;
        const name = module.module.replace(/^@folio\//, '');
        this.previous[name] = this.lastVisited[name];
        this.lastVisited[name] = `${location.pathname}${location.search}`;
        this.currentName = name;
      });
    }

    getCurrentModule(location) {
      return this.moduleList.filter(entry => (location.pathname === entry.route ||
        location.pathname.startsWith(`${entry.route}/`)));
    }

    goBack() {
      const name = this.currentName;
      this.lastVisited[name] = this.previous[name];
    }

    render() {
      return (
        <LastVisitedContext.Provider value={{ lastVisited: this.lastVisited, goBack: this.goBack }}>
          <WrappedComponent {...this.props} />
        </LastVisitedContext.Provider>
      );
    }
  }

  return LastVisited;
}

export default compose(
  withRouter,
  withModules,
  withLastVisited,
);

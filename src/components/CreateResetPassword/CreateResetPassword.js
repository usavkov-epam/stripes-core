import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
// import {
//   reduxForm,
//
//   Form,
//   formValueSelector,
// } from 'redux-form';
import {
  Field
} from 'react-final-form';
import stripesFinalForm from '@folio/stripes-final-form';
import isEmpty from 'lodash/isEmpty';

import {
  TextField,
  Button,
  Row,
  Col,
  PasswordStrength,
  Headline,
} from '@folio/stripes-components';


import { setAuthError } from '../../okapiActions';
import { stripesShape } from '../../Stripes';

import OrganizationLogo from '../OrganizationLogo';
import AuthErrorsContainer from '../AuthErrorsContainer';
import FieldLabel from './components/FieldLabel';

import styles from './CreateResetPassword.css';

class CreateResetPassword extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    onSubmit: PropTypes.func.isRequired,
    clearAuthErrors: PropTypes.func.isRequired,
    onPasswordInputFocus: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    errors: PropTypes.arrayOf(PropTypes.object),
    submitIsFailed: PropTypes.bool,
    form: PropTypes.shape({
      getState: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    submitting: false,
    errors: [],
    submitIsFailed: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      passwordMasked: true,
    };
    this.translationNamespaces = {
      module: 'stripes-core',
      smartComponents: 'stripes-smart-components',
      page: 'stripes-core.createResetPassword',
      errors: 'stripes-core.errors',
      button: 'stripes-core.button',
    };
    this.passwordMatchErrorCode = 'password.match.error';
    this.validators = {
      confirmPassword: this.confirmPasswordFieldValidation,
    };
    this.inputColProps = {
      xs:12,
      sm:8,
    };
    this.passwordMeterColProps = {
      xs:12,
      sm:4,
      className:styles.passwordStrength,
    };
  }

  togglePasswordMask = () => {
    this.setState(({ passwordMasked }) => ({
      passwordMasked: !passwordMasked,
    }));
  };

  confirmPasswordFieldValidation = (value, { newPassword, confirmPassword } = {}) => {
    const confirmPasswordValid = !(newPassword && confirmPassword && newPassword !== confirmPassword);
    const { clearAuthErrors } = this.props;

    if (!confirmPasswordValid) {
      this.validationHandler(
        [this.passwordMatchErrorCode],
        this.translationNamespaces.errors,
      );
    } else {
      clearAuthErrors();
    }
  };

  validationHandler = (errors, translationNamespace) => {
    const {
      stripes: {
        store: {
          dispatch
        }
      }
    } = this.props;

    dispatch(setAuthError(errors.map((error) => {
      return {
        code: error,
        translationNamespace,
      };
    })));
  };

  render() {
    const {
      submitting,
      onSubmit,
      onPasswordInputFocus,
      submitIsFailed,
      form,
    } = this.props;

    const errors = this.props.stripes.okapi.authFailure;

    const { newPassword, confirmPassword } = form.getState().values;
    const { passwordMasked } = this.state;
    const submissionStatus = submitting || submitIsFailed;
    const buttonDisabled = !isEmpty(errors) || submissionStatus || !(newPassword && confirmPassword);
    const passwordType = passwordMasked ? 'password' : 'text';
    const buttonLabelId = `${this.translationNamespaces.module}.${submitting ? 'settingPassword' : 'setPassword'}`;
    const passwordToggleLabelId = `${this.translationNamespaces.button}.${passwordMasked ? 'show' : 'hide'}Password`;

    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <Row center="xs">
            <Col
              xs={12}
              sm={6}
            >
              <OrganizationLogo />
            </Col>
          </Row>
          <Row center="xs">
            <Col
              xs={12}
              sm={6}
            >
              <Headline
                margin="none"
                size="xx-large"
                tag="h1"
                data-test-h1
              >
                <FormattedMessage id={`${this.translationNamespaces.page}.header`} />
              </Headline>
            </Col>
          </Row>
          <Row>
            <form
              className={styles.form}
              onSubmit={onSubmit}
            >
              <div data-test-new-password-field>
                <Row center="xs">
                  <Col
                    xs={12}
                    sm={6}
                  >
                    <FieldLabel htmlFor="new-password">
                      <FormattedMessage id={`${this.translationNamespaces.page}.newPassword`} />
                    </FieldLabel>
                  </Col>
                </Row>
                <Row
                  center="xs"
                  end="sm"
                >
                  <Col
                    xs={12}
                    sm={9}
                  >
                    <Field
                      id="new-password"
                      name="newPassword"
                      autoComplete="new-password"
                      component={PasswordStrength}
                      inputClass={styles.input}
                      type={passwordType}
                      hasClearIcon={false}
                      autoFocus
                      errors={errors}
                      marginBottom0
                      fullWidth
                      inputColProps={this.inputColProps}
                      passwordMeterColProps={this.passwordMeterColProps}
                      onFocus={() => onPasswordInputFocus(submitIsFailed)}
                    />
                  </Col>
                </Row>
              </div>
              <div data-test-confirm-password-field>
                <Row center="xs">
                  <Col
                    xs={12}
                    sm={6}
                  >
                    <FieldLabel htmlFor="confirm-password">
                      <FormattedMessage id={`${this.translationNamespaces.page}.confirmPassword`} />
                    </FieldLabel>
                  </Col>
                </Row>
                <Row
                  end="sm"
                  center="xs"
                  bottom="xs"
                >
                  <Col
                    xs={12}
                    sm={6}
                  >
                    <div className={styles.formGroup}>
                      <Field
                        id="confirm-password"
                        component={TextField}
                        name="confirmPassword"
                        type={passwordType}
                        marginBottom0
                        fullWidth
                        inputClass={styles.input}
                        validationEnabled={false}
                        hasClearIcon={false}
                        autoComplete="new-password"
                        validate={this.validators.confirmPassword}
                      />
                    </div>
                  </Col>
                  <Col
                    sm={3}
                    xs={12}
                  >
                    <div
                      data-test-change-password-toggle-mask-btn
                      className={styles.toggleButtonWrapper}
                    >
                      <Button
                        type="button"
                        buttonStyle="link"
                        onClick={this.togglePasswordMask}
                      >
                        <FormattedMessage id={passwordToggleLabelId} />
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
              <Row center="xs">
                <Col
                  xs={12}
                  sm={6}
                >
                  <div
                    className={styles.formGroup}
                    data-test-submit
                  >
                    <Button
                      buttonStyle="primary"
                      id="clickable-login"
                      type="submit"
                      buttonClass={styles.submitButton}
                      disabled={buttonDisabled}
                      fullWidth
                      marginBottom0
                    >
                      <FormattedMessage id={buttonLabelId} />
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row center="xs">
                <Col
                  xs={12}
                  sm={6}
                >
                  <div className={styles.authErrorsWrapper}>
                    <AuthErrorsContainer errors={errors} />
                  </div>
                </Col>
              </Row>
            </form>
          </Row>
        </div>
      </div>
    );
  }
}

export default stripesFinalForm({
  navigationCheck: true,
})(CreateResetPassword);


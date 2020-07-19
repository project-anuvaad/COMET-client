import React from "react";
import { Checkbox, Radio } from "semantic-ui-react";
import { USER_ROLES } from "../constants";

export default class PermissionsEditor extends React.Component {
  state = {
    selectedRoles: [],
    selectedSubroles: [],
    mainSelected: "admin",
  };
  componentDidMount = () => {
    if (this.props.permissions) {
      this.initRoles(this.props.permissions);
    }
  };
  componentWillReceiveProps = (nextProps) => {
    if (this.props.permissions !== nextProps.permissions) {
      this.initRoles(nextProps.permissions);
    }
  };

  initRoles = (permissions) => {
    if (permissions && permissions.length > 0) {
      const roles = [];
      const subroles = [];
      permissions.forEach((permission) => {
        const role = USER_ROLES.find((r) => r.value === permission);
        if (role) {
          // Add role if it exists
          roles.push(role);
          // If the role has subroles and no permissions are avaiable for that subrole
          // then add all it's the subroles to the selected for backward compatabilit
          // e.g old translate permission include translate_text, voice_over_artist and approve_translations
          if (
            role.subroles &&
            role.subroles.filter((r) => permissions.indexOf(r.value) !== -1)
              .length === 0
          ) {
            role.subroles.forEach((subrole) => {
              subroles.push(subrole);
            });
          }
        } else {
          // there's no main role, so check for subroles
          const mainRole = USER_ROLES.find((r) =>
            r.subroles
              ? r.subroles.map((r) => r.value).indexOf(permission) !== -1
              : false
          );
          if (mainRole) {
            if (!roles.find((r) => r.value === mainRole.value)) {
              roles.push(mainRole);
            }
            subroles.push(
              mainRole.subroles.find((r) => r.value === permission)
            );
          }
        }
      });
      let mainSelected = "others";
      if (subroles && subroles.length > 0) {
        mainSelected = "others";
      } else if (roles && roles.length === 1 && ['admin', 'project_leader'].indexOf(roles[0].value) !== -1) {
        mainSelected = roles[0].value;
      }
      this.setState({
        selectedRoles: roles,
        selectedSubroles: subroles,
        mainSelected,
      });
    }
  };

  onSelectRole = (role) => {
    const { selectedRoles, selectedSubroles } = this.state;
    const stateChanges = {
      selectedRoles: selectedRoles.slice(),
      selectedSubroles: selectedSubroles.slice(),
    };
    const propChanges = { permissions: [] };
    if (selectedRoles.map((r) => r.value).indexOf(role.value) === -1) {
      // Add Role and subroles
      if (role.single) {
        stateChanges.selectedRoles = [role];
        stateChanges.selectedSubroles = [];
        propChanges.permissions = [role.value];
        // this.setState({ selectedRoles: [role] })
      } else {
        selectedRoles.push(role);
        stateChanges.selectedRoles = selectedRoles
          .filter((r) => !r.single)
          .slice();
        propChanges.permissions = selectedRoles
          // .filter((r) => !r.single)
          .concat(selectedSubroles)
          .map((r) => r.value);
        // this.setState({ selectedRoles: selectedRoles.filter(r => !r.single).slice() })
      }
      if (role.subroles) {
        if (role.single) {
          stateChanges.selectedSubroles = role.subroles;
          propChanges.permissions = role.subroles.map((r) => r.value);
          // this.setState({ selectedSubroles: role.subroles });
        } else {
          const newSubroles = selectedSubroles.concat(role.subroles);
          stateChanges.selectedSubroles = newSubroles;
          propChanges.permissions = propChanges.permissions.concat(
            newSubroles.map((r) => r.value)
          );
          // this.setState({ selectedSubroles: newSubroles });
        }
      }
    } else {
      // Remove role and subroles
      const newSelectedRoles = selectedRoles.filter(
        (r) => r.value !== role.value
      );
      stateChanges.selectedRoles = newSelectedRoles;
      propChanges.permissions = newSelectedRoles.map((r) => r.value);
      // this.setState({ selectedRoles: newSelectedRoles });
      if (role.subroles) {
        // remove subroles
        const subroles = role.subroles.map((r) => r.value);
        const newSubroles = selectedSubroles.filter(
          (r) => subroles.indexOf(r.value) === -1
        );
        stateChanges.selectedSubroles = newSubroles;
        propChanges.permissions = propChanges.permissions
          .filter((r) => subroles.indexOf(r) === -1)
          .concat(newSubroles.map((r) => r.value));
        this.setState({ selectedSubroles: newSubroles });
      } else {
        propChanges.permissions = propChanges.permissions.concat(selectedSubroles.map(r => r.value))
      }
    }
    // remove review/translate roles as it's deprecated
    propChanges.permissions = propChanges.permissions.filter(
      (p) => ["review", "translate"].indexOf(p) === -1
    );
    stateChanges.selectedRoles = stateChanges.selectedRoles.filter((r, i) => stateChanges.selectedRoles.map(r => r.value).indexOf(r.value) === i);
    stateChanges.selectedSubroles = stateChanges.selectedSubroles.filter((r, i) => stateChanges.selectedSubroles.map(r => r.value).indexOf(r.value) === i);
    propChanges.permissions = propChanges.permissions.filter((p, i) => propChanges.permissions.indexOf(p) === i);

    this.setState({
      ...stateChanges,
      mainSelected:
        role.value === "admin" || role.value === "project_leader"
          ? role.value
          : this.state.mainSelected,
    });
    this.props.onChange(propChanges);
  };

  onSubroleClick = (subrole, role) => {
    const { value } = subrole;
    const { selectedSubroles, selectedRoles } = this.state;
    const stateChanges = {};
    const propChanges = {
      permissions: this.state.selectedRoles
        // .filter((r) => r.value === role.value)
        .map((r) => r.value),
    };

    if (selectedSubroles.map((r) => r.value).indexOf(value) === -1) {
      // add subrole
      selectedSubroles.push(subrole);
      stateChanges.selectedSubroles = selectedSubroles.slice();
      if (selectedRoles.map((r) => r.value).indexOf(role.value) === -1) {
        const newSelectedRoles = selectedRoles.slice();
        newSelectedRoles.push(role);
        stateChanges.selectedRoles = newSelectedRoles;
      }
      propChanges.permissions = propChanges.permissions.concat(
        selectedSubroles.map((r) => r.value)
      );
    } else {
      // remove subrole
      const newSubroles = selectedSubroles.filter((r) => r.value !== value);
      stateChanges.selectedSubroles = newSubroles;
      propChanges.permissions = propChanges.permissions.concat(
        newSubroles.map((r) => r.value)
      );
      // if no more subroles for the same role, remove the role
      const allSubroles = role.subroles;
      if (
        newSubroles
          .map((r) => r.value)
          .every((r) => allSubroles.map((r) => r.value).indexOf(r) === -1)
      ) {
        stateChanges.selectedRoles = selectedRoles.filter(
          (r) => r.value !== role.value
        );
      }
    }
    // stateChanges.selectedRoles = selectedRoles.filter(r => r.value === role.value)
    // remove review/translate roles as it's deprecated
    propChanges.permissions = propChanges.permissions.filter(
      (p) => ["review", "translate"].indexOf(p) === -1
    );
    this.setState(stateChanges);
    this.props.onChange(propChanges);
  };

  render() {
    const signleRoles = USER_ROLES.filter((r) => r.single);
    const otherRoles = USER_ROLES.filter((r) => !r.single);

    return (
      <div>
        {signleRoles.map((role, index) => (
          <div key={`role-select-item-${role.name}`}>
            <div>
              <Radio
                style={{ marginTop: 10 }}
                label={role.name}
                checked={
                  this.state.selectedRoles
                    .map((r) => r.value)
                    .indexOf(role.value) !== -1
                }
                onClick={() => this.onSelectRole(role)}
              />
            </div>
          </div>
        ))}
        <div>
          <Radio
            style={{ marginTop: 10 }}
            label={"Other"}
            checked={this.state.mainSelected === "others"}
            onClick={() =>
              this.setState({
                mainSelected: "others",
                selectedRoles: this.state.selectedRoles.filter(
                  (r) => r.value !== "admin" && r.value !== "project_leader"
                ),
              })
            }
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              marginLeft: 20,
              marginBottom: 10,
              position: "relative",
            }}
          >
            {otherRoles.map((role, index) => (
              <div key={`role-select-item-${role.name}`}>
                <div>
                  <Checkbox
                    disabled={this.state.mainSelected !== "others"}
                    style={{ marginTop: 10 }}
                    label={role.name}
                    checked={
                      this.state.selectedRoles
                        .map((r) => r.value)
                        .indexOf(role.value) !== -1
                    }
                    onChange={() => this.onSelectRole(role)}
                  />
                </div>
                {role.subroles && role.subroles.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      marginLeft: 20,
                      marginTop: 10,
                    }}
                  >
                    {role.subroles.map((subrole) => (
                      <Checkbox
                        disabled={this.state.mainSelected !== "others"}
                        key={`subrole-${role.value}-${subrole.value}`}
                        style={{ marginBottom: 10 }}
                        label={subrole.name}
                        checked={
                          this.state.selectedSubroles
                            .map((r) => r.value)
                            .indexOf(subrole.value) !== -1
                        }
                        onChange={(e) => this.onSubroleClick(subrole, role)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

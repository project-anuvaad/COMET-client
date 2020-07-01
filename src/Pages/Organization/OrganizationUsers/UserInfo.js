import React from "react";
import ReactAvatar from "react-avatar";
import { getUserNamePreview } from "../../../shared/utils/helpers";
import { USER_ROLES_TITLE_MAP } from "../../../shared/constants";

export default class UserInfo extends React.Component {
  render() {
    const { user } = this.props;
    const orgRole = user.organizationRoles.find(
      (r) => r.organization === this.props.organization._id
    );
    if (!orgRole) return null;
    const isOrganizationOwner = orgRole.organizationOwner;

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <ReactAvatar name={getUserNamePreview(user)} round size={30} />
        <div style={{ marginLeft: 10 }}>
          <p style={{ marginBottom: 5 }}>
            {user.firstname && user.lastname ? (
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  textTransform: "capitalize",
                }}
              >
                {user.firstname} {user.lastname}
              </span>
            ) : (
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {user.email}
              </span>
            )}
            <small
              style={{
                marginLeft: 10,
                color: "#999999",
                fontSize: 12,
              }}
            >
              ({user.email})
            </small>
          </p>
          <p style={{ marginBottom: 0, color: '#666666' }}>
            {isOrganizationOwner ? "Organization Owner" : ""}
            {orgRole &&
              orgRole.permissions &&
              orgRole.permissions
                .map((permission) =>
                  permission === "review"
                    ? "transcribe"
                    : USER_ROLES_TITLE_MAP[permission]
                )
                .join(", ")}
          </p>
        </div>
      </div>
    );
  }
}

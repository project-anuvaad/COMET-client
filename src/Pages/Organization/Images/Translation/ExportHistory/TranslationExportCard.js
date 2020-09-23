import React from "react";
import { Card, Button, Popup } from "semantic-ui-react";
import moment from "moment";
import Avatar from "react-avatar";
import { getUserNamePreview } from "../../../../../shared/utils/helpers";

function renderInfoRow({ title, user, users }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        // flexDirection: "column",
        alignItems: "center",
        marginBottom: "1rem",
      }}
    >
      <p style={{ margin: 0 }}>{title}</p>
      <div>
        {user ? (
          <Popup
            content={getUserNamePreview(user)}
            trigger={
              <div style={{ marginLeft: 10 }}>
                <Avatar name={getUserNamePreview(user)} size={30} round />
              </div>
            }
          />
        ) : (
          users.map((u) => (
            <Popup
              key={`translation_by-${u.email}`}
              content={getUserNamePreview(u)}
              trigger={
                <div style={{ marginLeft: 10 }}>
                  <Avatar name={getUserNamePreview(u)} size={30} round />
                </div>
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

export default class TranslationExportCard extends React.Component {
  render() {
    const { imageTranslationExport } = this.props;

    const loading = imageTranslationExport.status === 'processing';

    return (
      <Card fluid style={{ borderRadius: 16, overflowY: 'hidden', opacity: loading ? 0.7 : 1 }}>
        <div>
          <img
            src={imageTranslationExport.imageUrl}
            style={{ width: "100%", height: 350 }}
          />
        </div>
        <div style={{ padding: "1rem" }}>
          <h3 style={{ textTransform: "capitalize", marginBottom: 0 }}>
            Version: {imageTranslationExport.version}.
            {imageTranslationExport.subVersion}
          </h3>
          <div style={{ color: "#999999", marginBottom: '2rem' }}>
            <p>
              <small>
                {moment(imageTranslationExport.created_at).format(
                  "DD MMM YYYY hh:mm a"
                )}
              </small>
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              flexDirection: "column",
              marginBottom: '2rem',
            }}
          >
            {imageTranslationExport.exportRequestBy &&
              renderInfoRow({
                title: "Exported by",
                user: imageTranslationExport.exportRequestBy,
              })}
          </div>
          <div>
            <a href={imageTranslationExport.imageUrl} target="_blank">
              <Button basic primary circular loading={loading} disabled={loading} >
                Download
              </Button>
            </a>
          </div>
        </div>
      </Card>
    );
  }
}

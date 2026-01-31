import React from "react";
import "./Error.css";

const PageError = ({ error }: any) => {
  return (
    <div className="pageOrder__error">
      <div className="pageOrder__error_Content">
        <div
          style={{
            maxWidth: "200px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <br />
          {`${error}. Что пошло не так! Перезагрузите страницу`}
        </div>
      </div>
    </div>
  );
};

export default PageError;
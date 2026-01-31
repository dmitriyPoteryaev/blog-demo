import React from "react";

import { Spin } from "antd";
import "./Loader.css";
import classNames from "classnames";

const Loader = (props: any) => {
  const { className, description } = props;

  const BlockLoaderClasses = classNames({
    [className]: !!className,
    pageOrder__loader: !!className ? false : true,
  });

  return (
    <div className={BlockLoaderClasses}>
      <div className="pageOrder__loader_Content">
        <div
          style={{
            maxWidth: "200px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          {description}
        </div>
        <Spin size="large" />
      </div>
    </div>
  );
};

export default Loader;
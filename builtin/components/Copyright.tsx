import site from "configs/site.config.mts"

export default () => {
  return (
    <span>
      Copyright © {site.copyright.year} {site.copyright.name} All Rights
      Reserved.
    </span>
  );
};

const express = require("express");
const router = express.Router();

const versions = ["v1"];
versions.forEach((version) => {
  const versionRoutes = require(`./${version}/routes`);
  router.use(`/${version}`, versionRoutes);
});

module.exports = router;

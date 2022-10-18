"use strict";

const acl = (capability) => {
  return (req, res, next) => {
    try {
      if (req.user.capabilities.includes(capability)) {
        next();
      } else {
        next(`Access Denied for ${capability}`);
      }
    } catch (error) {
      next("You Are not Allowed to do this");
    }
  };
};

module.exports = acl;
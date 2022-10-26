"use strict";

// ACL middleware for checking if user is admin or not
const acl = (capability) => {
  return (req, res, next) => {
    try {
      if (req.user.capabilities.includes(capability)) {
        next();
      } else {
        next(`Access Denied for ${capability}`);
      }
    } catch (error) {
      next("You are not allowed to do this!");
    }
  };
};

module.exports = acl;
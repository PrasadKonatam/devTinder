const adminAuth = (req, res, next) => {
  console.log(" user Authenticated");
  const token = "prasad";
  const isAunthenticated = token === "prasad";
  if (!isAunthenticated) {
    res.status(401).send("Unauthorized user");
  } else {
    next();
  }
};

module.exports = { adminAuth };

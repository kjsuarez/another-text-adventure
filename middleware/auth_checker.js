const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    console.log("inside middleware, heaaders look like this:")
    console.log(req.headers)
    const token = req.headers.authorization.split(" ")[1];    
    jwt.verify(token, "secret_secret_extra_super_secret")
    next()
  } catch (error) {
    console.log("error:")
    console.log(error)
    res.status(401).json( { message: "failed to authenticate" } )
  }
}

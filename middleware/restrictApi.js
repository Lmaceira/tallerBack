module.exports = ((req, res, next) => {
  console.log(req.ip);
  if (req.ip !== '1') { // Wrong IP address
    res.status(401);
    return res.send('Permission denied')
  } else 
    next()
})
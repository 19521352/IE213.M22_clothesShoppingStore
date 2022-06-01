module.exports = (err, req, res, next) => {
  res.render('error', { layout: 'no-left-sidebar' })
}

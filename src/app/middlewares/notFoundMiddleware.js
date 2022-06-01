module.exports = (req, res, next) => {
  res.render('404', { layout: 'no-left-sidebar' })
}

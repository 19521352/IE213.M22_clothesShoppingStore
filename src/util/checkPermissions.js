const checkPermissions = (requestUserId, resourceUserId) => {
  if (
    requestUserId === resourceUserId.toString() ||
    requestUserId === '19521352@gm.uit.edu.vn'
  ) {
    return true
  } else return false
}

module.exports = checkPermissions

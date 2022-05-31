const checkPermissions = (requestUserId, resourceUserId) => {
  if (requestUserId === resourceUserId.toString()) {
    return true
  } else return false
}

module.exports = checkPermissions

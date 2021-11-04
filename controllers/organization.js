const { request, response } = require('express')
const organization = require('../models/organization')
const getAllOrganizations = async (
  req = request,
  res = response
) => {
  try {
    const result = await organization.find()
    if (!result) {
      return res
        .status(404)
        .json({ ok: false, msg: 'No hay Organizaciones' })
    }

    return res.status(200).json({
      ok: true,
      organizations: result,
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error,
    })
  }
}

const findByIdOrg = async (
  req = request,
  res = response
) => {
  try {
    const result = await organization.find({
      acronym: req.params.orgId,
    })
    if (!result) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe esa organizacion',
      })
    }

    return res.status(200).json({
      ok: true,
      organizations: result,
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: err,
    })
  }
}
module.exports = {
  getAllOrganizations,
  findByIdOrg,
}

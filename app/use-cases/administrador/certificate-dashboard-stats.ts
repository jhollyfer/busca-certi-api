/* eslint-disable @unicorn/filename-case */
import {
  CertificateStatusCorrection,
  CertificateStatusDelivery,
  UserRoleEnum,
} from '#constants/enums'
import Certificate from '#models/certificate'
import User from '#models/user'
import { inject } from '@adonisjs/core'

@inject()
export default class CertificateDashboardStatsUseCase {
  public async execute() {
    const [statudents] = await User.query().where('role', UserRoleEnum.STUDENT).count({
      statudents: '*',
    })

    const [certificates] = await Certificate.query().count({
      total: '*',
    })

    const [available] = await Certificate.query()
      .where('status_delivery', CertificateStatusDelivery.AVAILABLE)
      .count({
        available: '*',
      })

    const [delivered] = await Certificate.query()
      .where('status_delivery', CertificateStatusDelivery.DELIVERED)
      .count({
        delivered: '*',
      })

    const [needsCorrection] = await Certificate.query()
      .where('status_correction', CertificateStatusCorrection.NEEDS_CORRECTION)
      .count({
        needsCorrection: '*',
      })

    return {
      statudents: statudents?.toJSON()?.statudents,
      certificates: {
        total: certificates?.toJSON()?.total,
        available: available?.toJSON()?.available,
        delivered: delivered?.toJSON()?.delivered,
        needsCorrection: needsCorrection?.toJSON()?.needsCorrection,
      },
    }
  }
}

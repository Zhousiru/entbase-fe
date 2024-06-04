import { NotificationData } from '@mantine/notifications'

const notification: NotificationData = {
  message: '',
  withBorder: true,
}

export const notificationInfo: NotificationData = {
  ...notification,
  color: 'blue',
}

export const notificationSuccess: NotificationData = {
  ...notification,
  color: 'green',
}

export const notificationError: NotificationData = {
  ...notification,
  color: 'red',
}

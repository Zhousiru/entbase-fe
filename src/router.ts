// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/buckets`
  | `/buckets/:bucketId`
  | `/login`
  | `/my`
  | `/register`
  | `/s/:id`
  | `/seekback`
  | `/settings`
  | `/shared-links`

export type Params = {
  '/buckets/:bucketId': { bucketId: string }
  '/s/:id': { id: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<
  Path,
  Params,
  ModalPath
>()
export const { redirect } = utils<Path, Params>()

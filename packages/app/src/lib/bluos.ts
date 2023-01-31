import { invoke } from '@tauri-apps/api/tauri'
import { configureDiscovery, observeStatus, startDiscovery, type Discovery } from 'bluos'
import { ReplaySubject } from 'rxjs'

const endpoint$ = new ReplaySubject<string>(1)

const discovery: Discovery = {
  observeDeviceEndpoint: () => endpoint$,
  startDiscovery: async () => {
    endpoint$.next(await invoke('get_bluos_url'))
  },
  stopDiscovery: async () => {},
}

configureDiscovery(discovery)

startDiscovery()

export const status$ = observeStatus()

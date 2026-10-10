type ContainerType = {
  name: string
  port: number
  node_version: string
}

const deployment = {
  container: {
    name: 'ocboapps',
    port: 9000,
    node_version: '24.20-alpine',
  } satisfies ContainerType,
}

export { deployment as default }

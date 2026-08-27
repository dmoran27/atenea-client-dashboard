const moduleFiles = import.meta.glob<{ init?: () => void; register?: () => void }>(
  '/src/modules/*/index.ts',
  { eager: true },
)

export function initModules() {
  for (const path in moduleFiles) {
    const moduleExports = moduleFiles[path]

    if (moduleExports?.init) {
      moduleExports.init()
    } else if (moduleExports?.register) {
      moduleExports.register()
    }
  }
}
